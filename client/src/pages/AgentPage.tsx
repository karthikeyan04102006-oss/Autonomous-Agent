import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Sparkles, 
  Terminal, 
  Calendar, 
  Mail, 
  MapPin, 
  CloudSun, 
  Plane, 
  Building, 
  MessageSquare, 
  Brain,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import type { Task, AgentStep, ActivityLog } from '../types';
import { WorkflowPipeline } from '../components/WorkflowPipeline';

interface AgentPageProps {
  initialPrompt?: string;
  activeTask: Task | null;
  steps: AgentStep[];
  logs: ActivityLog[];
  onSubmitGoal: (goal: string) => void;
  onApproveAction: (taskId: string) => void;
  onRejectAction: (taskId: string) => void;
  isLoading: boolean;
}

export const AgentPage: React.FC<AgentPageProps> = ({
  initialPrompt = '',
  activeTask,
  steps,
  logs,
  onSubmitGoal,
  onApproveAction,
  onRejectAction,
  isLoading
}) => {
  const [goalInput, setGoalInput] = useState(initialPrompt);
  const [isRecording, setIsRecording] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setGoalInput(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim() || isLoading) return;
    onSubmitGoal(goalInput.trim());
  };

  const handleChipClick = (prompt: string) => {
    setGoalInput(prompt);
    onSubmitGoal(prompt);
  };

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      const voiceSamples = [
        "Schedule a meeting with my team tomorrow afternoon at 4 PM.",
        "Plan my Chennai trip flight MAA to DEL and reserve a room.",
        "Organize my unread inbox emails and send response summaries."
      ];
      const randomSample = voiceSamples[Math.floor(Math.random() * voiceSamples.length)];
      setTimeout(() => {
        setGoalInput(randomSample);
        setIsRecording(false);
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

  const suggestionChips = [
    "Schedule a team meeting",
    "Plan my Chennai trip",
    "Organize my emails",
    "Find a suitable hotel",
    "Create a weekly schedule"
  ];

  const connectedTools = [
    { name: 'Google Calendar API', icon: Calendar, status: 'connected', desc: 'Read availability & create events' },
    { name: 'Gmail API', icon: Mail, status: 'connected', desc: 'Draft & send participant invites' },
    { name: 'Google Maps API', icon: MapPin, status: 'connected', desc: 'Transit times & location routing' },
    { name: 'Weather API', icon: CloudSun, status: 'connected', desc: 'City forecasts & travel alerts' },
    { name: 'Flight Search API', icon: Plane, status: 'connected', desc: 'Real-time airline fares & schedules' },
    { name: 'Hotel Search API', icon: Building, status: 'connected', desc: 'Executive hotel reservations' },
    { name: 'Slack / WhatsApp API', icon: MessageSquare, status: 'connected', desc: 'Channel broadcasts & alerts' },
    { name: 'Memory Tool', icon: Brain, status: 'connected', desc: 'User preference context engine' },
  ];

  return (
    <div className="space-y-8 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Top Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>Autonomous Command Interface</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">AI Agent Command Center</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Give me a goal. I'll figure out the steps, select tools, and execute.</p>
        </div>

        {activeTask && (
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#121522] border border-[#222738]">
            <span className="text-xs font-semibold text-slate-400">Current Task:</span>
            <span className="text-xs font-bold text-indigo-300 font-mono">#{activeTask.id.slice(0, 8)}</span>
          </div>
        )}
      </div>

      {/* Large Input Box */}
      <div className="p-6 rounded-3xl glass-panel border border-[#1e2233] bg-[#0c0e17] shadow-2xl space-y-4 relative">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="What would you like me to accomplish? (e.g. Schedule a meeting with my team tomorrow afternoon...)"
              className="w-full bg-[#121522] border border-[#222738] rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 resize-none transition-all"
            />

            {/* Input Action Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    isRecording 
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
                      : 'bg-[#181c2d] text-slate-400 hover:text-white border-[#272d45]'
                  }`}
                  title="Voice Input"
                >
                  {isRecording ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-indigo-400" />}
                  <span className="hidden sm:inline">{isRecording ? 'Listening...' : 'Voice Input'}</span>
                </button>

                <button
                  type="button"
                  className="p-2.5 rounded-xl bg-[#181c2d] text-slate-400 hover:text-white border border-[#272d45] text-xs font-semibold flex items-center space-x-1.5 transition-all"
                  title="Attach Context Document"
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="hidden sm:inline">Attach</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || !goalInput.trim()}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Planning & Executing...</span>
                  </>
                ) : (
                  <>
                    <span>Execute Goal</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Suggested Task Chips */}
        <div className="pt-2 border-t border-[#1e2233]">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Suggested Prompts:
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(chip)}
                className="px-3 py-1.5 rounded-xl bg-[#141726] hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-[#222738] hover:border-indigo-500/40 text-xs font-medium transition-all"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Visual Execution Pipeline */}
      {activeTask && (
        <WorkflowPipeline currentStatus={activeTask.status} />
      )}

      {/* Main Execution Split View: Agent Working & Step Breakdown Cards */}
      {activeTask && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Interactive Task Step Planner */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-2xl glass-panel border border-[#1e2233] bg-[#0c0e17] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1e2233] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Agent Execution Plan Steps
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Decomposed goal into actionable tool steps</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {steps.filter(s => s.status === 'completed').length} / {steps.length} Steps Completed
                </span>
              </div>

              {/* Step Cards List */}
              <div className="space-y-3">
                {steps.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto" />
                    <p>Generating execution plan step cards...</p>
                  </div>
                ) : (
                  steps.map((step) => {
                    const isCompleted = step.status === 'completed';
                    const isRunning = step.status === 'running';
                    const isWaitingApproval = step.status === 'waiting_approval';
                    const isFailed = step.status === 'failed';

                    return (
                      <div
                        key={step.id}
                        className={`
                          p-4 rounded-xl border transition-all duration-200 space-y-2
                          ${isCompleted 
                            ? 'bg-emerald-950/10 border-emerald-500/30' 
                            : isRunning 
                              ? 'bg-indigo-950/30 border-indigo-500 shadow-md shadow-indigo-500/10 animate-pulse' 
                              : isWaitingApproval 
                                ? 'bg-amber-950/30 border-amber-500/50' 
                                : isFailed 
                                  ? 'bg-rose-950/20 border-rose-500/40' 
                                  : 'bg-[#101322] border-[#1e2233]'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`
                              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono
                              ${isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                                isRunning ? 'bg-indigo-600 text-white' :
                                isWaitingApproval ? 'bg-amber-500 text-slate-950 font-extrabold' :
                                'bg-slate-800 text-slate-400'}
                            `}>
                              0{step.step_number}
                            </span>
                            <h4 className="text-xs font-bold text-slate-200">{step.description}</h4>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center space-x-2">
                            {step.execution_time && (
                              <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                {step.execution_time}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isCompleted ? 'bg-emerald-500/20 text-emerald-400' :
                              isRunning ? 'bg-indigo-500/20 text-indigo-300 animate-pulse' :
                              isWaitingApproval ? 'bg-amber-500/20 text-amber-300' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {step.status}
                            </span>
                          </div>
                        </div>

                        {/* Tool Used Bar */}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1a1e30]">
                          <span className="text-slate-400">Tool: <strong className="text-indigo-300">{step.tool}</strong></span>
                          {step.requires_approval && (
                            <span className="text-amber-400 font-semibold flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3" />
                              Requires Approval
                            </span>
                          )}
                        </div>

                        {/* If Waiting Approval - Inline Action */}
                        {isWaitingApproval && (
                          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between mt-2">
                            <span className="text-xs font-medium text-amber-300">Action paused for your confirmation</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => onRejectAction(activeTask.id)}
                                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => onApproveAction(activeTask.id)}
                                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow"
                              >
                                Approve
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Real-Time Terminal Activity Logs */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl glass-panel border border-[#1e2233] bg-[#0a0c14] space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-[#1e2233] pb-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-300 font-bold">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Agent Stream Logs</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  LIVE
                </span>
              </div>

              {/* Log Feed Console */}
              <div className="h-80 overflow-y-auto space-y-2 text-[11px] pr-1">
                {logs.length === 0 ? (
                  <p className="text-slate-600 text-center py-8">Waiting for agent log stream...</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="space-y-0.5">
                      <div className="flex items-start space-x-2">
                        <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                        <span className={`leading-relaxed ${
                          log.status === 'success' ? 'text-emerald-400' :
                          log.status === 'warning' ? 'text-amber-400' :
                          log.status === 'error' ? 'text-rose-400' : 'text-slate-300'
                        }`}>
                          {log.message}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connected Tools Status Cards */}
      <div className="space-y-4 pt-4 border-t border-[#1e2233]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            Connected Execution Tools & APIs
          </h3>
          <span className="text-xs text-slate-400">Ready for autonomous tool calls</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {connectedTools.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-[#0c0e17] border border-[#1e2233] flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{t.desc}</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Connected" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
