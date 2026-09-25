import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import type { NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { HumanApprovalModal } from './components/HumanApprovalModal';
import { OverviewPage } from './pages/OverviewPage';
import { AgentPage } from './pages/AgentPage';
import { TasksPage } from './pages/TasksPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { MemoryPage } from './pages/MemoryPage';
import { ActivityPage } from './pages/ActivityPage';
import { SettingsPage } from './pages/SettingsPage';
import { api } from './services/api';
import type { Task, AgentStep, ActivityLog, Integration, Memory } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<{ status: string; service?: string; supabase?: string; geminiConfigured?: boolean; supabaseConfigured?: boolean }>({ status: 'checking' });

  // Data State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeSteps, setActiveSteps] = useState<AgentStep[]>([]);
  const [activeLogs, setActiveLogs] = useState<ActivityLog[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialAgentPrompt, setInitialAgentPrompt] = useState('');

  // Check Backend Health & Load Initial Data
  useEffect(() => {
    async function init() {
      const health = await api.checkHealth();
      setServerStatus(health);

      const [loadedTasks, loadedIntegrations, loadedMemories, loadedLogs] = await Promise.all([
        api.getTasks(),
        api.getIntegrations(),
        api.getMemories(),
        api.getActivityLogs()
      ]);

      setTasks(loadedTasks);
      setIntegrations(loadedIntegrations);
      setMemories(loadedMemories);
      setActiveLogs(loadedLogs);

      if (loadedTasks.length > 0) {
        const running = loadedTasks.find(t => t.status === 'EXECUTING' || t.status === 'WAITING_FOR_APPROVAL' || t.status === 'PLANNING') || loadedTasks[0];
        setActiveTask(running);
        loadTaskDetails(running.id);
      }
    }

    init();
  }, []);

  // Poll for real-time task status updates every 2 seconds if a task is active
  useEffect(() => {
    const interval = setInterval(async () => {
      if (activeTask && (activeTask.status !== 'COMPLETED' && activeTask.status !== 'FAILED')) {
        const updated = await api.getTaskDetails(activeTask.id);
        if (updated && updated.task) {
          setActiveTask(updated.task);
          setActiveSteps(updated.steps || []);
          if (updated.logs && updated.logs.length > 0) {
            setActiveLogs(updated.logs);
          }
        }
        const freshTasks = await api.getTasks();
        setTasks(freshTasks);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeTask]);

  const loadTaskDetails = async (taskId: string) => {
    const details = await api.getTaskDetails(taskId);
    if (details) {
      setActiveTask(details.task);
      setActiveSteps(details.steps || []);
      setActiveLogs(details.logs || []);
    }
  };

  // Submit Goal
  const handleGoalSubmit = async (goal: string) => {
    setIsLoading(true);
    try {
      const newTask = await api.createTask(goal);
      setActiveTask(newTask);
      setCurrentTab('agent');
      
      // Refresh task list
      const freshTasks = await api.getTasks();
      setTasks(freshTasks);

      // Poll task details repeatedly during execution
      let checks = 0;
      const timer = setInterval(async () => {
        checks++;
        if (newTask.id) {
          await loadTaskDetails(newTask.id);
        }
        if (checks > 20) clearInterval(timer);
      }, 1000);

    } catch (err) {
      console.error('Failed to submit goal', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Approve Sensitive Step
  const handleApproveAction = async (taskId: string) => {
    await api.approveTask(taskId);
    await loadTaskDetails(taskId);
    const freshTasks = await api.getTasks();
    setTasks(freshTasks);
  };

  // Reject Sensitive Step
  const handleRejectAction = async (taskId: string) => {
    await api.rejectTask(taskId);
    await loadTaskDetails(taskId);
    const freshTasks = await api.getTasks();
    setTasks(freshTasks);
  };

  // Toggle Integration
  const handleToggleIntegration = async (provider: string) => {
    await api.toggleIntegration(provider);
    const freshIntegrations = await api.getIntegrations();
    setIntegrations(freshIntegrations);
  };

  // Add Memory
  const handleAddMemory = async (key: string, value: string, category: string) => {
    await api.addMemory(key, value, category);
    const freshMemories = await api.getMemories();
    setMemories(freshMemories);
  };

  // Delete Memory
  const handleDeleteMemory = async (id: string) => {
    await api.deleteMemory(id);
    const freshMemories = await api.getMemories();
    setMemories(freshMemories);
  };

  // Quick prompt navigation from Overview
  const handleQuickPromptClick = (promptText?: string) => {
    if (promptText) {
      setInitialAgentPrompt(promptText);
      handleGoalSubmit(promptText);
    } else {
      setCurrentTab('agent');
    }
  };

  // Pending Step needing human approval modal
  const pendingApprovalStep = activeSteps.find(s => s.status === 'waiting_approval') || null;

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col lg:flex-row antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onQuickTaskClick={() => setCurrentTab('agent')}
          serverStatus={serverStatus}
        />

        <main className="flex-1 pb-16">
          {currentTab === 'overview' && (
            <OverviewPage
              onNavigateToAgent={handleQuickPromptClick}
              tasks={tasks}
            />
          )}

          {currentTab === 'agent' && (
            <AgentPage
              initialPrompt={initialAgentPrompt}
              activeTask={activeTask}
              steps={activeSteps}
              logs={activeLogs}
              onSubmitGoal={handleGoalSubmit}
              onApproveAction={handleApproveAction}
              onRejectAction={handleRejectAction}
              isLoading={isLoading}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksPage
              tasks={tasks}
              onSelectTask={(taskId) => {
                loadTaskDetails(taskId);
                setCurrentTab('agent');
              }}
            />
          )}

          {currentTab === 'integrations' && (
            <IntegrationsPage
              integrations={integrations}
              onToggle={handleToggleIntegration}
            />
          )}

          {currentTab === 'memory' && (
            <MemoryPage
              memories={memories}
              onAddMemory={handleAddMemory}
              onDeleteMemory={handleDeleteMemory}
            />
          )}

          {currentTab === 'activity' && (
            <ActivityPage
              logs={activeLogs}
              onRefresh={async () => {
                const freshLogs = await api.getActivityLogs();
                setActiveLogs(freshLogs);
              }}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage serverStatus={serverStatus} />
          )}
        </main>
      </div>

      {/* Sensitive Action Approval Modal Popup */}
      {activeTask && activeTask.status === 'WAITING_FOR_APPROVAL' && (
        <HumanApprovalModal
          step={pendingApprovalStep}
          onApprove={() => handleApproveAction(activeTask.id)}
          onReject={() => handleRejectAction(activeTask.id)}
        />
      )}
    </div>
  );
}

export default App;
