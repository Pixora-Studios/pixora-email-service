import React, { useState } from 'react';
import {
  FileCode,
  Plus,
  Edit,
  Trash2,
  Lock,
  Code,
  Sparkles,
} from 'lucide-react';
import { EmailTemplate } from '../types';
import { api } from '../services/api';

interface TemplatesProps {
  templates: EmailTemplate[];
  onRefresh: () => void;
  onSelectInSandbox?: (slug: string) => void;
}

export const Templates: React.FC<TemplatesProps> = ({
  templates,
  onRefresh,
  onSelectInSandbox,
}) => {
  const [editingTemplate, setEditingTemplate] = useState<Partial<EmailTemplate> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingTemplate({
      name: '',
      slug: '',
      description: '',
      subjectTemplate: '',
      htmlContent: `<div style="font-family: sans-serif; padding: 24px; background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 12px;">
  <h2 style="color: #4f46e5;">{{title}}</h2>
  <p>{{message}}</p>
</div>`,
      variables: ['title', 'message'],
      isBuiltIn: false,
    });
    setErrorMessage(null);
  };

  const handleEdit = (t: EmailTemplate) => {
    setEditingTemplate({ ...t });
    setErrorMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    if (!editingTemplate.name || !editingTemplate.slug || !editingTemplate.subjectTemplate || !editingTemplate.htmlContent) {
      setErrorMessage('Please fill in all required fields (Name, Slug, Subject, HTML).');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await api.saveTemplate(editingTemplate);
      setEditingTemplate(null);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete template "${name}"?`)) {
      try {
        await api.deleteTemplate(id);
        onRefresh();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <FileCode className="w-6 h-6 text-indigo-600" />
            <span>Universal Template Studio</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Standardized transactional HTML templates with dynamic mustache <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-mono font-bold">{'{{placeholder}}'}</code> variables.
          </p>
        </div>
        <button onClick={handleCreateNew} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" />
          <span>New Custom Template</span>
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((tpl) => (
          <div key={tpl.id} className="glass-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {tpl.name}
                    {tpl.isBuiltIn && (
                      <span title="Built-in Standard Template" className="text-indigo-600">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </h3>
                  <code className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md mt-1 inline-block font-semibold">
                    {tpl.slug}
                  </code>
                </div>
                <span
                  className={`badge-status ${tpl.isBuiltIn ? 'badge-info' : 'badge-active'}`}
                >
                  {tpl.isBuiltIn ? 'Standard' : 'Custom'}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">{tpl.description}</p>

              {/* Subject */}
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Subject Format</span>
                <span className="text-slate-800 font-mono text-xs truncate block font-medium">{tpl.subjectTemplate}</span>
              </div>

              {/* Variables */}
              <div className="mt-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  Variables ({tpl.variables.length})
                </span>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {tpl.variables.map((v) => (
                    <span
                      key={v}
                      className="text-[10.5px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-md font-medium"
                    >
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
              {onSelectInSandbox && (
                <button
                  onClick={() => onSelectInSandbox(tpl.slug)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Test in Sandbox</span>
                </button>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(tpl)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                  title="Edit Template"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                {!tpl.isBuiltIn && (
                  <button
                    onClick={() => handleDelete(tpl.id, tpl.name)}
                    className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                    title="Delete Template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-600" />
                <span>{editingTemplate.id ? 'Edit Template' : 'Create Custom Template'}</span>
              </h3>
              <button
                onClick={() => setEditingTemplate(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold px-2"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Template Name</label>
                  <input
                    type="text"
                    value={editingTemplate.name || ''}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    placeholder="e.g. Dental Reminder"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Slug Identifier</label>
                  <input
                    type="text"
                    value={editingTemplate.slug || ''}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, slug: e.target.value })}
                    placeholder="e.g. dental-reminder"
                    disabled={editingTemplate.isBuiltIn}
                    className="input-field disabled:bg-slate-100 disabled:opacity-70"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject Template</label>
                <input
                  type="text"
                  value={editingTemplate.subjectTemplate || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, subjectTemplate: e.target.value })}
                  placeholder="e.g. Reminder for {{patientName}} - {{date}}"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={editingTemplate.description || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  placeholder="Brief summary of when this template is dispatched..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">HTML Template Content</label>
                <textarea
                  value={editingTemplate.htmlContent || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, htmlContent: e.target.value })}
                  rows={10}
                  className="input-field code-editor text-xs"
                  placeholder="<!DOCTYPE html>..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Variables (Comma-separated)
                </label>
                <input
                  type="text"
                  value={editingTemplate.variables?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      variables: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g. patientName, clinicName, preferredDate"
                  className="input-field"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary text-xs"
                >
                  {isSaving ? 'Saving...' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
