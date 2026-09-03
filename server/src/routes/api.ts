import { Router } from 'express';
import { requireAdminAuth, requireAnyAuth } from '../middleware/auth';
import { handleSendEmail, handleTestProvider } from '../controllers/emailController';
import {
  handleListTemplates,
  handleGetTemplate,
  handleUpsertTemplate,
  handleDeleteTemplate,
  handlePreviewTemplate,
} from '../controllers/templateController';
import {
  handleListKeys,
  handleCreateKey,
  handleRevokeKey,
  handleDeleteKey,
} from '../controllers/keyController';
import {
  handleListProviders,
  handleUpdateProvider,
  handleReorderProviders,
} from '../controllers/providerController';
import { handleGetOverviewStats, handleGetLogs } from '../controllers/statsController';

const router = Router();

// ==========================================
// 1. Universal Dispatch Endpoints (Client API Key or Admin Key)
// ==========================================
router.post('/send', requireAnyAuth, handleSendEmail);
router.post('/email/send', requireAnyAuth, handleSendEmail); // alias for backwards/custom compatibility
router.get('/templates', requireAnyAuth, handleListTemplates);
router.get('/templates/:slug', requireAnyAuth, handleGetTemplate);
router.post('/templates/preview', requireAnyAuth, handlePreviewTemplate);

// ==========================================
// 2. Admin & Dashboard Endpoints (Master Admin Key Required)
// ==========================================
// Template CRUD
router.post('/admin/templates', requireAdminAuth, handleUpsertTemplate);
router.delete('/admin/templates/:id', requireAdminAuth, handleDeleteTemplate);

// API Keys Management
router.get('/admin/keys', requireAdminAuth, handleListKeys);
router.post('/admin/keys', requireAdminAuth, handleCreateKey);
router.patch('/admin/keys/:id/revoke', requireAdminAuth, handleRevokeKey);
router.delete('/admin/keys/:id', requireAdminAuth, handleDeleteKey);

// Providers & Fallback Config
router.get('/admin/providers', requireAdminAuth, handleListProviders);
router.patch('/admin/providers/:id', requireAdminAuth, handleUpdateProvider);
router.post('/admin/providers/reorder', requireAdminAuth, handleReorderProviders);
router.post('/admin/providers/test', requireAdminAuth, handleTestProvider);

// Stats & Logs
router.get('/admin/stats', requireAdminAuth, handleGetOverviewStats);
router.get('/admin/logs', requireAdminAuth, handleGetLogs);

export default router;
