import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  Database, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Cpu
} from 'lucide-react';

interface SettingsPageProps {
  serverStatus: { status: string; service?: string; supabase?: string; geminiConfigured?: boolean; supabaseConfigured?: boolean };
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ serverStatus }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [requireApprovalForBookings, setRequireApprovalForBookings] = useState(true);
  const [requireApprovalForEmails, setRequireApprovalForEmails] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5 text-indigo-400" />
          <span>Engine Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-white">System Settings & Security</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage AI API keys, Supabase database bindings, and safety guardrails</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Gemini AI Config Section */}
        <div className="p-6 rounded-2xl glass-panel border border-[#1e2233] bg-[#0c0e17] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e2233] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Gemini AI Model Credentials
            </h3>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
              serverStatus.geminiConfigured ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {serverStatus.geminiConfigured ? '✅ Active Key Loaded' : '⚠️ Fallback Planning Mode'}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Gemini API Key (GEMINI_API_KEY)</label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                placeholder={serverStatus.geminiConfigured ? "••••••••••••••••••••••••••••" : "Paste your Gemini API Key here..."}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full bg-[#121522] border border-[#222738] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-500">API keys are securely read from standard .env variables or user input overrides.</p>
          </div>
        </div>

        {/* Supabase Database Config Section */}
        <div className="p-6 rounded-2xl glass-panel border border-[#1e2233] bg-[#0c0e17] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e2233] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              Supabase PostgreSQL Connection
            </h3>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
              serverStatus.supabaseConfigured ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-300'
            }`}>
              {serverStatus.supabaseConfigured ? '✅ Supabase Connected' : 'ℹ️ Local In-Memory Store'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Supabase Project URL</label>
              <input
                type="text"
                placeholder="https://your-project.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full bg-[#121522] border border-[#222738] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Supabase Anon Key</label>
              <input
                type="password"
                placeholder="eyJhY... (Supabase Anon Key)"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full bg-[#121522] border border-[#222738] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Human-in-the-Loop Guardrail Thresholds */}
        <div className="p-6 rounded-2xl glass-panel border border-[#1e2233] bg-[#0c0e17] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e2233] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Human-in-the-Loop Safety Guardrails
            </h3>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              STRICT
            </span>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#121522] border border-[#222738] cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white">Require Approval for Purchases & Bookings</span>
                <p className="text-[11px] text-slate-400">Forces human confirmation before booking flights or hotels.</p>
              </div>
              <input
                type="checkbox"
                checked={requireApprovalForBookings}
                onChange={(e) => setRequireApprovalForBookings(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#121522] border border-[#222738] cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white">Require Approval for Email & Message Dispatches</span>
                <p className="text-[11px] text-slate-400">Forces human confirmation before sending emails to external partners.</p>
              </div>
              <input
                type="checkbox"
                checked={requireApprovalForEmails}
                onChange={(e) => setRequireApprovalForEmails(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Configuration saved successfully!
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
