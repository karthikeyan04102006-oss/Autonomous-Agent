import { Router, Request, Response } from 'express';
import { supabaseService } from '../services/supabase.service.js';
import { dbAdapter } from '../db/supabase.js';
import { createAndRunTask, handleTaskApprovalResponse, agentEvents } from '../agents/orchestrator.js';

const router = Router();

// GET /api/health - Backend health & Supabase status check
router.get('/health', async (_req: Request, res: Response) => {
  const connectionStatus = await supabaseService.checkConnection();
  return res.json({
    status: 'ok',
    service: 'AgentFlow Backend',
    supabase: connectionStatus
  });
});

// SSE Real-time updates stream
router.get('/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const onUpdate = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  agentEvents.on('task_update', onUpdate);
  agentEvents.on('step_update', onUpdate);
  agentEvents.on('plan_created', onUpdate);

  req.on('close', () => {
    agentEvents.off('task_update', onUpdate);
    agentEvents.off('step_update', onUpdate);
    agentEvents.off('plan_created', onUpdate);
  });
});

// POST /api/agent/task - Create agent task in Supabase & start AI execution workflow
router.post(['/agent/task', '/task'], async (req: Request, res: Response) => {
  try {
    const { goal, prompt } = req.body;
    const taskGoal = goal || prompt;

    if (!taskGoal || typeof taskGoal !== 'string' || !taskGoal.trim()) {
      return res.status(400).json({ error: 'Goal string is required' });
    }

    const task = await createAndRunTask(taskGoal.trim());
    return res.status(201).json({
      taskId: task.id,
      status: String(task.status).toLowerCase(),
      task
    });
  } catch (error: any) {
    console.error('[POST /api/agent/task Error]:', error.message || error);
    return res.status(500).json({ error: error.message || 'Failed to create task' });
  }
});

// GET /api/tasks - Return tasks from Supabase
router.get('/tasks', async (_req: Request, res: Response) => {
  try {
    const tasks = await supabaseService.getAllTasks();
    return res.json({ tasks });
  } catch (error: any) {
    console.error('[GET /api/tasks Error]:', error.message || error);
    return res.status(500).json({ error: error.message || 'Failed to fetch tasks' });
  }
});

// GET /api/tasks/:id - Return one task with steps and activity logs
router.get('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const taskId = String(req.params.id);
    const task = await supabaseService.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const steps = await dbAdapter.getStepsByTaskId(taskId);
    const logs = (await dbAdapter.getActivityLogs()).filter(l => l.task_id === taskId);

    return res.json({ task, steps, logs });
  } catch (error: any) {
    console.error(`[GET /api/tasks/${req.params.id} Error]:`, error.message || error);
    return res.status(500).json({ error: error.message || 'Failed to fetch task details' });
  }
});

// POST /api/tasks/:id/approve - Approve sensitive step
router.post('/tasks/:id/approve', (req: Request, res: Response) => {
  try {
    const taskId = String(req.params.id);
    const success = handleTaskApprovalResponse(taskId, true);
    if (success) {
      return res.json({ success: true, message: 'Action approved successfully.' });
    }
    return res.json({ success: false, message: 'Task was not awaiting approval.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/tasks/:id/reject - Reject sensitive step
router.post('/tasks/:id/reject', (req: Request, res: Response) => {
  try {
    const taskId = String(req.params.id);
    const success = handleTaskApprovalResponse(taskId, false);
    if (success) {
      return res.json({ success: true, message: 'Action rejected by user.' });
    }
    return res.json({ success: false, message: 'Task was not awaiting approval.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/activity - Get system activity logs
router.get('/activity', async (_req: Request, res: Response) => {
  try {
    const logs = await dbAdapter.getActivityLogs();
    return res.json({ logs });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/integrations
router.get('/integrations', async (_req: Request, res: Response) => {
  try {
    const integrations = await dbAdapter.getIntegrations();
    return res.json({ integrations });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/integrations/toggle
router.post('/integrations/toggle', async (req: Request, res: Response) => {
  try {
    const { provider } = req.body;
    if (!provider) return res.status(400).json({ error: 'Provider required' });
    const updated = await dbAdapter.toggleIntegration(provider);
    return res.json({ success: true, integration: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/memories
router.get('/memories', async (_req: Request, res: Response) => {
  try {
    const memories = await dbAdapter.getMemories();
    return res.json({ memories });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/memories
router.post('/memories', async (req: Request, res: Response) => {
  try {
    const { key, value, category } = req.body;
    if (!key || !value) return res.status(400).json({ error: 'Key and Value are required' });
    const newMemory = await dbAdapter.createMemory(key, value, category || 'User Preferences');
    return res.json({ success: true, memory: newMemory });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/memories/:id
router.delete('/memories/:id', async (req: Request, res: Response) => {
  try {
    const memId = String(req.params.id);
    await dbAdapter.deleteMemory(memId);
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
