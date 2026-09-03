import { Request, Response } from 'express';
import { z } from 'zod';
import { emailService } from '../services/emailService';

const sendEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email()).min(1)]),
  subject: z.string().optional(),
  template: z.string().optional(),
  data: z.record(z.any()).optional(),
  html: z.string().optional(),
  text: z.string().optional(),
  fromName: z.string().optional(),
  fromEmail: z.string().email().optional(),
  replyTo: z.string().email().optional(),
});

export const handleSendEmail = async (req: Request, res: Response) => {
  const parseResult = sendEmailSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body',
      errors: parseResult.error.errors,
    });
  }

  const { to, subject, template, data, html, text, fromName, fromEmail, replyTo } = parseResult.data;

  // Track sender identity if client API key was used
  const apiKeyId = req.apiKey?.id;
  const apiKeyName = req.apiKey?.name || (req.isAdmin ? 'Master Admin' : undefined);

  const result = await emailService.sendEmail({
    to,
    subject,
    template,
    data,
    html,
    text,
    fromName,
    fromEmail,
    replyTo,
    apiKeyId,
    apiKeyName,
  });

  if (!result.success) {
    return res.status(502).json(result);
  }

  return res.status(200).json(result);
};

export const handleTestProvider = async (req: Request, res: Response) => {
  const { provider, to, subject } = req.body;

  if (!provider || !to) {
    return res.status(400).json({
      success: false,
      message: 'Both provider and to email address are required',
    });
  }

  const result = await emailService.sendEmail({
    to,
    subject: subject || `Pixora Test Email via ${provider}`,
    html: `<div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #fff; border-radius: 10px;">
      <h2 style="color: #38bdf8;">Pixora Email Service Test</h2>
      <p>This is a verification email routed directly through provider: <strong>${provider}</strong>.</p>
      <p style="color: #94a3b8; font-size: 13px;">Timestamp: ${new Date().toISOString()}</p>
    </div>`,
    forcedProvider: provider,
    apiKeyName: 'Admin Direct Test',
  });

  return res.status(result.success ? 200 : 502).json(result);
};
