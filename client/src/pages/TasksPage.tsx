import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Eye
} from 'lucide-react';
import type { Task } from '../types';

interface TasksPageProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({ tasks, onSelectTask }) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.task.toLowerCase().includes(search.toLowerCase());
    if (filter === 'ALL') return matchesSearch;
    if (filter === 'RUNNING') return matchesSearch && (t.status === 'EXECUTING' || t.status === 'PLANNING');
    if (filter === 'WAITING') return matchesSearch && t.status === 'WAITING_FOR_APPROVAL';
    if (filter === 'COMPLETED') return matchesSearch && t.status === 'COMPLETED';
    if (filter === 'FAILED') return matchesSearch && t.status === 'FAILED';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <ClipboardList className="w-3.5 h-3.5 text-indigo-400" />
            <span>Task Registry</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Tasks & Execution History</h1>
          <p className="text-xs text-slate-400 mt-0.5">Track, audit, and inspect autonomous task states</p>
        </div>

        <div className="flex items-center space-x-2 bg-[#121522] border border-[#222738] p-1 rounded-xl text-xs">
          {['ALL', 'RUNNING', 'WAITING', 'COMPLETED', 'FAILED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === f ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter tasks by prompt keyword..."
          className="w-full bg-[#0c0e17] border border-[#1e2233] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Task List */}
      <div className="p-6 rounded-2xl glass-panel border border-[#1e2233] bg-[#0c0e17] space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No tasks found matching current filter.
          </div>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => onSelectTask(t.id)}
              className="p-4 rounded-xl bg-[#121522] border border-[#222738] hover:border-indigo-500/40 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white">{t.task}</h3>
                </div>
                <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
                  <span>ID: {t.id.slice(0, 10)}</span>
                  <span>•</span>
                  <span>Created: {new Date(t.created_at).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  t.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                  t.status === 'WAITING_FOR_APPROVAL' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse' :
                  t.status === 'FAILED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                  'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 animate-pulse'
                }`}>
                  {t.status}
                </span>

                <button className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
