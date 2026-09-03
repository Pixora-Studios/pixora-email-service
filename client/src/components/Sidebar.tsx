import React from 'react';
import {
  LayoutDashboard,
  Send,
  FileCode,
  KeyRound,
  Layers,
  ScrollText,
  BookOpen,
} from 'lucide-react';

export type NavTab = 'overview' | 'sandbox' | 'templates' | 'keys' | 'providers' | 'logs' | 'docs';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'sandbox', label: 'Sandbox / Dispatch', icon: Send, badge: 'Live' },
  { id: 'templates', label: 'Template Studio', icon: FileCode },
  { id: 'keys', label: 'API Keys', icon: KeyRound },
  { id: 'providers', label: 'Providers & Fallback', icon: Layers },
  { id: 'logs', label: 'Delivery Logs', icon: ScrollText },
  { id: 'docs', label: 'API Reference', icon: BookOpen },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/50 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Management
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span>Active Endpoints</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Universal <code className="text-cyan-400 bg-slate-950 px-1 py-0.5 rounded font-mono">POST /api/v1/send</code> accepting dynamic templates and auto fallback.
        </p>
      </div>
    </aside>
  );
};
