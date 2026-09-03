export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
}

export interface SendResult {
  success: boolean;
  provider: string;
  messageId?: string;
  error?: string;
  durationMs?: number;
}

export interface IEmailProvider {
  name: string;
  sendEmail(payload: EmailPayload): Promise<SendResult>;
}
