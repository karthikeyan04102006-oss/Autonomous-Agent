export type TaskStatus = 'PENDING' | 'PLANNING' | 'EXECUTING' | 'WAITING_FOR_TOOL' | 'WAITING_FOR_APPROVAL' | 'VERIFYING' | 'COMPLETED' | 'FAILED';

export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'waiting_approval';

export interface Task {
  id: string;
  user_id: string;
  task: string;
  status: TaskStatus;
  result?: any;
  created_at: string;
}

export interface AgentStep {
  id: string;
  task_id: string;
  step_number: number;
  description: string;
  tool: string;
  status: StepStatus;
  result?: any;
  requires_approval: boolean;
  execution_time?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  task_id?: string;
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  created_at: string;
}

export interface Integration {
  id: string;
  user_id: string;
  provider: string;
  status: 'connected' | 'disconnected';
  last_used?: string;
  description: string;
  created_at: string;
}

export interface Memory {
  id: string;
  user_id: string;
  key: string;
  value: string;
  category: string;
  created_at: string;
}

export interface SystemStats {
  activeTasks: number;
  completedTasks: number;
  connectedApps: number;
  successRate: number;
}
