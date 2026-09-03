import { storageService, EmailLog, ProviderConfig } from './storageService';
import { brevoProvider } from '../providers/brevoProvider';
import { resendProvider } from '../providers/resendProvider';
import { nodemailerProvider } from '../providers/nodemailerProvider';
import { EMAIL_PROVIDERS } from '../config/constants';
import { EmailPayload, IEmailProvider } from '../providers/types';
import { templateService } from './templateService';

const providerInstances: Record<string, IEmailProvider> = {
  [EMAIL_PROVIDERS.BREVO]: brevoProvider,
  [EMAIL_PROVIDERS.RESEND]: resendProvider,
  [EMAIL_PROVIDERS.HOSTINGER_SMTP]: nodemailerProvider,
};

export interface SendEmailRequest {
  to: string | string[];
  subject?: string;
  template?: string; // slug or ID
  data?: Record<string, any>;
  html?: string;
  text?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  apiKeyId?: string;
  apiKeyName?: string;
  forcedProvider?: string; // Optional: bypass fallback for testing
}

export interface SendEmailResponse {
  success: boolean;
  providerUsed?: string;
  messageId?: string;
  fallbackTriggered?: boolean;
  attemptedProviders?: string[];
  durationMs?: number;
  error?: string;
}

export class EmailService {
  /**
   * Resets daily counters if date has changed
   */
  private checkAndResetDailyCounters(): void {
    const today = new Date().toISOString().split('T')[0];
    const providers = storageService.getProviders();
    let updated = false;

    for (const p of providers) {
      if (p.lastResetDate !== today) {
        p.sentToday = 0;
        p.lastResetDate = today;
        updated = true;
      }
    }

    if (updated) {
      storageService.saveProviders(providers);
    }
  }

  /**
   * Universal email sender with automatic multi-provider fallback
   */
  async sendEmail(request: SendEmailRequest): Promise<SendEmailResponse> {
    const overallStartTime = Date.now();
    this.checkAndResetDailyCounters();

    // 1. Resolve content (either template rendering or direct html)
    let finalSubject = request.subject || '';
    let finalHtml = request.html || '';
    let finalText = request.text || '';

    if (request.template) {
      try {
        const rendered = templateService.renderTemplate(
          request.template,
          request.data || {},
          request.subject
        );
        finalSubject = rendered.subject;
        finalHtml = rendered.html;
        finalText = rendered.text;
      } catch (err: any) {
        return {
          success: false,
          error: `Template Error: ${err.message}`,
        };
      }
    }

    if (!finalSubject || !finalHtml) {
      return {
        success: false,
        error: 'Missing required email content: both subject and html content are required (or a valid template).',
      };
    }

    const payload: EmailPayload = {
      to: request.to,
      subject: finalSubject,
      html: finalHtml,
      text: finalText,
      fromName: request.fromName,
      fromEmail: request.fromEmail,
      replyTo: request.replyTo,
    };

    // 2. Determine provider order
    const allProviders = storageService.getProviders();
    let activeProviders: ProviderConfig[] = [];

    if (request.forcedProvider) {
      const forced = allProviders.find((p) => p.providerName === request.forcedProvider);
      if (!forced) {
        return {
          success: false,
          error: `Requested provider '${request.forcedProvider}' is not configured.`,
        };
      }
      activeProviders = [forced];
    } else {
      activeProviders = allProviders
        .filter((p) => p.isActive)
        .sort((a, b) => a.priority - b.priority);
    }

    if (activeProviders.length === 0) {
      return {
        success: false,
        error: 'No active email providers available.',
      };
    }

    const attemptedProviders: string[] = [];
    const errors: Array<{ provider: string; error: string; time: string }> = [];
    const recipientStr = Array.isArray(request.to) ? request.to.join(', ') : request.to;

    // 3. Fallback cascade loop
    for (let i = 0; i < activeProviders.length; i++) {
      const providerDoc = activeProviders[i];
      const providerName = providerDoc.providerName;

      // Check daily limit
      if (providerDoc.sentToday >= providerDoc.dailyLimit) {
        errors.push({
          provider: providerName,
          error: `Daily limit reached (${providerDoc.sentToday}/${providerDoc.dailyLimit})`,
          time: new Date().toISOString(),
        });
        continue;
      }

      const instance = providerInstances[providerName];
      if (!instance) {
        errors.push({
          provider: providerName,
          error: `Provider implementation module missing for ${providerName}`,
          time: new Date().toISOString(),
        });
        continue;
      }

      attemptedProviders.push(providerName);

      try {
        const sendResult = await instance.sendEmail(payload);

        // Success! Update provider counters
        storageService.updateProvider(providerDoc.id, {
          sentToday: providerDoc.sentToday + 1,
          lastUsedAt: new Date().toISOString(),
          lastError: undefined,
        });

        const totalDuration = Date.now() - overallStartTime;
        const wasFallback = attemptedProviders.length > 1;

        // Record successful log
        const logEntry: EmailLog = {
          id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          to: recipientStr,
          subject: finalSubject,
          templateSlug: request.template,
          providerUsed: providerName,
          status: wasFallback ? 'FALLBACK_TRIGGERED' : 'DELIVERED',
          fallbackChain: attemptedProviders,
          errors,
          apiKeyId: request.apiKeyId,
          apiKeyName: request.apiKeyName,
          durationMs: totalDuration,
          timestamp: new Date().toISOString(),
        };
        storageService.addLog(logEntry);

        return {
          success: true,
          providerUsed: providerName,
          messageId: sendResult.messageId,
          fallbackTriggered: wasFallback,
          attemptedProviders,
          durationMs: totalDuration,
        };
      } catch (err: any) {
        const errorMessage = err?.message || 'Unknown provider error';
        errors.push({
          provider: providerName,
          error: errorMessage,
          time: new Date().toISOString(),
        });

        // Record error on provider doc
        storageService.updateProvider(providerDoc.id, {
          lastError: errorMessage,
          lastErrorAt: new Date().toISOString(),
        });

        // Continue to next provider in fallback cascade
      }
    }

    // 4. If all providers exhausted or failed
    const totalDuration = Date.now() - overallStartTime;
    const failureLog: EmailLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      to: recipientStr,
      subject: finalSubject,
      templateSlug: request.template,
      status: 'FAILED',
      fallbackChain: attemptedProviders,
      errors,
      apiKeyId: request.apiKeyId,
      apiKeyName: request.apiKeyName,
      durationMs: totalDuration,
      timestamp: new Date().toISOString(),
    };
    storageService.addLog(failureLog);

    return {
      success: false,
      error: `All active email providers failed: ${errors.map((e) => `[${e.provider}: ${e.error}]`).join('; ')}`,
      attemptedProviders,
      durationMs: totalDuration,
    };
  }
}

export const emailService = new EmailService();
