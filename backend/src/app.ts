import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.routes.js';
import { baseRouter } from './routes/base.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { rbacRouter } from './routes/rbac.routes.js';

export const app = express();
app.use(helmet());
app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/bases', baseRouter);
app.use('/api/health', healthRouter);
app.use('/api/rbac', rbacRouter);
