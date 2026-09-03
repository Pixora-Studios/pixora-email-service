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
  X,
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
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <ScrollText className="w-6 h-6 text-indigo-600" />
            <span>Delivery & Fallback Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time audit log of all dispatches, provider routing decisions, and latency metrics.
          </p>
        </div>
        <button onClick={onRefresh} className="btn-secondary text-xs shrink-0">
          <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recipient, subject, provider..."
            className="input-field pl-10 text-xs"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs w-full sm:w-auto justify-center">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              filterStatus === 'ALL' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            All ({logs.length})
          </button>
          <button
            onClick={() => setFilterStatus('DELIVERED')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              filterStatus === 'DELIVERED' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setFilterStatus('FALLBACK_TRIGGERED')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              filterStatus === 'FALLBACK_TRIGGERED' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Fallback
          </button>
          <button
            onClick={() => setFilterStatus('FAILED')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              filterStatus === 'FAILED' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
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
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase font-bold text-[10.5px] tracking-wider">
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-4">Recipient</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Provider Used</th>
                <th className="py-3.5 px-4">Caller / Key</th>
                <th className="py-3.5 px-4">Latency</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No matching logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
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
                    <td className="py-3.5 px-4 font-bold text-slate-800">{log.to}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{log.subject}</td>
                    <td className="py-3.5 px-4">
                      {log.providerUsed ? (
                        <span className="font-mono text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-bold border border-indigo-100">
                          {log.providerUsed}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {log.apiKeyName || 'Master Admin'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {log.durationMs}ms
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
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

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-indigo-600" />
                <span>Delivery Diagnostic Trace</span>
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Log ID</span>
                  <span className="font-mono text-slate-800 font-semibold">{selectedLog.id}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Delivery Status</span>
                  <span className="font-bold text-slate-900">{selectedLog.status}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Recipient</span>
                <span className="font-semibold text-slate-800">{selectedLog.to}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Subject</span>
                <span className="font-semibold text-slate-800">{selectedLog.subject}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1.5">
                  Fallback Route Attempted
                </span>
                <div className="flex items-center gap-2 font-mono text-xs text-indigo-600 font-bold">
                  {selectedLog.fallbackChain && selectedLog.fallbackChain.length > 0 ? (
                    selectedLog.fallbackChain.map((item, idx) => (
                      <React.Fragment key={item}>
                        <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">{item}</span>
                        {idx < selectedLog.fallbackChain.length - 1 && <span className="text-slate-400">→</span>}
                      </React.Fragment>
                    ))
                  ) : (
                    <span>Direct dispatch</span>
                  )}
                </div>
              </div>

              {selectedLog.errors && selectedLog.errors.length > 0 && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-1.5">
                  <span className="text-rose-700 block text-[10px] uppercase font-bold">
                    Accumulated Fallback Errors ({selectedLog.errors.length})
                  </span>
                  {selectedLog.errors.map((err, i) => (
                    <div key={i} className="text-xs font-mono text-rose-800">
                      <strong>[{err.provider}]</strong>: {err.error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
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
