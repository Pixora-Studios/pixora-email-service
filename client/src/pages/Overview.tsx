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
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-indigo-50 via-white to-sky-50 border border-indigo-100 shadow-xs">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Pixora Intelligent Email Router Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Universal, Resilient & Secure Email Infrastructure
          </h1>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
            Send emails reliably from any Pixora client application. Automated multi-tier fallback between{' '}
            <span className="text-indigo-600 font-bold">Brevo</span>,{' '}
            <span className="text-sky-600 font-bold">Resend</span>, and{' '}
            <span className="text-emerald-600 font-bold">Hostinger SMTP</span> guarantees high delivery uptime.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button onClick={() => onNavigate('sandbox')} className="btn-primary">
              <Zap className="w-4 h-4" />
              <span>Open Email Sandbox</span>
            </button>
            <button onClick={() => onNavigate('keys')} className="btn-secondary">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Generate Client API Key</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sent Today */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sent Today</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats?.totalSentToday ?? 0}</span>
            <span className="text-xs text-slate-400">/ {stats?.totalLimit ?? 1400} quota</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (((stats?.totalSentToday ?? 0) / (stats?.totalLimit || 1400)) * 100))}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Success Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{stats?.successRate ?? 100}%</span>
            <span className="text-xs text-slate-400">of all dispatches</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            {stats?.deliveredCount ?? 0} delivered &bull; {stats?.fallbackCount ?? 0} recovered via fallback
          </p>
        </div>

        {/* Fallbacks Recovered */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fallbacks Triggered</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">{stats?.fallbackCount ?? 0}</span>
            <span className="text-xs text-slate-400">auto-routed</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            Zero drop when primary provider is down
          </p>
        </div>

        {/* Active Providers */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Providers</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{activeProviders.length}</span>
            <span className="text-xs text-slate-400">/ {providers.length} configured</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            Priority: {providers.map((p) => p.displayName.split(' ')[0]).join(' → ')}
          </p>
        </div>
      </div>

      {/* Provider Fallback Chain Status */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600" />
              <span>Multi-Tier Provider Status & Quotas</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Automatic failover sequence from Tier #1 down to Tier #3
            </p>
          </div>
          <button
            onClick={() => onNavigate('providers')}
            className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-bold"
          >
            <span>Configure Fallback</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {providers.map((provider) => {
            const usagePercent = Math.min(100, Math.round(((provider.sentToday || 0) / provider.dailyLimit) * 100));
            const hasError = !provider.lastError;

            return (
              <div
                key={provider.id}
                className={`p-5 rounded-xl border transition-all ${
                  !provider.isActive
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : hasError
                    ? 'bg-white border-slate-200 shadow-xs'
                    : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        !provider.isActive
                          ? 'bg-slate-400'
                          : provider.lastError
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    ></div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{provider.displayName}</h3>
                      <span className="text-[11px] font-mono text-indigo-600 font-semibold">
                        Priority #{provider.priority}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`badge-status ${
                      !provider.isActive ? 'badge-failed' : provider.lastError ? 'badge-fallback' : 'badge-active'
                    }`}
                  >
                    {!provider.isActive ? 'Disabled' : provider.lastError ? 'Degraded' : 'Operational'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                  {provider.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Daily Quota</span>
                    <span className="font-bold text-slate-700 font-mono">
                      {provider.sentToday} / {provider.dailyLimit} ({usagePercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        usagePercent > 90
                          ? 'bg-rose-500'
                          : usagePercent > 70
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    ></div>
                  </div>
                </div>

                {provider.lastError && (
                  <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 font-mono line-clamp-1">
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
