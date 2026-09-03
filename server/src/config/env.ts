import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5050', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  baseUrl: process.env.BASE_URL || 'http://localhost:5050',
  masterAdminKey: process.env.MASTER_ADMIN_KEY || 'PXR-ADMIN-Z5R8N2QX7M4K9L1V',

  // Sender defaults
  fromEmail: process.env.FROM_EMAIL || 'hello@pixorastudios.com',
  fromName: process.env.FROM_NAME || 'Pixora Studios',

  // Provider credentials
  brevoApiKey: process.env.BREVO_API_KEY || '',
  resendApiKey: process.env.RESEND_API_KEY || '',

  hostingerSmtp: {
    host: process.env.HOSTINGER_SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.HOSTINGER_SMTP_PORT || '465', 10),
    secure: process.env.HOSTINGER_SMTP_SECURE === 'true',
    user: process.env.HOSTINGER_SMTP_USER || 'hello@pixorastudios.com',
    pass: process.env.HOSTINGER_SMTP_PASS || '',
  },

  // Security
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '200', 10),
  allowedOrigins: process.env.ALLOWED_ORIGINS || '*',
};
