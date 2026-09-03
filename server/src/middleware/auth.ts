import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import { apiKeyService } from '../services/apiKeyService';
import { StoredApiKey } from '../services/storageService';

// Extend Express Request to hold authenticated key/admin info
declare global {
  namespace Express {
    interface Request {
      isAdmin?: boolean;
      apiKey?: StoredApiKey;
    }
  }
}

/**
 * Master Admin Key Authentication (for Dashboard admin actions, creating keys, updating providers)
 */
export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const adminKey = req.headers['x-admin-key'] as string;

  if (!adminKey || adminKey.trim() !== config.masterAdminKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Missing or invalid Master Admin Key (x-admin-key header)',
    });
  }

  req.isAdmin = true;
  next();
};

/**
 * Universal Authentication (Accepts either Master Admin Key or Valid Client API Key)
 */
export const requireAnyAuth = (req: Request, res: Response, next: NextFunction) => {
  const adminKey = req.headers['x-admin-key'] as string;
  const apiKeyHeader = (req.headers['x-api-key'] as string) || '';
  const authHeader = req.headers.authorization || '';

  // Extract token from x-api-key, x-admin-key, or Bearer header
  let token = apiKeyHeader.trim() || (adminKey ? adminKey.trim() : '');
  if (!token && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Provide a valid API key via x-api-key, Authorization: Bearer <key>, or x-admin-key',
    });
  }

  // 1. Check if token matches Master Admin Key
  if (token === config.masterAdminKey || (adminKey && adminKey.trim() === config.masterAdminKey)) {
    req.isAdmin = true;
    return next();
  }

  // 2. Validate against stored client API keys
  const validatedKey = apiKeyService.validateKey(token);
  if (!validatedKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or revoked API Key',
    });
  }

  req.apiKey = validatedKey;
  next();
};
