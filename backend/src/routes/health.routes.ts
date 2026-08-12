import { Router } from 'express';
import { prisma } from '../config/prisma.js';

export const healthRouter = Router();
healthRouter.get('/', async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    response.status(200).json({
      success: true,
      message: 'Military Asset Management API is running',
      database: 'connected',
    });
  } catch {
    response.status(503).json({
      success: false,
      message: 'Military Asset Management API is running, but the database is unavailable',
      database: 'disconnected',
    });
  }
});
