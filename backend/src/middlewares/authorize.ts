import { UserRole } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import { hasPermission, type Permission } from '../config/permissions.js';

function sendForbidden(response: Response): void {
  response.status(403).json({ success: false, message: 'Insufficient permissions' });
}

function requireAuthenticatedUser(request: Request, response: Response): boolean {
  if (request.authUser) return true;
  response.status(401).json({ success: false, message: 'Authentication required' });
  return false;
}

export function requireRole(...roles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    if (!requireAuthenticatedUser(request, response)) return;
    if (!roles.includes(request.authUser!.role)) return sendForbidden(response);
    next();
  };
}

export function requirePermission(permission: Permission) {
  return (request: Request, response: Response, next: NextFunction): void => {
    if (!requireAuthenticatedUser(request, response)) return;
    if (!hasPermission(request.authUser!.role, permission)) return sendForbidden(response);
    next();
  };
}

export function requireBaseAccess(getTargetBaseId: (request: Request) => string | undefined) {
  return (request: Request, response: Response, next: NextFunction): void => {
    if (!requireAuthenticatedUser(request, response)) return;

    const { role, baseId } = request.authUser!;
    const targetBaseId = getTargetBaseId(request);
    if (!targetBaseId) return sendForbidden(response);
    if (role === UserRole.ADMIN || (baseId !== null && baseId === targetBaseId)) return next();
    sendForbidden(response);
  };
}
