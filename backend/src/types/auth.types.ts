import type { UserRole } from '@prisma/client';

export type AuthenticatedUser = {
  userId: string;
  role: UserRole;
  baseId: string | null;
};
