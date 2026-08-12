import { UserRole } from '@prisma/client';
import { Router } from 'express';
import { create, getById, list, remove, update } from '../controllers/equipmentType.controller.js';
import { authenticateToken } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/authorize.js';

export const equipmentTypeRouter = Router();
equipmentTypeRouter.use(authenticateToken);
equipmentTypeRouter.get('/', list);
equipmentTypeRouter.get('/:id', getById);
equipmentTypeRouter.post('/', requireRole(UserRole.ADMIN), create);
equipmentTypeRouter.put('/:id', requireRole(UserRole.ADMIN), update);
equipmentTypeRouter.delete('/:id', requireRole(UserRole.ADMIN), remove);
