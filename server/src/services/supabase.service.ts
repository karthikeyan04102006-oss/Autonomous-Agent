import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config, isRealSupabaseSecretConfigured } from '../config/env.js';

export interface SupabaseTaskRecord {
  id: string;
  created_at?: string;
  user_id?: string;
  task: string;
  status: 'PENDING' | 'PLANNING' | 'EXECUTING' | 'WAITING_FOR_APPROVAL' | 'VERIFYING' | 'COMPLETED' | 'FAILED' | 'pending' | 'planning' | 'executing' | 'completed' | 'failed';
  result?: any;
}

let supabaseClient: SupabaseClient | null = null;

// Initialize backend Supabase client using server-side secret key ONLY
if (config.supabaseUrl && isRealSupabaseSecretConfigured()) {
  try {
    supabaseClient = createClient(config.supabaseUrl, config.supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
    console.log('[Supabase Service] Initialized backend Supabase client for URL:', config.supabaseUrl);
  } catch (err: any) {
    console.warn('[Supabase Service] Failed to initialize Supabase client:', err.message || err);
  }
} else {
  console.log('[Supabase Service] Operating with local fallback until valid SUPABASE_SECRET_KEY is configured in backend/.env');
}

// In-Memory fallback store for demo/fallback operations
const localTasksStore: SupabaseTaskRecord[] = [
  {
    id: 'demo-task-101',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    user_id: 'demo_user',
    task: 'Schedule team sync meeting for tomorrow 4 PM',
    status: 'COMPLETED',
    result: 'Meeting scheduled successfully.'
  },
  {
    id: 'demo-task-102',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    user_id: 'demo_user',
    task: 'Plan Chennai trip flight and hotel options',
    status: 'COMPLETED',
    result: 'Flight IndiGo 6E-204 booked. Radisson Blu reserved.'
  }
];

export const supabaseService = {
  // Check live connection to Supabase 'tasks' table
  async checkConnection(): Promise<string> {
    if (!isRealSupabaseSecretConfigured()) {
      return 'unconfigured (SUPABASE_SECRET_KEY pending in backend/.env)';
    }

    if (!supabaseClient) {
      try {
        supabaseClient = createClient(config.supabaseUrl, config.supabaseSecretKey, {
          auth: { persistSession: false, autoRefreshToken: false }
        });
      } catch (err: any) {
        return `error: ${err.message || 'Initialization failed'}`;
      }
    }

    try {
      const { error } = await supabaseClient.from('tasks').select('id').limit(1);
      if (error) {
        // Return clear error without exposing secret key
        return `error: ${error.message}`;
      }
      return 'connected';
    } catch (err: any) {
      return `error: ${err.message || 'Connection failed'}`;
    }
  },

  // Create a new task record in Supabase 'tasks' table
  async createTask(taskInput: string, userId: string = 'demo_user'): Promise<SupabaseTaskRecord> {
    const record: SupabaseTaskRecord = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      user_id: userId,
      task: taskInput,
      status: 'PLANNING',
      result: null
    };

    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('tasks')
          .insert({
            id: record.id,
            user_id: record.user_id,
            task: record.task,
            status: record.status,
            result: record.result
          })
          .select()
          .single();

        if (!error && data) {
          console.log(`[Supabase Service] Created task ${data.id} in Supabase 'tasks' table`);
          return data;
        } else if (error) {
          console.warn('[Supabase Service] Database insert error:', error.message);
        }
      } catch (err: any) {
        console.warn('[Supabase Service] Database insert exception:', err.message || err);
      }
    }

    localTasksStore.unshift(record);
    return record;
  },

  // Update task status and final result in Supabase 'tasks' table
  async updateTaskStatus(id: string, status: SupabaseTaskRecord['status'], result?: any): Promise<void> {
    const formattedResult = typeof result === 'object' && result !== null ? JSON.stringify(result) : result;

    if (supabaseClient) {
      try {
        const payload: any = { status };
        if (result !== undefined) payload.result = formattedResult;

        const { error } = await supabaseClient
          .from('tasks')
          .update(payload)
          .eq('id', id);

        if (!error) {
          console.log(`[Supabase Service] Updated task ${id} status to '${status}' in Supabase`);
        } else {
          console.warn(`[Supabase Service] Update status error for task ${id}:`, error.message);
        }
      } catch (err: any) {
        console.warn(`[Supabase Service] Update task exception for ${id}:`, err.message || err);
      }
    }

    // Always update local fallback memory store
    const found = localTasksStore.find(t => t.id === id);
    if (found) {
      found.status = status;
      if (result !== undefined) found.result = result;
    }
  },

  // Retrieve all tasks from Supabase 'tasks' table
  async getAllTasks(): Promise<SupabaseTaskRecord[]> {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        } else if (error) {
          console.warn('[Supabase Service] Fetch all tasks error:', error.message);
        }
      } catch (err: any) {
        console.warn('[Supabase Service] Fetch tasks exception:', err.message || err);
      }
    }

    return localTasksStore;
  },

  // Retrieve a single task by ID from Supabase 'tasks' table
  async getTaskById(id: string): Promise<SupabaseTaskRecord | null> {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('tasks')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return data;
        } else if (error) {
          console.warn(`[Supabase Service] Fetch task ${id} error:`, error.message);
        }
      } catch (err: any) {
        console.warn(`[Supabase Service] Fetch task ${id} exception:`, err.message || err);
      }
    }

    return localTasksStore.find(t => t.id === id) || null;
  }
};
