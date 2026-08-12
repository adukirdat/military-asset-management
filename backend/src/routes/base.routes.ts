import { UserRole } from '@prisma/client';
import { Router } from 'express';
import { create, getById, list, remove, update } from '../controllers/base.controller.js';
import { authenticateToken } from '../middlewares/authenticate.js';
import { requireBaseAccess, requireRole } from '../middlewares/authorize.js';

export const baseRouter = Router();
baseRouter.use(authenticateToken);
baseRouter.post('/', requireRole(UserRole.ADMIN), create);
baseRouter.get('/', list);
baseRouter.get('/:id', requireBaseAccess((request) => typeof request.params.id === 'string' ? request.params.id : undefined), getById);
baseRouter.put('/:id', requireRole(UserRole.ADMIN), update);
baseRouter.delete('/:id', requireRole(UserRole.ADMIN), remove);
