import React from 'react';
import { AlertOctagon, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import type { AgentStep } from '../types';

interface HumanApprovalModalProps {
  step: AgentStep | null;
  onApprove: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({
  step,
  onApprove,
  onReject,
  isLoading = false
}) => {
  if (!step) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0f111c] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
        {/* Top Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-indigo-500" />

        {/* Modal Header */}
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 uppercase tracking-wider mb-1">
              <AlertOctagon className="w-3 h-3 mr-1" />
              Sensitive Action Approval Required
            </div>
            <h3 className="text-base font-bold text-white">Agent Requesting Permission</h3>
          </div>
        </div>

        {/* Action Details Card */}
        <div className="p-4 rounded-2xl bg-[#151827] border border-[#23283d] space-y-3">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Action Step:</span>
            <p className="text-sm font-semibold text-white mt-0.5">{step.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#23283d] text-xs">
            <div>
              <span className="text-slate-400">Target Tool:</span>
              <p className="font-semibold text-indigo-300">{step.tool}</p>
            </div>
            <div>
              <span className="text-slate-400">Risk Level:</span>
              <p className="font-semibold text-amber-400">High / External API</p>
            </div>
          </div>

          {/* Example Spec Preview */}
          <div className="p-3 rounded-xl bg-[#0a0c14] border border-[#1d2235] text-xs text-slate-300 space-y-1 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Operation:</span>
              <span className="text-amber-300">Execute Sensitive Payload</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Verification:</span>
              <span className="text-emerald-400">Validated by Guardrail Node</span>
            </div>
          </div>
        </div>

        {/* Informational Callout */}
        <p className="text-[11px] text-slate-400 leading-relaxed">
          AgentFlow security policy requires explicit human confirmation for sensitive operations like financial transactions, bookings, and external email dispatches.
        </p>

        {/* Decision Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={onReject}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Reject Action</span>
          </button>

          <button
            onClick={onApprove}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all border border-emerald-400/30 active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
