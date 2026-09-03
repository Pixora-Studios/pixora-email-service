import React, { useState, useEffect } from 'react';
import {
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { api } from '../services/api';
import { EmailTemplate } from '../types';

interface SandboxProps {
  templates: EmailTemplate[];
  initialSlug?: string;
  onEmailSent?: () => void;
}

export const Sandbox: React.FC<SandboxProps> = ({ templates, initialSlug, onEmailSent }) => {
  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug || 'appointment-booking');
  const [recipient, setRecipient] = useState<string>('hello@pixorastudios.com');
  const [subjectOverride, setSubjectOverride] = useState<string>('');
  const [customHtml, setCustomHtml] = useState<string>('');
  const [templateDataJson, setTemplateDataJson] = useState<string>('{}');

  useEffect(() => {
    if (initialSlug) {
      setSelectedSlug(initialSlug);
    }
  }, [initialSlug]);

  // Preview state
  const [previewSubject, setPreviewSubject] = useState<string>('');
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'form' | 'json' | 'custom'>('form');

  // Sending state
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<any>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // Set default sample values for chosen template
  useEffect(() => {
    if (selectedSlug === 'custom') {
      setActiveTab('custom');
      return;
    }

    const tpl = templates.find((t) => t.slug === selectedSlug);
    if (!tpl) return;

    let sampleData: Record<string, any> = {};

    if (selectedSlug === 'appointment-booking') {
      sampleData = {
        clinicName: 'Pixora Dental Care',
        patientName: 'Alex Morgan',
        patientPhone: '+91 98765 43210',
        patientEmail: 'alex.morgan@example.com',
        preferredDate: '2026-09-10',
        preferredTime: '11:30 AM',
        treatmentRequired: 'Root Canal & Teeth Whitening',
        additionalNotes: 'Patient has mild sensitivity in lower left molar.',
      };
    } else if (selectedSlug === 'table-booking') {
      sampleData = {
        restaurantName: 'The Urban Bistro & Lounge',
        guestName: 'Sarah Jenkins',
        guestPhone: '+91 91234 56789',
        guestEmail: 'sarah.j@example.com',
        reservationDate: '2026-09-08',
        reservationTime: '08:00 PM',
        guestCount: 4,
        seatingPreference: 'Outdoor Rooftop Table',
        specialRequests: 'Celebrating a 5th wedding anniversary with a candlelit table setup.',
      };
    } else if (selectedSlug === 'contact-inquiry') {
      sampleData = {
        websiteName: 'Pixora Studios Digital',
        senderName: 'Michael Chen',
        senderEmail: 'm.chen@venture.io',
        senderPhone: '+1 555-0199',
        subject: 'Inquiry for Next.js Web App & Email System',
        message: 'Hello Pixora team, we need a high-performance web application with custom API email dispatch capabilities. Please schedule a discovery call.',
      };
    } else if (selectedSlug === 'otp-verification') {
      sampleData = {
        appName: 'Pixora Studios Platform',
        otpCode: '849201',
        expiresInMinutes: 10,
        userEmail: recipient,
      };
    } else if (selectedSlug === 'general-notification') {
      sampleData = {
        title: 'System Deployment Successful',
        subtitle: 'Production Release v2.4.0',
        message: 'Your new email microservice cluster is successfully live and operating normally with automatic multi-provider fallback enabled.',
        actionUrl: 'https://pixorastudios.com',
        actionText: 'Open Dashboard',
        footerNote: 'Thank you for building with Pixora Studios.',
      };
    } else {
      tpl.variables.forEach((v) => {
        sampleData[v] = `Sample ${v}`;
      });
    }

    setTemplateDataJson(JSON.stringify(sampleData, null, 2));
  }, [selectedSlug, templates]);

  // Update preview whenever template or data changes
  useEffect(() => {
    let parsedData = {};
    try {
      parsedData = JSON.parse(templateDataJson);
    } catch {
      // ignore invalid json during typing
    }

    if (selectedSlug === 'custom') {
      setPreviewSubject(subjectOverride || 'Custom Email Preview');
      setPreviewHtml(customHtml || '<p style="color: #94a3b8;">Enter custom HTML to preview...</p>');
      return;
    }

    api
      .previewTemplate({
        slug: selectedSlug,
        data: parsedData,
      })
      .then((res) => {
        setPreviewSubject(res.subject);
        setPreviewHtml(res.html);
      })
      .catch(() => {});
  }, [selectedSlug, templateDataJson, customHtml, subjectOverride]);

  const handleSend = async () => {
    if (!recipient) {
      alert('Please enter a recipient email');
      return;
    }

    setIsSending(true);
    setSendResult(null);
    setSendError(null);

    let parsedData = {};
    try {
      parsedData = JSON.parse(templateDataJson);
    } catch {
      setSendError('Invalid JSON format in template variables');
      setIsSending(false);
      return;
    }

    try {
      const payload: any = {
        to: recipient,
      };

      if (selectedSlug === 'custom') {
        payload.subject = subjectOverride || 'Custom Email from Pixora';
        payload.html = customHtml;
      } else {
        payload.template = selectedSlug;
        payload.data = parsedData;
        if (subjectOverride) {
          payload.subject = subjectOverride;
        }
      }

      const res = await api.sendEmail(payload);
      setSendResult(res);
      if (onEmailSent) onEmailSent();
    } catch (err: any) {
      setSendError(err.message || 'Failed to dispatch email');
    } finally {
      setIsSending(false);
    }
  };

  const handleVariableChange = (key: string, value: string) => {
    try {
      const current = JSON.parse(templateDataJson);
      current[key] = value;
      setTemplateDataJson(JSON.stringify(current, null, 2));
    } catch {
      //
    }
  };

  const currentParsedData = (() => {
    try {
      return JSON.parse(templateDataJson);
    } catch {
      return {};
    }
  })();

  const currentTemplate = templates.find((t) => t.slug === selectedSlug);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <span>Interactive Dispatch Sandbox</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Compose, live preview, and dispatch test emails using universal templates and automatic fallback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Composer Form (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-5 space-y-4">
            {/* Recipient */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Recipient Email (<span className="text-cyan-400">to</span>)
              </label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. client@example.com"
                className="input-field"
              />
            </div>

            {/* Template Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Template
              </label>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="input-field"
              >
                {templates.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name} ({t.slug})
                  </option>
                ))}
                <option value="custom">-- Custom Raw HTML Email --</option>
              </select>
            </div>

            {/* Subject Override */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subject (Optional Override)
              </label>
              <input
                type="text"
                value={subjectOverride}
                onChange={(e) => setSubjectOverride(e.target.value)}
                placeholder={previewSubject || 'Subject line...'}
                className="input-field"
              />
            </div>

            {/* Dynamic Content Tabs */}
            {selectedSlug !== 'custom' ? (
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="text-xs font-semibold text-slate-300">Template Variables</span>
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setActiveTab('form')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        activeTab === 'form' ? 'bg-cyan-500/20 text-cyan-400 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      Form View
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('json')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        activeTab === 'json' ? 'bg-cyan-500/20 text-cyan-400 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      JSON Editor
                    </button>
                  </div>
                </div>

                {activeTab === 'form' && currentTemplate && (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {currentTemplate.variables.map((varKey) => (
                      <div key={varKey}>
                        <label className="block text-[11px] font-mono text-cyan-400 mb-1">
                          {`{{${varKey}}}`}
                        </label>
                        <input
                          type="text"
                          value={currentParsedData[varKey] ?? ''}
                          onChange={(e) => handleVariableChange(varKey, e.target.value)}
                          className="input-field text-xs py-1.5"
                          placeholder={`Enter ${varKey}...`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'json' && (
                  <div>
                    <textarea
                      value={templateDataJson}
                      onChange={(e) => setTemplateDataJson(e.target.value)}
                      rows={8}
                      className="input-field code-editor text-xs"
                      placeholder="Enter JSON variables..."
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Custom HTML Body</label>
                <textarea
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)}
                  rows={8}
                  className="input-field code-editor text-xs"
                  placeholder="<h1>Hello World</h1><p>Your message...</p>"
                />
              </div>
            )}

            {/* Dispatch Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSend}
                disabled={isSending}
                className="btn-primary w-full justify-center py-3 text-sm font-bold disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Dispatching via Fallback Engine...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Email Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Diagnostic Result Banner */}
          {sendResult && (
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 shadow-lg animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Email Dispatched Successfully!</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Provider Used</span>
                  <span className="text-cyan-400 font-mono font-semibold">{sendResult.providerUsed}</span>
                </div>
                <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Latency</span>
                  <span className="text-slate-200 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {sendResult.durationMs}ms
                  </span>
                </div>
              </div>
              {sendResult.fallbackTriggered && (
                <div className="mt-2 text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-800/40">
                  ⚠️ Primary tier was unavailable. Auto-recovered by cascading through fallback chain: {sendResult.attemptedProviders?.join(' → ')}.
                </div>
              )}
            </div>
          )}

          {sendError && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Delivery Failed</strong>
                <span>{sendError}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Live Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="glass-panel p-4 flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Live Render Preview</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-1.5 rounded ${
                    previewMode === 'desktop' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-1.5 rounded ${
                    previewMode === 'mobile' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Subject preview */}
            <div className="py-2.5 px-3 bg-slate-950/80 rounded-lg border border-slate-800/80 my-3 text-xs flex items-center gap-2">
              <span className="text-slate-500 font-semibold shrink-0">Subject:</span>
              <span className="text-slate-200 font-medium truncate">{previewSubject || '(Empty subject)'}</span>
            </div>

            {/* HTML Preview Iframe Container */}
            <div className="flex-1 flex justify-center items-start bg-slate-950 rounded-xl border border-slate-800/80 p-3 overflow-hidden min-h-[420px]">
              <div
                className={`transition-all duration-300 w-full h-full flex flex-col ${
                  previewMode === 'mobile' ? 'max-w-[360px] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl' : ''
                }`}
              >
                <iframe
                  title="Email Preview"
                  srcDoc={previewHtml}
                  className="w-full h-full min-h-[420px] rounded-lg border-0 bg-slate-900"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
