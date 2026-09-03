import { Request, Response } from 'express';
import { templateService } from '../services/templateService';
import { storageService, EmailTemplate } from '../services/storageService';

export const handleListTemplates = (req: Request, res: Response) => {
  const templates = templateService.getAllTemplates();
  res.json({ success: true, templates });
};

export const handleGetTemplate = (req: Request, res: Response) => {
  const { slug } = req.params;
  const template = templateService.getTemplateBySlug(slug);
  if (!template) {
    return res.status(404).json({ success: false, message: 'Template not found' });
  }
  res.json({ success: true, template });
};

export const handleUpsertTemplate = (req: Request, res: Response) => {
  const { name, slug, description, subjectTemplate, htmlContent, variables } = req.body;

  if (!name || !slug || !subjectTemplate || !htmlContent) {
    return res.status(400).json({
      success: false,
      message: 'name, slug, subjectTemplate, and htmlContent are required',
    });
  }

  const existing = templateService.getTemplateBySlug(slug);

  const tpl: EmailTemplate = {
    id: existing?.id || `tpl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    slug: slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
    description: description || '',
    subjectTemplate,
    htmlContent,
    variables: Array.isArray(variables) ? variables : [],
    isBuiltIn: existing?.isBuiltIn || false,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const saved = storageService.upsertTemplate(tpl);
  res.json({ success: true, template: saved });
};

export const handleDeleteTemplate = (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = storageService.deleteTemplate(id);
  if (!deleted) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete built-in template or template not found',
    });
  }
  res.json({ success: true, message: 'Template deleted' });
};

export const handlePreviewTemplate = (req: Request, res: Response) => {
  const { slug, subjectTemplate, htmlContent, data } = req.body;

  try {
    let renderedSubject = '';
    let renderedHtml = '';

    if (slug) {
      const rendered = templateService.renderTemplate(slug, data || {});
      renderedSubject = rendered.subject;
      renderedHtml = rendered.html;
    } else if (htmlContent) {
      renderedSubject = templateService.render(subjectTemplate || '', data || {});
      renderedHtml = templateService.render(htmlContent, data || {});
    } else {
      return res.status(400).json({ success: false, message: 'Provide slug or htmlContent' });
    }

    res.json({
      success: true,
      subject: renderedSubject,
      html: renderedHtml,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
