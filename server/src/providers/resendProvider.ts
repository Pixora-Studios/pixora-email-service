import { Resend } from 'resend';
import { config } from '../config/env';
import { EMAIL_PROVIDERS } from '../config/constants';
import { EmailPayload, IEmailProvider, SendResult } from './types';

export class ResendProvider implements IEmailProvider {
  public readonly name = EMAIL_PROVIDERS.RESEND;

  async sendEmail(payload: EmailPayload): Promise<SendResult> {
    const start = Date.now();

    if (!config.resendApiKey) {
      throw new Error('Resend API key is not configured in environment variables');
    }

    const resend = new Resend(config.resendApiKey);

    const fromName = payload.fromName || config.fromName;
    const fromEmail = payload.fromEmail || config.fromEmail;
    const from = `${fromName} <${fromEmail}>`;

    const to = Array.isArray(payload.to)
      ? payload.to.map((e) => e.trim())
      : payload.to.trim();

    try {
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        replyTo: payload.replyTo,
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        provider: this.name,
        messageId: data?.id || 'resend-sent',
        durationMs: Date.now() - start,
      };
    } catch (error: any) {
      const errorMsg = error?.message || 'Unknown Resend error occurred';
      throw new Error(`[Resend API] ${errorMsg}`);
    }
  }
}

export const resendProvider = new ResendProvider();
