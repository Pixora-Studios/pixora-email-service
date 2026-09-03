import React, { useState } from 'react';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sliders,
  Sparkles,
  X,
} from 'lucide-react';
import { ProviderConfig } from '../types';
import { api } from '../services/api';

interface ProvidersProps {
  providers: ProviderConfig[];
  onRefresh: () => void;
}

export const Providers: React.FC<ProvidersProps> = ({ providers, onRefresh }) => {
  const [editingProvider, setEditingProvider] = useState<ProviderConfig | null>(null);
  const [testModalProvider, setTestModalProvider] = useState<ProviderConfig | null>(null);
  const [testEmailRecipient, setTestEmailRecipient] = useState('hello@pixorastudios.com');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const handleToggleActive = async (provider: ProviderConfig) => {
    try {
      await api.updateProvider(provider.id, { isActive: !provider.isActive });
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMovePriority = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= providers.length) return;

    const list = [...providers];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;

    const order = list.map((p) => p.id);
    try {
      await api.reorderProviders(order);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider) return;

    try {
      await api.updateProvider(editingProvider.id, {
        dailyLimit: Number(editingProvider.dailyLimit),
      });
      setEditingProvider(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSendDirectTest = async () => {
    if (!testModalProvider || !testEmailRecipient) return;

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await api.testProvider({
        provider: testModalProvider.providerName,
        to: testEmailRecipient,
      });
      setTestResult({ success: true, ...res });
      onRefresh();
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-indigo-600" />
          <span>Multi-Tier Provider & Fallback Engine</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure delivery priorities, daily quota caps, and verify live connectivity for Brevo, Resend, and Hostinger SMTP.
        </p>
      </div>

      {/* Provider Fallback Cards */}
      <div className="space-y-4">
        {providers.map((p, idx) => {
          const usagePercent = Math.min(100, Math.round(((p.sentToday || 0) / p.dailyLimit) * 100));

          return (
            <div
              key={p.id}
              className={`glass-panel p-6 transition-all ${
                !p.isActive ? 'opacity-60 bg-slate-50' : 'bg-white'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left info */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 shrink-0">
                    <span className="text-[10px] uppercase font-bold text-indigo-400">Tier</span>
                    <span className="text-base font-mono font-extrabold text-indigo-600">#{idx + 1}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-slate-900">{p.displayName}</h3>
                      <span className={`badge-status ${p.isActive ? 'badge-active' : 'badge-failed'}`}>
                        {p.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
                      <span>Key: <strong className="text-slate-700">{p.providerName}</strong></span>
                      <span>&bull;</span>
                      <span>Last Used: <strong className="text-slate-700">{p.lastUsedAt ? new Date(p.lastUsedAt).toLocaleTimeString() : 'Never'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Quota Progress */}
                  <div className="min-w-[150px] text-xs">
                    <div className="flex justify-between text-xs text-slate-500 mb-1 font-mono font-semibold">
                      <span>Quota:</span>
                      <span className="text-slate-900">{p.sentToday} / {p.dailyLimit}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${usagePercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Priority Reordering */}
                  <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-1">
                    <button
                      onClick={() => handleMovePriority(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded-lg hover:bg-slate-200/60"
                      title="Increase Priority"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMovePriority(idx, 'down')}
                      disabled={idx === providers.length - 1}
                      className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded-lg hover:bg-slate-200/60"
                      title="Decrease Priority"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Test Button */}
                  <button
                    onClick={() => {
                      setTestModalProvider(p);
                      setTestResult(null);
                    }}
                    className="btn-secondary text-xs"
                  >
                    <Send className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Test</span>
                  </button>

                  {/* Settings Button */}
                  <button
                    onClick={() => setEditingProvider(p)}
                    className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                    title="Edit Quota Settings"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>

                  {/* Toggle Active */}
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-bold border transition-all ${
                      p.isActive
                        ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {p.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>

              {p.lastError && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-mono text-xs">Last Error: {p.lastError}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Provider Test Modal */}
      {testModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Test {testModalProvider.displayName}</span>
              </h3>
              <button
                onClick={() => setTestModalProvider(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Sends an immediate verification email exclusively through this specific provider, bypassing fallback.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Send Test To Email</label>
              <input
                type="email"
                value={testEmailRecipient}
                onChange={(e) => setTestEmailRecipient(e.target.value)}
                placeholder="e.g. test@example.com"
                className="input-field"
              />
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {testResult.success ? (
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Test email sent successfully!</span>
                  </div>
                ) : (
                  <div>
                    <strong className="font-bold">Test Failed:</strong> {testResult.error}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setTestModalProvider(null)}
                className="btn-secondary text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSendDirectTest}
                disabled={isTesting}
                className="btn-primary text-xs"
              >
                {isTesting ? 'Sending...' : 'Send Test'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Quota Modal */}
      {editingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Adjust Daily Limit</h3>
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Daily Quota Limit ({editingProvider.displayName})
                </label>
                <input
                  type="number"
                  value={editingProvider.dailyLimit}
                  onChange={(e) =>
                    setEditingProvider({ ...editingProvider, dailyLimit: parseInt(e.target.value, 10) })
                  }
                  className="input-field"
                  min={1}
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  When this limit is reached in a single day, the engine automatically falls back to the next provider.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingProvider(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
