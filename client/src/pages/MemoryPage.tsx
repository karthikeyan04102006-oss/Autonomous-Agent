import React, { useState } from 'react';
import { 
  Brain, 
  Plus, 
  Trash2, 
  Sparkles, 
  Database
} from 'lucide-react';
import type { Memory } from '../types';

interface MemoryPageProps {
  memories: Memory[];
  onAddMemory: (key: string, value: string, category: string) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoryPage: React.FC<MemoryPageProps> = ({ memories, onAddMemory, onDeleteMemory }) => {
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('User Preferences');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim() || !valueInput.trim()) return;
    onAddMemory(keyInput.trim(), valueInput.trim(), categoryInput);
    setKeyInput('');
    setValueInput('');
    setShowAddForm(false);
  };

  const categories = ['User Preferences', 'Saved Context', 'Agent Context'];

  return (
    <div className="space-y-6 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span>Persistent Context Memory</span>
          </div>
          <h1 className="text-2xl font-bold text-white">AI Memory Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">Stored preferences & agent context guiding future decision workflows</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Preference</span>
        </button>
      </div>

      {/* Explanatory Banner Card */}
      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start space-x-3 text-xs text-indigo-200">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>How Memory Works:</strong> AgentFlow automatically queries these saved user preferences and historical choices before planning task steps (e.g. defaulting to your preferred meeting times, preferred airlines, and home location).
        </p>
      </div>

      {/* Add Memory Modal Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl glass-panel border border-indigo-500/40 bg-[#0e101c] space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-white">Add New Memory Item</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Preference Key (e.g. Preferred Meeting Slot)"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="bg-[#141726] border border-[#23283d] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Preference Value (e.g. 3 PM - 6 PM)"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              className="bg-[#141726] border border-[#23283d] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="bg-[#141726] border border-[#23283d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow"
            >
              Save Memory
            </button>
          </div>
        </form>
      )}

      {/* Memory Category Sections */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const catMemories = memories.filter(m => m.category === cat);

          return (
            <div key={cat} className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                {cat}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {catMemories.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#0a0c14] border border-[#1e2233] text-xs text-slate-500 col-span-full">
                    No items in this category yet.
                  </div>
                ) : (
                  catMemories.map((m) => (
                    <div key={m.id} className="p-4 rounded-xl bg-[#121522] border border-[#222738] flex items-center justify-between group space-x-3">
                      <div className="min-w-0">
                        <span className="text-[11px] text-slate-400 font-semibold block uppercase tracking-wider">{m.key}</span>
                        <p className="text-sm font-bold text-indigo-300 truncate mt-0.5">{m.value}</p>
                      </div>
                      <button
                        onClick={() => onDeleteMemory(m.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete memory"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
