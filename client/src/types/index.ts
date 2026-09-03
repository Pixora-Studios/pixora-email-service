export interface ProviderConfig {
  id: string;
  providerName: 'BREVO' | 'RESEND' | 'HOSTINGER_SMTP' | string;
  displayName: string;
  priority: number;
  isActive: boolean;
  dailyLimit: number;
  sentToday: number;
  lastResetDate: string;
  lastUsedAt?: string;
  lastError?: string;
  lastErrorAt?: string;
  description?: string;
}

export interface StoredApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  isActive: boolean;
  createdAt: string;
  lastUsedAt?: string;
  usageCount: number;
  allowedOrigins?: string[];
  description?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  subjectTemplate: string;
  htmlContent: string;
  variables: string[];
  isBuiltIn: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  templateSlug?: string;
  providerUsed?: string;
  status: 'DELIVERED' | 'FAILED' | 'FALLBACK_TRIGGERED';
  fallbackChain: string[];
  errors: Array<{ provider: string; error: string; time: string }>;
  apiKeyId?: string;
  apiKeyName?: string;
  durationMs: number;
  timestamp: string;
}

export interface OverviewStats {
  totalSentToday: number;
  totalLimit: number;
  successRate: number;
  deliveredCount: number;
  fallbackCount: number;
  failedCount: number;
  totalLoggedEmails: number;
  providerUsage: Record<string, number>;
  activeProvidersCount: number;
}
