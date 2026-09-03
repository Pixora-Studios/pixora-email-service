import React, { useState } from 'react';
import { Mail, Key, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getAdminKey, setAdminKey } from '../services/api';

interface NavbarProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onRefresh, isRefreshing }) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [inputKey, setInputKey] = useState(getAdminKey());
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveKey = () => {
    setAdminKey(inputKey);
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      setShowKeyModal(false);
      window.location.reload();
    }, 800);
  };

  return (
    <>
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">PIXORA</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono font-semibold">
                EMAIL ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Multi-Provider Fallback Microservice</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cluster Healthy</span>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          )}

          <button
            onClick={() => {
              setInputKey(getAdminKey());
              setShowKeyModal(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-all shadow-sm"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>Master Key</span>
          </button>
        </div>
      </header>

      {/* Admin Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Master Admin Key</h3>
                <p className="text-xs text-slate-400">Required for administrative operations & key management</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Master Admin Key</label>
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Enter Master Admin Key..."
                  className="input-field font-mono text-sm"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Stored securely in your local browser session storage.
                </p>
              </div>

              {savedMessage && (
                <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Master Key saved! Reloading session...</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveKey}
                  className="btn-primary text-xs"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
