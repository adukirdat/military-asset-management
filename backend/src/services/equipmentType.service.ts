import { Prisma, type EquipmentCategory } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const selection = { id: true, name: true, category: true, createdAt: true, updatedAt: true } satisfies Prisma.EquipmentTypeSelect;
export type SafeEquipmentType = Prisma.EquipmentTypeGetPayload<{ select: typeof selection }>;

export class EquipmentTypeServiceError extends Error {
  constructor(public readonly code: 'NOT_FOUND' | 'DUPLICATE' | 'DELETE_BLOCKED', message: string) { super(message); }
}

function mapPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new EquipmentTypeServiceError('DUPLICATE', 'An equipment type with this name and category already exists.');
  throw error;
}

export async function createEquipmentType(input: { name: string; category: EquipmentCategory }): Promise<SafeEquipmentType> {
  try { return await prisma.equipmentType.create({ data: input, select: selection }); } catch (error) { mapPrismaError(error); }
}

export async function listEquipmentTypes(): Promise<SafeEquipmentType[]> { return prisma.equipmentType.findMany({ select: selection, orderBy: [{ category: 'asc' }, { name: 'asc' }] }); }

export async function getEquipmentType(id: string): Promise<SafeEquipmentType> {
  const item = await prisma.equipmentType.findUnique({ where: { id }, select: selection });
  if (!item) throw new EquipmentTypeServiceError('NOT_FOUND', 'Equipment type not found.');
  return item;
}

export async function updateEquipmentType(id: string, input: { name: string; category: EquipmentCategory }): Promise<SafeEquipmentType> {
  await getEquipmentType(id);
  try { return await prisma.equipmentType.update({ where: { id }, data: input, select: selection }); } catch (error) { mapPrismaError(error); }
}

export async function deleteEquipmentType(id: string): Promise<void> {
  await getEquipmentType(id);
  const [assets, purchases, transfers, assignments, expenditures] = await Promise.all([
    prisma.asset.count({ where: { equipmentTypeId: id } }), prisma.purchase.count({ where: { equipmentTypeId: id } }), prisma.transfer.count({ where: { equipmentTypeId: id } }), prisma.assignment.count({ where: { equipmentTypeId: id } }), prisma.expenditure.count({ where: { equipmentTypeId: id } }),
  ]);
  if ([assets, purchases, transfers, assignments, expenditures].some((count) => count > 0)) throw new EquipmentTypeServiceError('DELETE_BLOCKED', 'Equipment type cannot be deleted because it has related records.');
  await prisma.equipmentType.delete({ where: { id } });
}
