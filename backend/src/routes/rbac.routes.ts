import { UserRole } from '@prisma/client';
import { Router } from 'express';
import { Permission } from '../config/permissions.js';
import { authenticateToken } from '../middlewares/authenticate.js';
import { requireBaseAccess, requirePermission, requireRole } from '../middlewares/authorize.js';

/** Development-only endpoints for verifying authorization behavior. Remove before exposing business APIs. */
export const rbacRouter = Router();

rbacRouter.get('/admin-test', authenticateToken, requireRole(UserRole.ADMIN), (_request, response) => {
  response.status(200).json({ success: true, message: 'Administrative authorization verified' });
});

rbacRouter.get('/inventory-test', authenticateToken, requirePermission(Permission.INVENTORY_VIEW), (_request, response) => {
  response.status(200).json({ success: true, message: 'Inventory permission verified' });
});

rbacRouter.get('/base-test/:baseId', authenticateToken, requireBaseAccess((request) => {
  const baseId = request.params.baseId;
  return typeof baseId === 'string' ? baseId : undefined;
}), (request, response) => {
  response.status(200).json({ success: true, message: 'Base-scope authorization verified', data: { baseId: request.params.baseId } });
});
