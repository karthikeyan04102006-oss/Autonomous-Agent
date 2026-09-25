import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

export interface TaskRecord {
  id: string;
  user_id: string;
  task: string;
  status: 'PENDING' | 'PLANNING' | 'EXECUTING' | 'WAITING_FOR_APPROVAL' | 'VERIFYING' | 'COMPLETED' | 'FAILED';
  result?: any;
  created_at: string;
}

export interface StepRecord {
  id: string;
  task_id: string;
  step_number: number;
  description: string;
  tool: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'waiting_approval';
  result?: any;
  requires_approval: boolean;
  execution_time?: string;
  created_at: string;
}

export interface ActivityRecord {
  id: string;
  task_id?: string;
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  created_at: string;
}

export interface IntegrationRecord {
  id: string;
  user_id: string;
  provider: string;
  status: 'connected' | 'disconnected';
  last_used?: string;
  description: string;
  created_at: string;
}

export interface MemoryRecord {
  id: string;
  user_id: string;
  key: string;
  value: string;
  category: string;
  created_at: string;
}

let supabaseInstance: SupabaseClient | null = null;
const keyToUse = config.supabaseSecretKey || config.supabasePublishableKey;
const isSupabaseConfigured = Boolean(config.supabaseUrl && keyToUse && config.supabaseUrl !== 'YOUR_SUPABASE_URL');

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(config.supabaseUrl, keyToUse);
    console.log('[Supabase] Initialized Supabase PostgreSQL client');
  } catch (err) {
    console.warn('[Supabase] Failed to initialize Supabase client, falling back to local store', err);
  }
} else {
  console.log('[Store] Running in Demo Local Mode (Supabase URL/Key not configured in .env)');
}

// Local In-Memory Storage Adapter with Initial Seed Data
const localStore = {
  tasks: [] as TaskRecord[],
  steps: [] as StepRecord[],
  logs: [] as ActivityRecord[],
  integrations: [
    { id: '1', user_id: 'demo_user', provider: 'Google Calendar', status: 'connected', description: 'Allow AgentFlow to read availability and create calendar events.', last_used: '2 minutes ago', created_at: new Date().toISOString() },
    { id: '2', user_id: 'demo_user', provider: 'Gmail', status: 'connected', description: 'Draft and send emails to team members and external partners.', last_used: '5 minutes ago', created_at: new Date().toISOString() },
    { id: '3', user_id: 'demo_user', provider: 'Google Maps', status: 'connected', description: 'Find locations, calculate travel routes, and estimate transit times.', last_used: '1 hour ago', created_at: new Date().toISOString() },
    { id: '4', user_id: 'demo_user', provider: 'Weather', status: 'connected', description: 'Retrieve real-time weather forecasts and travel weather warnings.', last_used: '10 minutes ago', created_at: new Date().toISOString() },
    { id: '5', user_id: 'demo_user', provider: 'Flight Search', status: 'connected', description: 'Search flights, compare airline fares, and prepare booking drafts.', last_used: 'Yesterday', created_at: new Date().toISOString() },
    { id: '6', user_id: 'demo_user', provider: 'Hotel Search', status: 'connected', description: 'Discover top-rated hotels, check room rates, and check availability.', last_used: '3 hours ago', created_at: new Date().toISOString() },
    { id: '7', user_id: 'demo_user', provider: 'WhatsApp', status: 'disconnected', description: 'Send instant notifications and chat updates via WhatsApp Business API.', last_used: 'Never', created_at: new Date().toISOString() },
    { id: '8', user_id: 'demo_user', provider: 'Slack', status: 'connected', description: 'Broadcast agent task updates and request approvals directly in Slack channels.', last_used: 'Just now', created_at: new Date().toISOString() }
  ] as IntegrationRecord[],
  memories: [
    { id: 'm1', user_id: 'demo_user', key: 'Preferred meeting time', value: '3:00 PM - 6:00 PM (IST)', category: 'User Preferences', created_at: new Date().toISOString() },
    { id: 'm2', user_id: 'demo_user', key: 'Preferred airline', value: 'IndiGo / Vistara (Economy Class)', category: 'User Preferences', created_at: new Date().toISOString() },
    { id: 'm3', user_id: 'demo_user', key: 'Home Location', value: 'Chennai, Tamil Nadu, India', category: 'Saved Context', created_at: new Date().toISOString() },
    { id: 'm4', user_id: 'demo_user', key: 'Default Team Email', value: 'dev-team@company.com', category: 'Agent Context', created_at: new Date().toISOString() }
  ] as MemoryRecord[]
};

