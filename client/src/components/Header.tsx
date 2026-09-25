import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Zap,
  Layers
} from 'lucide-react';
import type { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onOpenMobileMenu: () => void;
  onQuickTaskClick: () => void;
  serverStatus: { status: string; service?: string; supabase?: string; geminiConfigured?: boolean; supabaseConfigured?: boolean };
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  onQuickTaskClick,
  serverStatus
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Task Completed', desc: 'Schedule team sync meeting finished with 4 invites sent.', time: '2m ago', type: 'success' },
    { id: 2, title: 'Human Approval Required', desc: 'Agent requires approval for IndiGo flight booking (₹6,250).', time: '5m ago', type: 'warning' },
    { id: 3, title: 'Memory Context Saved', desc: 'Updated preferred meeting window: 3 PM - 6 PM.', time: '1h ago', type: 'info' }
  ];

  const getTitle = () => {
    switch (currentTab) {
      case 'overview': return 'Command Overview';
      case 'agent': return 'AI Agent Command Center';
      case 'tasks': return 'Autonomous Tasks';
      case 'integrations': return 'Connected App Integrations';
      case 'memory': return 'AI Context & Memory';
      case 'activity': return 'Agent Activity Logs';
      case 'settings': return 'System Settings';
      default: return 'AgentFlow';
    }
  };

  return (
    <header className="h-16 px-4 lg:px-8 bg-[#090a0f]/80 backdrop-blur-md border-b border-[#1e2233] flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu & Breadcrumb Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-400 hidden sm:block" />
          <h2 className="text-base font-bold text-white tracking-tight">{getTitle()}</h2>
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search goals, tasks, tools, memory context..."
            className="w-full bg-[#121522] border border-[#222738] rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Server Status, New Task Button & Notifications */}
      <div className="flex items-center space-x-3">
        {/* Backend / Supabase Connection Status Pill */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#121522] border border-[#222738] text-xs font-medium">
          {serverStatus.status === 'ok' ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">Backend Connected</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300">Demo Local Engine</span>
            </>
          )}
        </div>

        {/* Quick New Task Button */}
        <button
          onClick={onQuickTaskClick}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-semibold hover:opacity-90 shadow-md shadow-indigo-500/20 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Goal</span>
        </button>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
          </button>

          {/* Notifications Modal */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#121522] border border-[#222738] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#222738]">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  Agent System Alerts
                </h3>
                <span className="text-[10px] text-indigo-400 font-semibold cursor-pointer" onClick={() => setShowNotifications(false)}>
                  Mark read
                </span>
              </div>

              <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#0b0c14] border border-[#1e2233] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
