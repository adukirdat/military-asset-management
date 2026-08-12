import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import { authenticateUser, AuthServiceError, getSafeUserById, registerUser } from '../services/auth.service.js';
import { signToken } from '../utils/jwt.js';

export async function register(request: Request, response: Response): Promise<void> {
  const parsed = registerSchema.safeParse(request.body);
  if (!parsed.success) return sendValidationError(response, parsed.error);

  try {
    const user = await registerUser(parsed.data);
    response.status(201).json({ success: true, message: 'User registered successfully', data: user });
  } catch (error) {
    if (error instanceof AuthServiceError) {
      response.status(error.code === 'USERNAME_TAKEN' ? 409 : 400).json({ success: false, message: error.message });
      return;
    }
    response.status(500).json({ success: false, message: 'Unable to register user.' });
  }
}

export async function login(request: Request, response: Response): Promise<void> {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) return sendValidationError(response, parsed.error);

  try {
    const user = await authenticateUser(parsed.data.username, parsed.data.password);
    if (!user) {
      response.status(401).json({ success: false, message: 'Invalid username or password.' });
      return;
    }
    const token = signToken({ userId: user.id, role: user.role, baseId: user.baseId });
    response.status(200).json({ success: true, message: 'Login successful', data: { user, token } });
  } catch {
    response.status(500).json({ success: false, message: 'Unable to log in.' });
  }
}

export async function me(request: Request, response: Response): Promise<void> {
  const user = await getSafeUserById(request.authUser!.userId);
  if (!user) {
    response.status(401).json({ success: false, message: 'Authentication is invalid.' });
    return;
  }
  response.status(200).json({ success: true, data: user });
}

function sendValidationError(response: Response, error: ZodError): void {
  response.status(400).json({ success: false, message: 'Invalid request data.', errors: error.flatten().fieldErrors });
}
