import { OverviewStats, ProviderConfig, StoredApiKey, EmailTemplate, EmailLog } from '../types';

const STORAGE_KEY_ADMIN = 'pixora_email_admin_key';
const DEFAULT_ADMIN_KEY = 'PXR-ADMIN-Z5R8N2QX7M4K9L1V';

export const getAdminKey = (): string => {
  return localStorage.getItem(STORAGE_KEY_ADMIN) || DEFAULT_ADMIN_KEY;
};

export const setAdminKey = (key: string): void => {
  localStorage.setItem(STORAGE_KEY_ADMIN, key.trim());
};

const BASE_URL = '/api';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const adminKey = getAdminKey();
  const headers = {
    'Content-Type': 'application/json',
    'x-admin-key': adminKey,
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP error ${response.status}`);
  }
  return data;
}

export const api = {
  // Stats & Logs
  getStats: async (): Promise<{ stats: OverviewStats; providers: ProviderConfig[] }> => {
    return fetchWithAuth('/admin/stats');
  },

  getLogs: async (limit = 100): Promise<{ logs: EmailLog[] }> => {
    return fetchWithAuth(`/admin/logs?limit=${limit}`);
  },

  // Providers
  getProviders: async (): Promise<{ providers: ProviderConfig[] }> => {
    return fetchWithAuth('/admin/providers');
  },

  updateProvider: async (id: string, updates: Partial<ProviderConfig>): Promise<{ provider: ProviderConfig }> => {
    return fetchWithAuth(`/admin/providers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  reorderProviders: async (order: string[]): Promise<{ providers: ProviderConfig[] }> => {
    return fetchWithAuth('/admin/providers/reorder', {
      method: 'POST',
      body: JSON.stringify({ order }),
    });
  },

  testProvider: async (params: { provider: string; to: string; subject?: string }) => {
    return fetchWithAuth('/admin/providers/test', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Templates
  getTemplates: async (): Promise<{ templates: EmailTemplate[] }> => {
    return fetchWithAuth('/templates');
  },

  getTemplate: async (slug: string): Promise<{ template: EmailTemplate }> => {
    return fetchWithAuth(`/templates/${slug}`);
  },

  saveTemplate: async (templateData: Partial<EmailTemplate>): Promise<{ template: EmailTemplate }> => {
    return fetchWithAuth('/admin/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  },

  deleteTemplate: async (id: string): Promise<{ success: boolean }> => {
    return fetchWithAuth(`/admin/templates/${id}`, {
      method: 'DELETE',
    });
  },

  previewTemplate: async (payload: { slug?: string; subjectTemplate?: string; htmlContent?: string; data: any }) => {
    return fetchWithAuth('/templates/preview', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // API Keys
  getKeys: async (): Promise<{ keys: StoredApiKey[] }> => {
    return fetchWithAuth('/admin/keys');
  },

  createKey: async (params: { name: string; description?: string; allowedOrigins?: string[] }): Promise<{ apiKey: StoredApiKey; rawKey: string }> => {
    return fetchWithAuth('/admin/keys', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  revokeKey: async (id: string): Promise<{ success: boolean }> => {
    return fetchWithAuth(`/admin/keys/${id}/revoke`, {
      method: 'PATCH',
    });
  },

  deleteKey: async (id: string): Promise<{ success: boolean }> => {
    return fetchWithAuth(`/admin/keys/${id}`, {
      method: 'DELETE',
    });
  },

  // Dispatch Email
  sendEmail: async (payload: {
    to: string | string[];
    subject?: string;
    template?: string;
    data?: Record<string, any>;
    html?: string;
    text?: string;
    fromName?: string;
    fromEmail?: string;
    apiKey?: string; // If using client API key instead of admin key
  }) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (payload.apiKey) {
      headers['x-api-key'] = payload.apiKey;
    } else {
      headers['x-admin-key'] = getAdminKey();
    }

    const { apiKey, ...bodyPayload } = payload;

    const response = await fetch(`${BASE_URL}/send`, {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyPayload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || `Failed with status ${response.status}`);
    }
    return data;
  },
};
