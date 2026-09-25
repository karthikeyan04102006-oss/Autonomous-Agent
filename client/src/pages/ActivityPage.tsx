import React, { useState } from 'react';
import { 
  BarChart3, 
  Terminal, 
  Search, 
  RefreshCw
} from 'lucide-react';
import type { ActivityLog } from '../types';

interface ActivityPageProps {
  logs: ActivityLog[];
  onRefresh: () => void;
}

export const ActivityPage: React.FC<ActivityPageProps> = ({ logs, onRefresh }) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.message.toLowerCase().includes(search.toLowerCase());
    if (filter === 'ALL') return matchesSearch;
    return matchesSearch && l.status === filter.toLowerCase();
  });

  return (
    <div className="space-y-6 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Agent System Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Agent Activity Logs</h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time system execution logs & tool call events stream</p>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#121522] hover:bg-[#1c2033] border border-[#222738] text-xs font-semibold text-slate-200 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search terminal log messages..."
            className="w-full bg-[#0c0e17] border border-[#1e2233] rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 bg-[#121522] border border-[#222738] p-1 rounded-xl text-xs">
          {['ALL', 'INFO', 'SUCCESS', 'WARNING', 'ERROR'].map((f) => (
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

      {/* Terminal Container */}
      <div className="p-6 rounded-2xl glass-panel border border-[#1e2233] bg-[#070912] font-mono shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#1e2233] pb-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">agentflow-runtime.log</span>
          </div>
          <span className="text-[10px] text-slate-500">{filteredLogs.length} events logged</span>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 text-xs">
          {filteredLogs.length === 0 ? (
            <p className="text-slate-600 text-center py-12">No activity events matching query.</p>
          ) : (
            filteredLogs.map((log) => {
              const isSuccess = log.status === 'success';
              const isWarning = log.status === 'warning';
              const isError = log.status === 'error';

              return (
                <div key={log.id} className="p-2.5 rounded-xl bg-[#0d0f1b] border border-[#191d2e] flex items-start space-x-3">
                  <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                  <div className="flex-1">
                    <span className={`leading-relaxed ${
                      isSuccess ? 'text-emerald-400' :
                      isWarning ? 'text-amber-400 font-bold' :
                      isError ? 'text-rose-400 font-bold' : 'text-slate-300'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold shrink-0 ${
                    isSuccess ? 'bg-emerald-500/20 text-emerald-400' :
                    isWarning ? 'bg-amber-500/20 text-amber-300' :
                    isError ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {log.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
