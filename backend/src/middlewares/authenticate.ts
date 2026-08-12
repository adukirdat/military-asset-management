import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt.js';

export function authenticateToken(request: Request, response: Response, next: NextFunction): void {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    response.status(401).json({ success: false, message: 'Authentication is required.' });
    return;
  }

  try {
    request.authUser = verifyToken(header.slice(7));
    next();
  } catch {
    response.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}
