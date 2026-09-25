import React from 'react';
import { 
  Home, 
  Bot, 
  ClipboardList, 
  Plug, 
  Brain, 
  BarChart3, 
  Settings, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export type NavTab = 'overview' | 'agent' | 'tasks' | 'integrations' | 'memory' | 'activity' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, isOpen, onCloseMobile }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home, badge: null },
    { id: 'agent', label: 'AI Agent', icon: Bot, badge: 'Live' },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList, badge: null },
    { id: 'integrations', label: 'Integrations', icon: Plug, badge: '6 Connected' },
    { id: 'memory', label: 'Memory', icon: Brain, badge: null },
    { id: 'activity', label: 'Activity', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ] as const;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0c0e17] border-r border-[#1e2233] flex flex-col justify-between
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Logo & Brand Header */}
        <div>
          <div className="h-16 px-6 border-b border-[#1e2233] flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('overview')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  AgentFlow
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    2.0
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">AUTONOMOUS AI OS</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id as NavTab);
                    onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10 font-semibold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      item.id === 'agent' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  ) : isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400 opacity-80" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Agent Status Card */}
        <div className="p-4 border-t border-[#1e2233] space-y-3 bg-[#090b12]">
          {/* Agent Operating Status */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div className="absolute -inset-0.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Agent Core Online</p>
                <p className="text-[10px] text-slate-400">Autonomous Orchestrator</p>
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          {/* User Profile Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border border-indigo-400/30">
                AM
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Alex Morgan</p>
                <p className="text-[10px] text-slate-400">Pro Enterprise Tier</p>
              </div>
            </div>

            <button 
              onClick={() => onTabChange('settings')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              title="Settings"
            >
              <UserCheck className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
