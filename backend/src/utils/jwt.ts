import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthenticatedUser } from '../types/auth.types.js';

function getJwtSecret(): string {
  if (!env.jwtSecret) {
    throw new Error('JWT_SECRET must be configured to use authentication.');
  }

  return env.jwtSecret;
}

export function signToken(payload: AuthenticatedUser): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] });
}

export function verifyToken(token: string): AuthenticatedUser {
  const payload = jwt.verify(token, getJwtSecret());

  if (typeof payload === 'string' || !isAuthenticatedUser(payload)) {
    throw new jwt.JsonWebTokenError('Invalid token payload.');
  }

  return payload;
}

function isAuthenticatedUser(payload: object): payload is AuthenticatedUser {
  const candidate = payload as Partial<AuthenticatedUser>;
  return typeof candidate.userId === 'string'
    && typeof candidate.role === 'string'
    && (typeof candidate.baseId === 'string' || candidate.baseId === null);
}
