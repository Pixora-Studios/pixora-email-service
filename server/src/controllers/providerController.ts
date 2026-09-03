import { Request, Response } from 'express';
import { storageService, ProviderConfig } from '../services/storageService';

export const handleListProviders = (req: Request, res: Response) => {
  const providers = storageService.getProviders();
  res.json({ success: true, providers });
};

export const handleUpdateProvider = (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive, priority, dailyLimit } = req.body;

  const updates: Partial<ProviderConfig> = {};
  if (typeof isActive === 'boolean') updates.isActive = isActive;
  if (typeof priority === 'number') updates.priority = priority;
  if (typeof dailyLimit === 'number') updates.dailyLimit = dailyLimit;

  const updated = storageService.updateProvider(id, updates);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Provider not found' });
  }

  res.json({ success: true, provider: updated });
};

export const handleReorderProviders = (req: Request, res: Response) => {
  const { order } = req.body; // Array of provider IDs or names in desired priority order

  if (!Array.isArray(order)) {
    return res.status(400).json({ success: false, message: 'order must be an array of provider IDs' });
  }

  const providers = storageService.getProviders();
  order.forEach((idOrName, idx) => {
    const p = providers.find((item) => item.id === idOrName || item.providerName === idOrName);
    if (p) {
      p.priority = idx + 1;
    }
  });

  storageService.saveProviders(providers);
  res.json({ success: true, providers: storageService.getProviders() });
};
