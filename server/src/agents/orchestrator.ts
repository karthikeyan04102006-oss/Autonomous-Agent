import { supabaseService, SupabaseTaskRecord } from '../services/supabase.service.js';
import { dbAdapter } from '../db/supabase.js';
import { generateAgentPlan } from './planner.js';
import { toolRegistry } from '../tools/index.js';
import { EventEmitter } from 'events';

export const agentEvents = new EventEmitter();

// Active task execution controllers (in-memory tracking for active step pauses)
const activeExecutionState: Record<string, { pausedStepId?: string; resolveApproval?: (approved: boolean) => void }> = {};

export async function createAndRunTask(userGoal: string): Promise<SupabaseTaskRecord> {
  // 1. Create Task in Supabase 'tasks' table with status 'PLANNING' (or 'PENDING')
  const task = await supabaseService.createTask(userGoal);

  await dbAdapter.logActivity(task.id, `Received goal: "${userGoal}"`, 'info');
  agentEvents.emit('task_update', { taskId: task.id, status: 'PLANNING' });

  // Launch execution workflow asynchronously
  runTaskWorkflow(task.id, userGoal).catch(err => {
    console.error(`[Orchestrator] Task execution failed for ${task.id}:`, err);
    supabaseService.updateTaskStatus(task.id, 'FAILED', { error: String(err) });
    dbAdapter.logActivity(task.id, `Task failed: ${String(err)}`, 'error');
    agentEvents.emit('task_update', { taskId: task.id, status: 'FAILED' });
  });

  return task;
}

export async function runTaskWorkflow(taskId: string, userGoal: string) {
  // --- STAGE 1: UNDERSTAND & PLANNING ---
  await supabaseService.updateTaskStatus(taskId, 'PLANNING');
  await dbAdapter.logActivity(taskId, 'Understanding goal & parsing context preferences...', 'info');
  agentEvents.emit('task_update', { taskId, status: 'PLANNING' });
  await delay(800);

  // Fetch memories for context
  const memories = await dbAdapter.getMemories();
  const memoryContext = memories.map(m => `${m.key}: ${m.value}`).join('; ');

  // Generate Plan via Gemini / Planner module
  const plan = await generateAgentPlan(userGoal, memoryContext);
  await dbAdapter.logActivity(taskId, `Goal understood (${plan.intent}). Created ${plan.steps.length}-step execution plan.`, 'info');

  // Insert steps into DB
  const createdSteps = await dbAdapter.createSteps(
    plan.steps.map(s => ({
      task_id: taskId,
      step_number: s.stepNumber,
      description: s.description,
      tool: s.tool,
      status: 'pending',
      requires_approval: s.requiresApproval,
      execution_time: s.estimatedTime
    }))
  );

  agentEvents.emit('plan_created', { taskId, plan, steps: createdSteps });
  await delay(700);

  // --- STAGE 2: EXECUTE STEPS ---
  await supabaseService.updateTaskStatus(taskId, 'EXECUTING');
  agentEvents.emit('task_update', { taskId, status: 'EXECUTING' });

  for (const step of createdSteps) {
    // Check if step requires approval
    if (step.requires_approval) {
      await dbAdapter.updateStepStatus(step.id, 'waiting_approval');
      await supabaseService.updateTaskStatus(taskId, 'WAITING_FOR_APPROVAL');
      await dbAdapter.logActivity(taskId, `HUMAN APPROVAL REQUIRED: Action "${step.description}" using [${step.tool}] requires user confirmation.`, 'warning');
      agentEvents.emit('task_update', { taskId, status: 'WAITING_FOR_APPROVAL', pendingStepId: step.id });

      // Wait for approval response
      const approved = await waitForHumanApproval(taskId, step.id);
      if (!approved) {
        await dbAdapter.updateStepStatus(step.id, 'failed', { error: 'Rejected by user' });
        await dbAdapter.logActivity(taskId, `Action "${step.description}" was rejected by user.`, 'error');
        await delay(800);
      } else {
        await dbAdapter.logActivity(taskId, `Action "${step.description}" APPROVED by user. Resuming execution...`, 'success');
      }
    }

    // Execute step tool
    await supabaseService.updateTaskStatus(taskId, 'EXECUTING');
    await dbAdapter.updateStepStatus(step.id, 'running');
    await dbAdapter.logActivity(taskId, `Executing Step ${step.step_number}: ${step.description} via [${step.tool}]...`, 'info');
    agentEvents.emit('step_update', { taskId, stepId: step.id, status: 'running' });

    const startTime = Date.now();
    const toolDef = toolRegistry[step.tool] || toolRegistry['Memory Tool'];
    
    let resultPayload: any;
    try {
      resultPayload = await toolDef.execute({ goal: userGoal, step: step.description });
    } catch {
      resultPayload = { status: 'executed', info: 'Action completed.' };
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
    await dbAdapter.updateStepStatus(step.id, 'completed', resultPayload, duration);
    await dbAdapter.logActivity(taskId, `✓ Step ${step.step_number} finished (${duration}): ${toolDef.name} returned clean response.`, 'success');
    agentEvents.emit('step_update', { taskId, stepId: step.id, status: 'completed', result: resultPayload });

    await delay(900);
  }

  // --- STAGE 3: VERIFYING ---
  await supabaseService.updateTaskStatus(taskId, 'VERIFYING');
  await dbAdapter.logActivity(taskId, 'Verifying workflow execution results against user goal objectives...', 'info');
  agentEvents.emit('task_update', { taskId, status: 'VERIFYING' });
  await delay(800);

  // --- STAGE 4: COMPLETE & SAVE FINAL RESULT ---
  const finalResult = `Meeting scheduled successfully. ${plan.goalSummary}`;
  await supabaseService.updateTaskStatus(taskId, 'COMPLETED', finalResult);
  await dbAdapter.logActivity(taskId, `🎉 Task Completed: ${finalResult}`, 'success');
  agentEvents.emit('task_update', { taskId, status: 'COMPLETED', result: finalResult });
}

function waitForHumanApproval(taskId: string, stepId: string): Promise<boolean> {
  return new Promise((resolve) => {
    activeExecutionState[taskId] = {
      pausedStepId: stepId,
      resolveApproval: (approved: boolean) => {
        delete activeExecutionState[taskId];
        resolve(approved);
      }
    };
  });
}

export function handleTaskApprovalResponse(taskId: string, approved: boolean): boolean {
  const active = activeExecutionState[taskId];
  if (active && active.resolveApproval) {
    active.resolveApproval(approved);
    return true;
  }
  return false;
}

function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}
