import React from 'react';
import { 
  Plug, 
  Calendar, 
  Mail, 
  HardDrive, 
  MapPin, 
  MessageSquare, 
  Plane, 
  Building, 
  Power
} from 'lucide-react';
import type { Integration } from '../types';

interface IntegrationsPageProps {
  integrations: Integration[];
  onToggle: (provider: string) => void;
}

export const IntegrationsPage: React.FC<IntegrationsPageProps> = ({ integrations, onToggle }) => {
  const iconMap: Record<string, any> = {
    'Google Calendar': Calendar,
    'Gmail': Mail,
    'Google Drive': HardDrive,
    'Google Maps': MapPin,
    'WhatsApp': MessageSquare,
    'Slack': MessageSquare,
    'Flight Search': Plane,
    'Hotel Search': Building,
  };

  return (
    <div className="space-y-6 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
          <Plug className="w-3.5 h-3.5 text-indigo-400" />
          <span>App Ecosystem</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Integrations Marketplace</h1>
        <p className="text-xs text-slate-400 mt-0.5">Connect external tool APIs for autonomous agent action execution</p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((item) => {
          const Icon = iconMap[item.provider] || Plug;
          const isConnected = item.status === 'connected';

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isConnected 
                  ? 'glass-panel border-indigo-500/30 bg-[#0e101c]' 
                  : 'bg-[#0a0c14] border-[#1e2233] opacity-80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{item.provider}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1e2233] flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">Used: {item.last_used || 'Never'}</span>
                <button
                  onClick={() => onToggle(item.provider)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isConnected 
                      ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{isConnected ? 'Disconnect' : 'Connect App'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
