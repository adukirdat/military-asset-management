import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const baseSelection = { id: true, name: true, location: true, createdAt: true, updatedAt: true } satisfies Prisma.BaseSelect;
export type SafeBase = Prisma.BaseGetPayload<{ select: typeof baseSelection }>;

export class BaseServiceError extends Error {
  constructor(public readonly code: 'NOT_FOUND' | 'DUPLICATE_NAME' | 'DELETE_BLOCKED', message: string) { super(message); }
}

async function ensureNameIsAvailable(name: string, excludeId?: string): Promise<void> {
  const matchingBase = await prisma.base.findFirst({
    where: { name: { equals: name, mode: 'insensitive' }, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    select: { id: true },
  });
  if (matchingBase) throw new BaseServiceError('DUPLICATE_NAME', 'A base with this name already exists.');
}

export async function createBase(input: { name: string; location: string }): Promise<SafeBase> {
  await ensureNameIsAvailable(input.name);
  return prisma.base.create({ data: input, select: baseSelection });
}

export async function listBases(baseId: string | null, isAdmin: boolean): Promise<SafeBase[]> {
  if (!isAdmin && !baseId) return [];
  return prisma.base.findMany({ where: isAdmin ? undefined : { id: baseId! }, select: baseSelection, orderBy: { name: 'asc' } });
}

export async function getBase(id: string): Promise<SafeBase> {
  const base = await prisma.base.findUnique({ where: { id }, select: baseSelection });
  if (!base) throw new BaseServiceError('NOT_FOUND', 'Base not found.');
  return base;
}

export async function updateBase(id: string, input: { name: string; location: string }): Promise<SafeBase> {
  await getBase(id);
  await ensureNameIsAvailable(input.name, id);
  return prisma.base.update({ where: { id }, data: input, select: baseSelection });
}

export async function deleteBase(id: string): Promise<void> {
  await getBase(id);
  const [users, assets, purchases, sourceTransfers, destinationTransfers, assignments, expenditures] = await Promise.all([
    prisma.user.count({ where: { baseId: id } }), prisma.asset.count({ where: { baseId: id } }), prisma.purchase.count({ where: { baseId: id } }),
    prisma.transfer.count({ where: { sourceBaseId: id } }), prisma.transfer.count({ where: { destinationBaseId: id } }),
    prisma.assignment.count({ where: { baseId: id } }), prisma.expenditure.count({ where: { baseId: id } }),
  ]);
  if ([users, assets, purchases, sourceTransfers, destinationTransfers, assignments, expenditures].some((count) => count > 0)) {
    throw new BaseServiceError('DELETE_BLOCKED', 'Base cannot be deleted because it has related records.');
  }
  await prisma.base.delete({ where: { id } });
}
