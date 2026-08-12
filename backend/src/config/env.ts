import 'dotenv/config';

const portValue = Number.parseInt(process.env.PORT ?? '5000', 10);
export const env = { port: Number.isNaN(portValue) ? 5000 : portValue, frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173' };
