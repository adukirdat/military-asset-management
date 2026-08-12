import bcrypt from 'bcryptjs';
import { Prisma, type UserRole } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const safeUserSelection = { id: true, username: true, role: true, baseId: true } satisfies Prisma.UserSelect;
export type SafeUser = Prisma.UserGetPayload<{ select: typeof safeUserSelection }>;

export async function registerUser(input: { username: string; password: string; role: UserRole; baseId: string | null }): Promise<SafeUser> {
  if (input.baseId) {
    const base = await prisma.base.findUnique({ where: { id: input.baseId }, select: { id: true } });
    if (!base) throw new AuthServiceError('BASE_NOT_FOUND', 'The provided base does not exist.');
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  try {
    return await prisma.user.create({
      data: { username: input.username, passwordHash, role: input.role, baseId: input.baseId },
      select: safeUserSelection,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AuthServiceError('USERNAME_TAKEN', 'Username is already in use.');
    }
    throw error;
  }
}

export async function authenticateUser(username: string, password: string): Promise<SafeUser | null> {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null;
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function getSafeUserById(id: string): Promise<SafeUser | null> {
  return prisma.user.findUnique({ where: { id }, select: safeUserSelection });
}

export class AuthServiceError extends Error {
  constructor(public readonly code: 'USERNAME_TAKEN' | 'BASE_NOT_FOUND', message: string) { super(message); }
}
