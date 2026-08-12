import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.routes.js';
import { healthRouter } from './routes/health.routes.js';

export const app = express();
app.use(helmet());
app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/health', healthRouter);
