import { UserRole } from '@prisma/client';
import { z } from 'zod';

const username = z.string().trim().min(3).max(50).regex(/^[a-zA-Z0-9_.-]+$/, 'Username may contain letters, numbers, dots, underscores, and hyphens only.');
const password = z.string().min(8).max(128).regex(/[a-z]/, 'Password must include a lowercase letter.').regex(/[A-Z]/, 'Password must include an uppercase letter.').regex(/\d/, 'Password must include a number.').regex(/[^A-Za-z0-9]/, 'Password must include a special character.');

export const registerSchema = z.object({
  username,
  password,
  role: z.nativeEnum(UserRole),
  baseId: z.string().trim().min(1).max(100).nullable(),
});

export const loginSchema = z.object({ username, password: z.string().min(1).max(128) });
