import 'dotenv/config';

const portValue = Number.parseInt(process.env.PORT ?? '5000', 10);
const jwtSecret = process.env.JWT_SECRET;

if (process.env.NODE_ENV === 'production' && !jwtSecret) {
  throw new Error('JWT_SECRET must be configured in production.');
}

export const env = {
  port: Number.isNaN(portValue) ? 5000 : portValue,
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
};
