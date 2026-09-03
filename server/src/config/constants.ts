export const EMAIL_PROVIDERS = {
  BREVO: 'BREVO',
  RESEND: 'RESEND',
  HOSTINGER_SMTP: 'HOSTINGER_SMTP',
} as const;

export type EmailProviderName = typeof EMAIL_PROVIDERS[keyof typeof EMAIL_PROVIDERS];

export const DEFAULT_PROVIDER_CONFIGS = [
  {
    id: 'provider_brevo',
    providerName: EMAIL_PROVIDERS.BREVO,
    displayName: 'Brevo (Sendinblue API)',
    priority: 1,
    isActive: true,
    dailyLimit: 300,
    sentToday: 0,
    lastResetDate: new Date().toISOString().split('T')[0],
    description: 'Primary transactional tier via REST API (300 free emails/day)',
  },
  {
    id: 'provider_resend',
    providerName: EMAIL_PROVIDERS.RESEND,
    displayName: 'Resend API',
    priority: 2,
    isActive: true,
    dailyLimit: 100,
    sentToday: 0,
    lastResetDate: new Date().toISOString().split('T')[0],
    description: 'Secondary high-deliverability tier via Resend API (100 free/day)',
  },
  {
    id: 'provider_hostinger',
    providerName: EMAIL_PROVIDERS.HOSTINGER_SMTP,
    displayName: 'Hostinger / Titan SMTP',
    priority: 3,
    isActive: true,
    dailyLimit: 1000,
    sentToday: 0,
    lastResetDate: new Date().toISOString().split('T')[0],
    description: 'Dedicated domain SMTP fallback (hello@pixorastudios.com)',
  },
];
