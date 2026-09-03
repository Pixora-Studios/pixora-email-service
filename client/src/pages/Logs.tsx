import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { EmailLog } from '../types';

interface LogsProps {
  logs: EmailLog[];
  onRefresh: () => void;
}

export const Logs: React.FC<LogsProps> = ({ logs, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'DELIVERED' | 'FALLBACK_TRIGGERED' | 'FAILED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesStatus = filterStatus === 'ALL' || log.status === filterStatus;
    const matchesSearch =
      searchTerm === '' ||
      log.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.providerUsed && log.providerUsed.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.apiKeyName && log.apiKeyName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ScrollText className="w-6 h-6 text-cyan-400" />
            <span>Delivery & Fallback Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit log of all dispatches, provider routing decisions, and latency metrics.
          </p>
        </div>
        <button onClick={onRefresh} className="btn-secondary text-xs shrink-0">
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recipient, subject, provider..."
            className="input-field pl-9 text-xs"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto justify-center">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filterStatus === 'ALL' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            All ({logs.length})
          </button>
          <button
            onClick={() => setFilterStatus('DELIVERED')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filterStatus === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setFilterStatus('FALLBACK_TRIGGERED')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filterStatus === 'FALLBACK_TRIGGERED' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            Fallback
          </button>
          <button
            onClick={() => setFilterStatus('FAILED')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filterStatus === 'FAILED' ? 'bg-rose-500/20 text-rose-400 font-bold' : 'text-slate-400'
            }`}
          >
            Failed
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Provider Used</th>
                <th className="py-3 px-4">Caller / Key</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No matching logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      {log.status === 'DELIVERED' && (
                        <span className="badge-status badge-active">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Delivered</span>
                        </span>
                      )}
                      {log.status === 'FALLBACK_TRIGGERED' && (
                        <span className="badge-status badge-fallback">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Fallback</span>
                        </span>
                      )}
                      {log.status === 'FAILED' && (
                        <span className="badge-status badge-failed">
                          <XCircle className="w-3 h-3" />
                          <span>Failed</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">{log.to}</td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{log.subject}</td>
                    <td className="py-3 px-4">
                      {log.providerUsed ? (
                        <span className="font-mono text-[11px] text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {log.providerUsed}
                        </span>
                      ) : (
                        <span className="text-slate-600 font-mono text-[11px]">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {log.apiKeyName || 'Master Admin'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {log.durationMs}ms
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
                        title="View Detailed Diagnostic Trace"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Drawer Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-cyan-400" />
                <span>Delivery Diagnostic Trace</span>
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Log ID</span>
                  <span className="font-mono text-slate-300">{selectedLog.id}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Delivery Status</span>
                  <span className="font-bold text-white">{selectedLog.status}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Recipient</span>
                <span className="font-medium text-slate-200">{selectedLog.to}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Subject</span>
                <span className="font-medium text-slate-200">{selectedLog.subject}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">
                  Fallback Route Attempted
                </span>
                <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
                  {selectedLog.fallbackChain && selectedLog.fallbackChain.length > 0 ? (
                    selectedLog.fallbackChain.map((item, idx) => (
                      <React.Fragment key={item}>
                        <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">{item}</span>
                        {idx < selectedLog.fallbackChain.length - 1 && <span className="text-slate-600">→</span>}
                      </React.Fragment>
                    ))
                  ) : (
                    <span>Direct dispatch</span>
                  )}
                </div>
              </div>

              {selectedLog.errors && selectedLog.errors.length > 0 && (
                <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-900/50 space-y-1.5">
                  <span className="text-rose-400 block text-[10px] uppercase font-semibold">
                    Accumulated Fallback Errors ({selectedLog.errors.length})
                  </span>
                  {selectedLog.errors.map((err, i) => (
                    <div key={i} className="text-[11px] font-mono text-rose-300">
                      <strong>[{err.provider}]</strong>: {err.error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="btn-secondary text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