// Seed sample past tasks into localStore for immediate dashboard visuals
localStore.tasks.push(
  {
    id: 'demo-task-1',
    user_id: 'demo_user',
    task: 'Schedule team sync meeting for tomorrow 4 PM',
    status: 'COMPLETED',
    result: { summary: 'Meeting created with 4 team members. Invitation emails sent via Gmail.' },
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 'demo-task-2',
    user_id: 'demo_user',
    task: 'Plan Chennai trip flight and hotel options',
    status: 'COMPLETED',
    result: { summary: 'Flight IndiGo 6E-204 selected (₹5,800). Hotel Radisson Blu reserved.' },
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString()
  }
);

localStore.steps.push(
  { id: 's1', task_id: 'demo-task-1', step_number: 1, description: 'Identify team members', tool: 'Gmail API', status: 'completed', execution_time: '0.4s', requires_approval: false, created_at: new Date().toISOString() },
  { id: 's2', task_id: 'demo-task-1', step_number: 2, description: 'Check calendar availability', tool: 'Google Calendar API', status: 'completed', execution_time: '0.8s', requires_approval: false, created_at: new Date().toISOString() },
  { id: 's3', task_id: 'demo-task-1', step_number: 3, description: 'Create calendar event and send invites', tool: 'Google Calendar API', status: 'completed', execution_time: '1.2s', requires_approval: false, created_at: new Date().toISOString() }
);

localStore.logs.push(
  { id: 'l1', task_id: 'demo-task-1', message: 'Agent received goal: Schedule team sync meeting for tomorrow 4 PM', status: 'info', timestamp: '19:45:01', created_at: new Date().toISOString() },
  { id: 'l2', task_id: 'demo-task-1', message: 'Goal understood. Plan generated with 3 steps.', status: 'info', timestamp: '19:45:02', created_at: new Date().toISOString() },
  { id: 'l3', task_id: 'demo-task-1', message: 'Google Calendar API called: Checked 4 team calendars for slot 16:00.', status: 'info', timestamp: '19:45:04', created_at: new Date().toISOString() },
  { id: 'l4', task_id: 'demo-task-1', message: 'Event successfully created and invitations dispatched.', status: 'success', timestamp: '19:45:06', created_at: new Date().toISOString() }
);

