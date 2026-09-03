import fs from 'fs';
import path from 'path';
import { DEFAULT_PROVIDER_CONFIGS } from '../config/constants';

const DATA_DIR = path.resolve(__dirname, '../../../data');

export interface ProviderConfig {
  id: string;
  providerName: string;
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
  keyHash: string;
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

class StorageService {
  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private readJson<T>(filename: string, fallback: T): T {
    this.ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      this.writeJson(filename, fallback);
      return fallback;
    }
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  private writeJson<T>(filename: string, data: T) {
    this.ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  // --- Providers ---
  getProviders(): ProviderConfig[] {
    const providers = this.readJson<ProviderConfig[]>('providers.json', DEFAULT_PROVIDER_CONFIGS);
    return providers.sort((a, b) => a.priority - b.priority);
  }

  saveProviders(providers: ProviderConfig[]): void {
    this.writeJson('providers.json', providers);
  }

  updateProvider(id: string, updates: Partial<ProviderConfig>): ProviderConfig | null {
    const providers = this.getProviders();
    const index = providers.findIndex((p) => p.id === id || p.providerName === id);
    if (index === -1) return null;

    providers[index] = { ...providers[index], ...updates };
    this.saveProviders(providers);
    return providers[index];
  }

  // --- API Keys ---
  getApiKeys(): StoredApiKey[] {
    return this.readJson<StoredApiKey[]>('api_keys.json', []);
  }

  saveApiKey(key: StoredApiKey): void {
    const keys = this.getApiKeys();
    keys.push(key);
    this.writeJson('api_keys.json', keys);
  }

  updateApiKey(id: string, updates: Partial<StoredApiKey>): StoredApiKey | null {
    const keys = this.getApiKeys();
    const index = keys.findIndex((k) => k.id === id);
    if (index === -1) return null;

    keys[index] = { ...keys[index], ...updates };
    this.writeJson('api_keys.json', keys);
    return keys[index];
  }

  deleteApiKey(id: string): boolean {
    const keys = this.getApiKeys();
    const filtered = keys.filter((k) => k.id !== id);
    if (filtered.length === keys.length) return false;
    this.writeJson('api_keys.json', filtered);
    return true;
  }

  // --- Templates ---
  getTemplates(): EmailTemplate[] {
    return this.readJson<EmailTemplate[]>('templates.json', []);
  }

  saveTemplates(templates: EmailTemplate[]): void {
    this.writeJson('templates.json', templates);
  }

  upsertTemplate(template: EmailTemplate): EmailTemplate {
    const templates = this.getTemplates();
    const index = templates.findIndex((t) => t.slug === template.slug || t.id === template.id);
    if (index >= 0) {
      templates[index] = { ...templates[index], ...template, updatedAt: new Date().toISOString() };
    } else {
      templates.push(template);
    }
    this.saveTemplates(templates);
    return template;
  }

  deleteTemplate(id: string): boolean {
    const templates = this.getTemplates();
    const filtered = templates.filter((t) => t.id !== id && !t.isBuiltIn);
    if (filtered.length === templates.length) return false;
    this.saveTemplates(filtered);
    return true;
  }

  // --- Email Logs ---
  getLogs(limit = 100): EmailLog[] {
    const logs = this.readJson<EmailLog[]>('logs.json', []);
    return logs.slice(-limit).reverse();
  }

  addLog(log: EmailLog): void {
    const logs = this.readJson<EmailLog[]>('logs.json', []);
    logs.push(log);
    // Keep max 2000 logs locally
    if (logs.length > 2000) {
      logs.splice(0, logs.length - 2000);
    }
    this.writeJson('logs.json', logs);
  }
}

export const storageService = new StorageService();
