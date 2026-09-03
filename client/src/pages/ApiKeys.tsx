import React, { useState } from 'react';
import {
  KeyRound,
  Plus,
  Trash2,
  Ban,
  Check,
  Copy,
  ShieldCheck,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { StoredApiKey } from '../types';
import { api } from '../services/api';

interface ApiKeysProps {
  keys: StoredApiKey[];
  onRefresh: () => void;
}

export const ApiKeys: React.FC<ApiKeysProps> = ({ keys, onRefresh }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [allowedOrigins, setAllowedOrigins] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Once generated key reveal modal
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    setError(null);

    try {
      const origins = allowedOrigins
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.createKey({
        name: name.trim(),
        description: description.trim(),
        allowedOrigins: origins.length > 0 ? origins : undefined,
      });

      setNewlyCreatedKey(res.rawKey);
      setShowCreateModal(false);
      setName('');
      setDescription('');
      setAllowedOrigins('');
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to generate API Key');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (confirm('Are you sure you want to deactivate this API key? Client applications using this key will immediately be blocked.')) {
      try {
        await api.revokeKey(id);
        onRefresh();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently delete this API key record?')) {
      try {
        await api.deleteKey(id);
        onRefresh();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-cyan-400" />
            <span>Client API Keys & Access Control</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate and manage scoped API credentials for client websites (Dental Clinic, Café, Portfolio, etc.). Only authorized callers with these keys can dispatch emails.
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" />
          <span>Create New API Key</span>
        </button>
      </div>

      {/* Keys Table / Cards */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">Key Name & Prefix</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Dispatches</th>
                <th className="py-3 px-4">Last Used</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {keys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No client API keys created yet. Generate one to allow external services to send emails.
                  </td>
                </tr>
              ) : (
                keys.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{k.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code className="text-cyan-400 font-mono text-[11px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {k.keyPrefix}...
                        </code>
                        {k.description && (
                          <span className="text-slate-500 text-[11px] truncate max-w-xs">{k.description}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`badge-status ${k.isActive ? 'badge-active' : 'badge-failed'}`}>
                        {k.isActive ? 'Active' : 'Revoked'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{k.usageCount || 0}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString() : 'Never'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(k.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {k.isActive && (
                          <button
                            onClick={() => handleRevoke(k.id)}
                            className="p-1.5 text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 rounded-lg border border-amber-900/40 transition-colors"
                            title="Deactivate Key"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(k.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 rounded-lg border border-rose-900/40 transition-colors"
                          title="Delete Key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Newly Created Key Dialog */}
      {newlyCreatedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">API Key Generated Successfully!</h3>
                <p className="text-xs text-slate-400">Please copy and store this key now. It will not be shown again.</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <code className="text-xs font-mono text-cyan-400 break-all select-all font-semibold">
                {newlyCreatedKey}
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(newlyCreatedKey)}
                className="btn-primary text-xs shrink-0 py-2"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 bg-amber-950/40 border border-amber-800/60 text-amber-300 text-[11px] rounded-lg">
              ⚠️ Give this key to the specific client app or developer. They should pass it in header: <code className="text-white font-mono bg-slate-950 px-1 py-0.5 rounded">x-api-key: {newlyCreatedKey.substring(0, 15)}...</code>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setNewlyCreatedKey(null)}
                className="btn-secondary text-xs"
              >
                I Have Saved This Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <span>Create New API Key</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Key Name / Client Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dental Clinic Booking System"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Appointment notifications for Dr. Smith's Dental Website"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Allowed Origins (Optional, Comma-separated)
                </label>
                <input
                  type="text"
                  value={allowedOrigins}
                  onChange={(e) => setAllowedOrigins(e.target.value)}
                  placeholder="https://clinic1.com, https://app.pixorastudios.com"
                  className="input-field"
                />
                <p className="text-[10px] text-slate-500 mt-1">Leave empty to allow universal server-to-server calls.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="btn-primary text-xs"
                >
                  {isCreating ? 'Generating...' : 'Generate API Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