export const dbAdapter = {
  // Tasks
  async createTask(task: Partial<TaskRecord>): Promise<TaskRecord> {
    const record: TaskRecord = {
      id: task.id || `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: task.user_id || 'demo_user',
      task: task.task || '',
      status: task.status || 'PENDING',
      result: task.result || null,
      created_at: new Date().toISOString()
    };

    if (supabaseInstance) {
      const { data, error } = await supabaseInstance.from('tasks').insert(record).select().single();
      if (!error && data) return data;
    }

    localStore.tasks.unshift(record);
    return record;
  },

  async updateTaskStatus(id: string, status: TaskRecord['status'], result?: any): Promise<void> {
    if (supabaseInstance) {
      await supabaseInstance.from('tasks').update({ status, result, updated_at: new Date().toISOString() }).eq('id', id);
    }
    const found = localStore.tasks.find(t => t.id === id);
    if (found) {
      found.status = status;
      if (result) found.result = result;
    }
  },

  async getTasks(): Promise<TaskRecord[]> {
    if (supabaseInstance) {
      const { data, error } = await supabaseInstance.from('tasks').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return localStore.tasks;
  },

  async getTaskById(id: string): Promise<TaskRecord | null> {
    if (supabaseInstance) {
      const { data, error } = await supabaseInstance.from('tasks').select('*').eq('id', id).single();
      if (!error && data) return data;
    }
    return localStore.tasks.find(t => t.id === id) || null;
  },

  // Steps
  async createSteps(steps: Partial<StepRecord>[]): Promise<StepRecord[]> {
    const records: StepRecord[] = steps.map((s, idx) => ({
      id: s.id || `step_${Date.now()}_${idx}`,
      task_id: s.task_id || '',
      step_number: s.step_number || idx + 1,
      description: s.description || '',
      tool: s.tool || 'Agent Core',
      status: s.status || 'pending',
      requires_approval: Boolean(s.requires_approval),
      execution_time: s.execution_time || '0.5s',
      result: s.result || null,
      created_at: new Date().toISOString()
    }));

    if (supabaseInstance) {
      const { data, error } = await supabaseInstance.from('agent_steps').insert(records).select();
      if (!error && data) return data;
    }

    records.forEach(r => localStore.steps.push(r));
    return records;
  },

  async updateStepStatus(id: string, status: StepRecord['status'], result?: any, executionTime?: string): Promise<void> {
    if (supabaseInstance) {
      await supabaseInstance.from('agent_steps').update({ status, result, execution_time: executionTime }).eq('id', id);
    }
    const found = localStore.steps.find(s => s.id === id);
    if (found) {
      found.status = status;
      if (result) found.result = result;
      if (executionTime) found.execution_time = executionTime;
    }
  },

  async getStepsByTaskId(taskId: string): Promise<StepRecord[]> {
    if (supabaseInstance) {
      const { data, error } = await supabaseInstance.from('agent_steps').select('*').eq('task_id', taskId).order('step_number', { ascending: true });
      if (!error && data) return data;
    }
    return localStore.steps.filter(s => s.task_id === taskId).sort((a, b) => a.step_number - b.step_number);
  },

  // Logs
  async logActivity(taskId: string | undefined, message: string, status: ActivityRecord['status'] = 'info'): Promise<ActivityRecord> {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const record: ActivityRecord = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      task_id: taskId,
      message,
      status,
      timestamp: timeStr,
      created_at: new Date().toISOString()
    };

    if (supabaseInstance) {
      await supabaseInstance.from('activity_logs').insert(record);
    }
    localStore.logs.unshift(record);
    return record;
  },

  async getActivityLogs(): Promise<ActivityRecord[]> {
    if (supabaseInstance) {
      const { data, error } = await supabaseInstance.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(100);
      if (!error && data) return data;
    }
    return localStore.logs;
  },

  // Integrations
  async getIntegrations(): Promise<IntegrationRecord[]> {
    if (supabaseInstance) {
      const { data, error } = await supabaseInstance.from('integrations').select('*').order('provider', { ascending: true });
      if (!error && data) return data;
    }
    return localStore.integrations;
  },

  async toggleIntegration(provider: string): Promise<IntegrationRecord | null> {
    const found = localStore.integrations.find(i => i.provider.toLowerCase() === provider.toLowerCase());
    if (found) {
      found.status = found.status === 'connected' ? 'disconnected' : 'connected';
      found.last_used = found.status === 'connected' ? 'Just now' : found.last_used;
      if (supabaseInstance) {
        await supabaseInstance.from('integrations').update({ status: found.status, last_used: found.last_used }).eq('id', found.id);
      }
      return found;
    }
    return null;
  },

  // Memories
  async getMemories(): Promise<MemoryRecord[]> {
    if (supabaseInstance) {
      const { data, error } = await supabaseInstance.from('memories').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return localStore.memories;
  },

  async createMemory(key: string, value: string, category: string = 'User Preferences'): Promise<MemoryRecord> {
    const record: MemoryRecord = {
      id: `mem_${Date.now()}`,
      user_id: 'demo_user',
      key,
      value,
      category,
      created_at: new Date().toISOString()
    };

    if (supabaseInstance) {
      const { data, error } = await supabaseInstance.from('memories').insert(record).select().single();
      if (!error && data) return data;
    }

    localStore.memories.unshift(record);
    return record;
  },

  async deleteMemory(id: string): Promise<void> {
    if (supabaseInstance) {
      await supabaseInstance.from('memories').delete().eq('id', id);
    }
    localStore.memories = localStore.memories.filter(m => m.id !== id);
  }
};
