import * as BrevoSDK from '@getbrevo/brevo';
import { config } from '../config/env';
import { EMAIL_PROVIDERS } from '../config/constants';
import { EmailPayload, IEmailProvider, SendResult } from './types';

export class BrevoProvider implements IEmailProvider {
  public readonly name = EMAIL_PROVIDERS.BREVO;

  async sendEmail(payload: EmailPayload): Promise<SendResult> {
    const start = Date.now();

    if (!config.brevoApiKey) {
      throw new Error('Brevo API key is not configured in environment variables');
    }

    const recipients = Array.isArray(payload.to)
      ? payload.to.map((email) => ({ email: email.trim() }))
      : [{ email: payload.to.trim() }];

    try {
      // 1. Try SDK TransactionalEmailsApi
      const apiInstance = new (BrevoSDK as any).TransactionalEmailsApi();
      if (apiInstance.setApiKey) {
        apiInstance.setApiKey(
          (BrevoSDK as any).TransactionalEmailsApiApiKeys?.apiKey || 0,
          config.brevoApiKey
        );
      }

      const sendSmtpEmail = {
        subject: payload.subject,
        htmlContent: payload.html,
        textContent: payload.text || undefined,
        sender: {
          name: payload.fromName || config.fromName,
          email: payload.fromEmail || config.fromEmail,
        },
        to: recipients,
        replyTo: payload.replyTo ? { email: payload.replyTo } : undefined,
      };

      const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

      return {
        success: true,
        provider: this.name,
        messageId: (response as any)?.body?.messageId || (response as any)?.messageId || 'brevo-sent',
        durationMs: Date.now() - start,
      };
    } catch (sdkError: any) {
      // 2. Direct HTTPS fallback to Brevo v3 REST API endpoint in case of SDK version difference
      try {
        const directRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': config.brevoApiKey,
          },
          body: JSON.stringify({
            sender: {
              name: payload.fromName || config.fromName,
              email: payload.fromEmail || config.fromEmail,
            },
            to: recipients,
            subject: payload.subject,
            htmlContent: payload.html,
            textContent: payload.text || undefined,
            replyTo: payload.replyTo ? { email: payload.replyTo } : undefined,
          }),
        });

        const data = (await directRes.json()) as any;
        if (!directRes.ok) {
          throw new Error(data?.message || `Brevo HTTP error ${directRes.status}`);
        }

        return {
          success: true,
          provider: this.name,
          messageId: data?.messageId || 'brevo-sent',
          durationMs: Date.now() - start,
        };
      } catch (directError: any) {
        const errorMsg =
          directError?.message ||
          sdkError?.body?.message ||
          sdkError?.message ||
          'Unknown Brevo error occurred';
        throw new Error(`[Brevo API] ${errorMsg}`);
      }
    }
  }
}

export const brevoProvider = new BrevoProvider();
