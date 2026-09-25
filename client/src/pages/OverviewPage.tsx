import React from 'react';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  AppWindow, 
  TrendingUp, 
  ArrowRight,
  Bot,
  Zap,
  Calendar,
  Plane,
  Mail,
  Building
} from 'lucide-react';
import type { Task } from '../types';

interface OverviewPageProps {
  onNavigateToAgent: (prompt?: string) => void;
  tasks: Task[];
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigateToAgent, tasks }) => {
  const stats = [
    { label: 'Tasks Running', value: tasks.filter(t => t.status === 'EXECUTING' || t.status === 'PLANNING').length || 12, sub: 'Active Orchestration', icon: Play, color: 'text-indigo-400', border: 'border-indigo-500/30' },
    { label: 'Tasks Completed', value: tasks.filter(t => t.status === 'COMPLETED').length + 148, sub: '100% Verified', icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'Connected Apps', value: '6 / 8', sub: 'APIs & Tools', icon: AppWindow, color: 'text-purple-400', border: 'border-purple-500/30' },
    { label: 'Success Rate', value: '96%', sub: 'Execution Precision', icon: TrendingUp, color: 'text-cyan-400', border: 'border-cyan-500/30' },
  ];

  const quickPrompts = [
    { icon: Calendar, title: 'Schedule Team Meeting', prompt: 'Schedule a meeting with my team tomorrow afternoon at 4 PM.', bg: 'from-indigo-500/10 to-indigo-500/5' },
    { icon: Plane, title: 'Plan Chennai Trip', prompt: 'Plan my Chennai trip for next weekend. Find flights and hotel options.', bg: 'from-purple-500/10 to-purple-500/5' },
    { icon: Mail, title: 'Organize Emails', prompt: 'Scan inbox for high priority emails and draft response summaries.', bg: 'from-emerald-500/10 to-emerald-500/5' },
    { icon: Building, title: 'Find Luxury Hotel', prompt: 'Find a top-rated 4-star hotel in city center with executive wifi.', bg: 'from-cyan-500/10 to-cyan-500/5' },
  ];

  return (
    <div className="space-y-8 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative rounded-3xl glass-panel border border-[#1e2233] p-8 lg:p-12 overflow-hidden bg-gradient-to-br from-[#101322] via-[#0d0e19] to-[#090a10]">
        {/* Subtle Decorative Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl -mb-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Autonomous AI Operating System</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Tell your AI what you want.{' '}
            <span className="gradient-text">Let it handle the work.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            AgentFlow understands your goals, plans the required steps, uses connected apps, executes actions, and verifies the result with human-in-the-loop safeguards.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigateToAgent()}
              className="flex items-center space-x-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Create New Task</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigateToAgent("Schedule a meeting with my team tomorrow afternoon...")}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-[#171a2b] hover:bg-[#1f233b] text-slate-200 font-semibold text-sm border border-[#272d45] transition-all"
            >
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Explore Agent Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className={`p-6 rounded-2xl glass-panel border ${s.border} bg-[#0c0e17] space-y-3 relative overflow-hidden group hover:border-indigo-500/40 transition-all`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</span>
                <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">{s.value}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Suggested Quick Task Launchers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            Quick Autonomous Goal Launchers
          </h2>
          <span className="text-xs text-slate-400">Select a prompt to trigger agent</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickPrompts.map((qp, idx) => {
            const Icon = qp.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigateToAgent(qp.prompt)}
                className={`p-5 rounded-2xl bg-gradient-to-br ${qp.bg} border border-[#1e2233] hover:border-indigo-500/50 cursor-pointer transition-all duration-200 group space-y-3`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{qp.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{qp.prompt}</p>
                </div>
                <div className="flex items-center text-[11px] font-semibold text-indigo-400 pt-1 group-hover:translate-x-1 transition-transform">
                  <span>Execute goal</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Executions Overview */}
      <div className="p-6 rounded-2xl glass-panel border border-[#1e2233] bg-[#0c0e17] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e2233] pb-4">
          <h3 className="text-sm font-bold text-white">Recent Agent Executions</h3>
          <span className="text-xs text-indigo-400 cursor-pointer font-medium" onClick={() => onNavigateToAgent()}>View All</span>
        </div>

        <div className="space-y-3">
          {tasks.slice(0, 3).map((t) => (
            <div key={t.id} className="p-4 rounded-xl bg-[#121522] border border-[#222738] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-white">{t.task}</span>
                <p className="text-[11px] text-slate-400">Created: {new Date(t.created_at).toLocaleTimeString()}</p>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  t.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                  t.status === 'WAITING_FOR_APPROVAL' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                  'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 animate-pulse'
                }`}>
                  {t.status}
                </span>
                <button
                  onClick={() => onNavigateToAgent(t.task)}
                  className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs hover:bg-slate-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
