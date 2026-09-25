import React from 'react';
import { 
  Target, 
  BrainCircuit, 
  ListTree, 
  Wrench, 
  Play, 
  CheckCircle, 
  Trophy,
  Loader2
} from 'lucide-react';
import type { TaskStatus } from '../types';

interface WorkflowPipelineProps {
  currentStatus: TaskStatus;
}

export const WorkflowPipeline: React.FC<WorkflowPipelineProps> = ({ currentStatus }) => {
  const stages = [
    { id: 'USER_GOAL', label: 'USER GOAL', icon: Target },
    { id: 'UNDERSTAND', label: 'UNDERSTAND', icon: BrainCircuit },
    { id: 'PLAN', label: 'PLAN', icon: ListTree },
    { id: 'SELECT_TOOLS', label: 'SELECT TOOLS', icon: Wrench },
    { id: 'EXECUTE', label: 'EXECUTE', icon: Play },
    { id: 'VERIFY', label: 'VERIFY', icon: CheckCircle },
    { id: 'COMPLETE', label: 'COMPLETE', icon: Trophy },
  ];

  const getStageIndex = (status: TaskStatus) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'PLANNING': return 2; // Understand + Plan
      case 'WAITING_FOR_TOOL': return 3;
      case 'EXECUTING': return 4;
      case 'WAITING_FOR_APPROVAL': return 4;
      case 'VERIFYING': return 5;
      case 'COMPLETED': return 6;
      case 'FAILED': return 4;
      default: return 0;
    }
  };

  const activeIndex = getStageIndex(currentStatus);

  return (
    <div className="w-full p-4 lg:p-6 rounded-2xl glass-panel border border-[#1e2233] bg-[#0c0e17]/90 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#1e2233] pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wide uppercase">
            Autonomous Agent Orchestration Pipeline
          </h3>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
          State: {currentStatus}
        </span>
      </div>

      {/* Horizontal Flow Container */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = idx < activeIndex || currentStatus === 'COMPLETED';
          const isCurrent = idx === activeIndex && currentStatus !== 'COMPLETED';

          return (
            <div 
              key={stage.id} 
              className={`
                relative flex flex-col items-center p-3 rounded-xl border transition-all duration-300
                ${isDone 
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
                  : isCurrent 
                    ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/50' 
                    : 'bg-[#10121d] border-[#1e2233] text-slate-500 opacity-60'
                }
              `}
            >
              {/* Top Status Icon Node */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold text-xs transition-transform duration-300
                ${isDone 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                  : isCurrent 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/40 scale-110' 
                    : 'bg-slate-800 text-slate-500'
                }
              `}>
                {isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : isDone ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Stage Name */}
              <span className={`text-[10px] font-bold text-center tracking-wider uppercase ${
                isCurrent ? 'text-indigo-300 font-extrabold' : isDone ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                {stage.label}
              </span>

              {/* Indicator Dot */}
              {isCurrent && (
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
