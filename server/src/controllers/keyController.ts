import { Request, Response } from 'express';
import { apiKeyService } from '../services/apiKeyService';

export const handleListKeys = (req: Request, res: Response) => {
  const keys = apiKeyService.listKeys();
  res.json({ success: true, keys });
};

export const handleCreateKey = (req: Request, res: Response) => {
  const { name, description, allowedOrigins } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ success: false, message: 'Key name is required' });
  }

  const { apiKey, rawKey } = apiKeyService.createApiKey({
    name,
    description,
    allowedOrigins,
  });

  res.json({
    success: true,
    apiKey,
    rawKey, // returned ONLY once upon creation
    message: 'Save this API key safely now. It will not be shown again in plain text.',
  });
};

export const handleRevokeKey = (req: Request, res: Response) => {
  const { id } = req.params;
  const revoked = apiKeyService.revokeKey(id);
  if (!revoked) {
    return res.status(404).json({ success: false, message: 'Key not found' });
  }
  res.json({ success: true, message: 'Key deactivated successfully' });
};

export const handleDeleteKey = (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = apiKeyService.deleteKey(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Key not found' });
  }
  res.json({ success: true, message: 'Key deleted permanently' });
};
