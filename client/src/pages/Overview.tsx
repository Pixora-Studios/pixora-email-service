import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Layers,
  ArrowRight,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { OverviewStats, ProviderConfig } from '../types';

interface OverviewProps {
  stats: OverviewStats | null;
  providers: ProviderConfig[];
  onNavigate: (tab: any) => void;
}

export const Overview: React.FC<OverviewProps> = ({ stats, providers, onNavigate }) => {
  const activeProviders = providers.filter((p) => p.isActive);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Pixora Intelligent Email Router Active
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Universal, Resilient & Secure Email Infrastructure
          </h1>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            Send emails reliably from any Pixora client application. Automated multi-tier fallback between{' '}
            <span className="text-cyan-300 font-semibold">Brevo</span>,{' '}
            <span className="text-indigo-300 font-semibold">Resend</span>, and{' '}
            <span className="text-emerald-300 font-semibold">Hostinger SMTP</span> guarantees 99.9% delivery uptime.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button onClick={() => onNavigate('sandbox')} className="btn-primary">
              <Zap className="w-4 h-4" />
              <span>Open Email Sandbox</span>
            </button>
            <button onClick={() => onNavigate('keys')} className="btn-secondary">
              <ShieldCheck className="w-4 h-4" />
              <span>Generate Client API Key</span>
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sent Today */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sent Today</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{stats?.totalSentToday ?? 0}</span>
            <span className="text-xs text-slate-500">/ {stats?.totalLimit ?? 1400} quota</span>
          </div>
          <div className="mt-3 w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (((stats?.totalSentToday ?? 0) / (stats?.totalLimit || 1400)) * 100))}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Success Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">{stats?.successRate ?? 100}%</span>
            <span className="text-xs text-slate-500">of all dispatches</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            {stats?.deliveredCount ?? 0} delivered &bull; {stats?.fallbackCount ?? 0} recovered via fallback
          </p>
        </div>

        {/* Fallbacks Recovered */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fallbacks Triggered</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">{stats?.fallbackCount ?? 0}</span>
            <span className="text-xs text-slate-500">auto-routed</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Zero message drop when primary provider is down
          </p>
        </div>

        {/* Active Providers */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Providers</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{activeProviders.length}</span>
            <span className="text-xs text-slate-500">/ {providers.length} configured</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Priority: {providers.map((p) => p.displayName.split(' ')[0]).join(' → ')}
          </p>
        </div>
      </div>

      {/* Provider Fallback Chain Status */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Multi-Tier Provider Status & Quotas</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Automatic failover order from Priority 1 down to Priority 3
            </p>
          </div>
          <button
            onClick={() => onNavigate('providers')}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            <span>Configure Fallback</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {providers.map((provider) => {
            const usagePercent = Math.min(100, Math.round(((provider.sentToday || 0) / provider.dailyLimit) * 100));
            const hasError = !!provider.lastError;

            return (
              <div
                key={provider.id}
                className={`p-4 rounded-xl border transition-all ${
                  !provider.isActive
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                    : hasError
                    ? 'bg-slate-900/90 border-amber-800/60'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        !provider.isActive
                          ? 'bg-slate-600'
                          : hasError
                          ? 'bg-amber-400 animate-pulse'
                          : 'bg-emerald-400'
                      }`}
                    ></div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{provider.displayName}</h3>
                      <span className="text-[11px] font-mono text-cyan-400">
                        Priority #{provider.priority}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`badge-status ${
                      !provider.isActive ? 'badge-failed' : hasError ? 'badge-fallback' : 'badge-active'
                    }`}
                  >
                    {!provider.isActive ? 'Disabled' : hasError ? 'Degraded' : 'Operational'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 line-clamp-2">
                  {provider.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-slate-400">Daily Quota</span>
                    <span className="font-semibold text-slate-200">
                      {provider.sentToday} / {provider.dailyLimit} ({usagePercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        usagePercent > 90
                          ? 'bg-rose-500'
                          : usagePercent > 70
                          ? 'bg-amber-500'
                          : 'bg-cyan-500'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    ></div>
                  </div>
                </div>

                {hasError && (
                  <div className="mt-3 p-2 bg-amber-950/40 border border-amber-900/60 rounded-lg text-[11px] text-amber-300 font-mono line-clamp-1">
                    {provider.lastError}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
