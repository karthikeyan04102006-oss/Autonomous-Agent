import type { Task, AgentStep, ActivityLog, Integration, Memory } from '../types';

const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Check Backend Server & Database status
  async checkHealth(): Promise<{ status: string; service?: string; supabase?: string; geminiConfigured?: boolean; supabaseConfigured?: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error('Backend health check failed');
      return await res.json();
    } catch {
      return { status: 'offline', supabase: 'offline' };
    }
  },

  // Create & Start Task Workflow via POST /api/agent/task
  async createTask(goal: string): Promise<Task> {
    try {
      const res = await fetch(`${API_BASE}/agent/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create task');
      }

      const data = await res.json();
      if (data.task) return data.task;

      return {
        id: data.taskId,
        user_id: 'demo_user',
        task: goal,
        status: (data.status ? data.status.toUpperCase() : 'PLANNING') as any,
        created_at: new Date().toISOString()
      };
    } catch (err) {
      console.warn('Backend unavailable, using client fallback mock task', err);
      return {
        id: `local_${Date.now()}`,
        user_id: 'demo_user',
        task: goal,
        status: 'PENDING',
        created_at: new Date().toISOString()
      };
    }
  },

  // Get All Tasks via GET /api/tasks
  async getTasks(): Promise<Task[]> {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      return data.tasks || [];
    } catch {
      return [];
    }
  },

  // Get Task Details with Steps & Logs via GET /api/tasks/:id
  async getTaskDetails(taskId: string): Promise<{ task: Task; steps: AgentStep[]; logs: ActivityLog[] }> {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`);
      if (!res.ok) throw new Error('Failed to fetch task details');
      return await res.json();
    } catch {
      return {
        task: { id: taskId, user_id: 'demo_user', task: 'Sample Goal', status: 'COMPLETED', created_at: new Date().toISOString() },
        steps: [],
        logs: []
      };
    }
  },

  // Approve Sensitive Action Step
  async approveTask(taskId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/approve`, { method: 'POST' });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return false;
    }
  },

  // Reject Sensitive Action Step
  async rejectTask(taskId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/reject`, { method: 'POST' });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return false;
    }
  },

  // Get System Activity Logs
  async getActivityLogs(): Promise<ActivityLog[]> {
    try {
      const res = await fetch(`${API_BASE}/activity`);
      if (!res.ok) throw new Error('Failed to fetch activity');
      const data = await res.json();
      return data.logs || [];
    } catch {
      return [];
    }
  },

  // Get Integrations Marketplace
  async getIntegrations(): Promise<Integration[]> {
    try {
      const res = await fetch(`${API_BASE}/integrations`);
      if (!res.ok) throw new Error('Failed to fetch integrations');
      const data = await res.json();
      return data.integrations || [];
    } catch {
      return [];
    }
  },

  // Toggle Integration status
  async toggleIntegration(provider: string): Promise<Integration | null> {
    try {
      const res = await fetch(`${API_BASE}/integrations/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });
      const data = await res.json();
      return data.integration || null;
    } catch {
      return null;
    }
  },

  // Get Memories
  async getMemories(): Promise<Memory[]> {
    try {
      const res = await fetch(`${API_BASE}/memories`);
      if (!res.ok) throw new Error('Failed to fetch memories');
      const data = await res.json();
      return data.memories || [];
    } catch {
      return [];
    }
  },

  // Add Memory
  async addMemory(key: string, value: string, category: string): Promise<Memory | null> {
    try {
      const res = await fetch(`${API_BASE}/memories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, category })
      });
      const data = await res.json();
      return data.memory || null;
    } catch {
      return null;
    }
  },

  // Delete Memory
  async deleteMemory(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/memories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return false;
    }
  }
};
