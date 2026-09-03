import React, { useState } from 'react';
import { BookOpen, Code2, Terminal } from 'lucide-react';
import { CodeBlock } from '../components/CodeBlock';

export const Docs: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<'curl' | 'js' | 'node' | 'python'>('js');

  const curlCode = `curl -X POST "http://localhost:5050/api/v1/send" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_CLIENT_API_KEY" \\
  -d '{
    "to": "client@example.com",
    "template": "appointment-booking",
    "data": {
      "clinicName": "Pixora Dental Care",
      "patientName": "Alex Morgan",
      "patientPhone": "+91 98765 43210",
      "patientEmail": "alex@example.com",
      "preferredDate": "2026-09-10",
      "preferredTime": "11:30 AM",
      "treatmentRequired": "Dental Cleaning",
      "additionalNotes": "None"
    }
  }'`;

  const jsCode = `// Universal Email Dispatch in JavaScript / React
async function sendPixoraEmail() {
  const response = await fetch("http://localhost:5050/api/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "YOUR_CLIENT_API_KEY", // generated in Pixora Email Dashboard
    },
    body: JSON.stringify({
      to: "client@example.com",
      template: "appointment-booking",
      data: {
        clinicName: "Pixora Dental Care",
        patientName: "Alex Morgan",
        patientPhone: "+91 98765 43210",
        patientEmail: "alex@example.com",
        preferredDate: "2026-09-10",
        preferredTime: "11:30 AM",
        treatmentRequired: "Dental Cleaning",
        additionalNotes: "First time visit",
      },
    }),
  });

  const result = await response.json();
  console.log("Delivery result:", result);
  // Returns: { success: true, providerUsed: "BREVO", durationMs: 240 }
}`;

  const nodeCode = `// Node.js / Express Backend integration
import axios from "axios";

export async function sendEmailNotification(appointmentData: any, recipientEmail: string) {
  try {
    const res = await axios.post(
      "http://localhost:5050/api/v1/send",
      {
        to: recipientEmail,
        template: "appointment-booking",
        data: appointmentData,
      },
      {
        headers: {
          "x-api-key": process.env.PIXORA_EMAIL_API_KEY,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    console.error("Email service error:", error.response?.data || error.message);
    throw error;
  }
}`;

  const pythonCode = `# Python / FastAPI / Django Integration
import requests

def send_pixora_email(recipient: str, template_slug: str, variables: dict):
    url = "http://localhost:5050/api/v1/send"
    headers = {
        "Content-Type": "application/json",
        "x-api-key": "YOUR_CLIENT_API_KEY",
    }
    payload = {
        "to": recipient,
        "template": template_slug,
        "data": variables,
    }

    response = requests.post(url, json=payload, headers=headers)
    return response.json()`;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <span>API Reference & Developer Quickstart</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Integrate the universal Pixora Email Service into any external site, dental clinic app, or café ordering system.
        </p>
      </div>

      {/* Quick Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">HTTP Method & Path</span>
          <code className="text-xs font-mono font-bold text-cyan-400 mt-1 block">POST /api/v1/send</code>
        </div>
        <div className="glass-card p-4">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Authentication Header</span>
          <code className="text-xs font-mono font-bold text-emerald-400 mt-1 block">x-api-key: pxr_live_...</code>
        </div>
        <div className="glass-card p-4">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Fallback Engine</span>
          <span className="text-xs font-semibold text-indigo-300 mt-1 block">Brevo → Resend → Hostinger SMTP</span>
        </div>
      </div>

      {/* Code Tabs */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Integration Code Examples</h2>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedLang('js')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                selectedLang === 'js' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
              }`}
            >
              JavaScript / Fetch
            </button>
            <button
              onClick={() => setSelectedLang('node')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                selectedLang === 'node' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
              }`}
            >
              Node.js
            </button>
            <button
              onClick={() => setSelectedLang('curl')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                selectedLang === 'curl' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setSelectedLang('python')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                selectedLang === 'python' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
              }`}
            >
              Python
            </button>
          </div>
        </div>

        {selectedLang === 'curl' && <CodeBlock code={curlCode} language="bash" title="cURL Request" />}
        {selectedLang === 'js' && <CodeBlock code={jsCode} language="javascript" title="Fetch API (Frontend/Client)" />}
        {selectedLang === 'node' && <CodeBlock code={nodeCode} language="typescript" title="Node.js / Axios (Backend)" />}
        {selectedLang === 'python' && <CodeBlock code={pythonCode} language="python" title="Python (Requests)" />}
      </div>

      {/* Schema Table */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Payload JSON Schema (`POST /api/v1/send`)</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
                <th className="py-2.5 px-3">Field</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Required</th>
                <th className="py-2.5 px-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              <tr>
                <td className="py-2.5 px-3 text-cyan-400">to</td>
                <td className="py-2.5 px-3 text-slate-400">string | string[]</td>
                <td className="py-2.5 px-3 text-rose-400 font-bold">Yes</td>
                <td className="py-2.5 px-3 text-slate-300 font-sans">Recipient email address or array of emails</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-cyan-400">template</td>
                <td className="py-2.5 px-3 text-slate-400">string</td>
                <td className="py-2.5 px-3 text-slate-400">Optional*</td>
                <td className="py-2.5 px-3 text-slate-300 font-sans">Template slug identifier (e.g. <code>appointment-booking</code>)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-cyan-400">data</td>
                <td className="py-2.5 px-3 text-slate-400">object</td>
                <td className="py-2.5 px-3 text-slate-400">Optional</td>
                <td className="py-2.5 px-3 text-slate-300 font-sans">Key-value dictionary matching template placeholders</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-cyan-400">html</td>
                <td className="py-2.5 px-3 text-slate-400">string</td>
                <td className="py-2.5 px-3 text-slate-400">Optional*</td>
                <td className="py-2.5 px-3 text-slate-300 font-sans">Raw HTML string (required if template is not specified)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-cyan-400">subject</td>
                <td className="py-2.5 px-3 text-slate-400">string</td>
                <td className="py-2.5 px-3 text-slate-400">Optional</td>
                <td className="py-2.5 px-3 text-slate-300 font-sans">Email subject (overrides template default subject)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
