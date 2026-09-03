import { Request, Response } from 'express';
import { storageService } from '../services/storageService';

export const handleGetOverviewStats = (req: Request, res: Response) => {
  const providers = storageService.getProviders();
  const logs = storageService.getLogs(500);

  const totalSentToday = providers.reduce((sum, p) => sum + (p.sentToday || 0), 0);
  const totalLimit = providers.reduce((sum, p) => sum + (p.dailyLimit || 0), 0);

  const deliveredCount = logs.filter((l) => l.status === 'DELIVERED').length;
  const fallbackCount = logs.filter((l) => l.status === 'FALLBACK_TRIGGERED').length;
  const failedCount = logs.filter((l) => l.status === 'FAILED').length;
  const totalLogs = logs.length;

  const successRate = totalLogs > 0 ? Math.round(((deliveredCount + fallbackCount) / totalLogs) * 100) : 100;

  // Breakdown by provider
  const providerUsage: Record<string, number> = {};
  logs.forEach((log) => {
    if (log.providerUsed) {
      providerUsage[log.providerUsed] = (providerUsage[log.providerUsed] || 0) + 1;
    }
  });

  res.json({
    success: true,
    stats: {
      totalSentToday,
      totalLimit,
      successRate,
      deliveredCount,
      fallbackCount,
      failedCount,
      totalLoggedEmails: totalLogs,
      providerUsage,
      activeProvidersCount: providers.filter((p) => p.isActive).length,
    },
    providers,
  });
};

export const handleGetLogs = (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string, 10) || 100;
  const logs = storageService.getLogs(limit);
  res.json({ success: true, logs });
};
