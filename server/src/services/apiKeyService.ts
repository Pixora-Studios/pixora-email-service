import crypto from 'crypto';
import { storageService, StoredApiKey } from './storageService';

export function hashKey(rawKey: string): string {
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}

export function generateRawKey(): { rawKey: string; keyPrefix: string; keyHash: string } {
  const randomBytes = crypto.randomBytes(24).toString('hex');
  const rawKey = `pxr_live_${randomBytes}`;
  const keyPrefix = rawKey.substring(0, 14); // e.g. pxr_live_a1b2
  const keyHash = hashKey(rawKey);

  return { rawKey, keyPrefix, keyHash };
}

export class ApiKeyService {
  createApiKey(params: {
    name: string;
    description?: string;
    allowedOrigins?: string[];
  }): { apiKey: StoredApiKey; rawKey: string } {
    const { rawKey, keyPrefix, keyHash } = generateRawKey();
    const id = `key_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newKey: StoredApiKey = {
      id,
      name: params.name,
      keyPrefix,
      keyHash,
      isActive: true,
      createdAt: new Date().toISOString(),
      usageCount: 0,
      description: params.description,
      allowedOrigins: params.allowedOrigins,
    };

    storageService.saveApiKey(newKey);
    return { apiKey: newKey, rawKey };
  }

  validateKey(rawKey: string): StoredApiKey | null {
    if (!rawKey) return null;
    const targetHash = hashKey(rawKey.trim());
    const keys = storageService.getApiKeys();

    const matched = keys.find((k) => k.keyHash === targetHash && k.isActive);
    if (!matched) return null;

    // Track usage
    storageService.updateApiKey(matched.id, {
      lastUsedAt: new Date().toISOString(),
      usageCount: (matched.usageCount || 0) + 1,
    });

    return matched;
  }

  listKeys(): Omit<StoredApiKey, 'keyHash'>[] {
    const keys = storageService.getApiKeys();
    return keys.map(({ keyHash, ...rest }) => rest);
  }

  revokeKey(id: string): boolean {
    const updated = storageService.updateApiKey(id, { isActive: false });
    return !!updated;
  }

  deleteKey(id: string): boolean {
    return storageService.deleteApiKey(id);
  }
}

export const apiKeyService = new ApiKeyService();
