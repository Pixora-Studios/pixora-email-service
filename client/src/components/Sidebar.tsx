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
    <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Management
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 font-bold border border-indigo-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div className="flex items-center gap-2 text-slate-800 font-bold mb-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>Active Endpoints</span>
        </div>
        <p className="text-[11.5px] text-slate-500 leading-relaxed">
          Universal <code className="text-indigo-600 bg-white border border-slate-200 px-1 py-0.5 rounded font-mono text-[10.5px]">POST /api/v1/send</code> with auto provider fallback.
        </p>
      </div>
    </aside>
  );
};
