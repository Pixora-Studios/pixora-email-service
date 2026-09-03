import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../config/env';
import { EMAIL_PROVIDERS } from '../config/constants';
import { EmailPayload, IEmailProvider, SendResult } from './types';

export class NodemailerProvider implements IEmailProvider {
  public readonly name = EMAIL_PROVIDERS.HOSTINGER_SMTP;
  private transporter: Transporter | null = null;

  private getTransporter(): Transporter {
    if (!this.transporter) {
      if (!config.hostingerSmtp.user || !config.hostingerSmtp.pass) {
        throw new Error('Hostinger SMTP credentials are not configured');
      }

      this.transporter = nodemailer.createTransport({
        host: config.hostingerSmtp.host,
        port: config.hostingerSmtp.port,
        secure: config.hostingerSmtp.secure, // true for port 465 (SSL)
        auth: {
          user: config.hostingerSmtp.user,
          pass: config.hostingerSmtp.pass,
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
      });
    }
    return this.transporter;
  }

  async sendEmail(payload: EmailPayload): Promise<SendResult> {
    const start = Date.now();
    const transporter = this.getTransporter();

    const fromName = payload.fromName || config.fromName;
    const fromEmail = payload.fromEmail || config.fromEmail;
    const from = `"${fromName}" <${fromEmail}>`;

    const to = Array.isArray(payload.to)
      ? payload.to.join(', ')
      : payload.to;

    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        replyTo: payload.replyTo,
      });

      return {
        success: true,
        provider: this.name,
        messageId: info.messageId || 'nodemailer-sent',
        durationMs: Date.now() - start,
      };
    } catch (error: any) {
      const errorMsg = error?.message || 'Unknown Hostinger SMTP error';
      throw new Error(`[Hostinger SMTP] ${errorMsg}`);
    }
  }
}

export const nodemailerProvider = new NodemailerProvider();
