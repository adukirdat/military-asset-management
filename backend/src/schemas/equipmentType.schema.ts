import { EquipmentCategory } from '@prisma/client';
import { z } from 'zod';

const fields = { name: z.string().trim().min(1, 'Name is required.').max(120), category: z.nativeEnum(EquipmentCategory) };
export const createEquipmentTypeSchema = z.object(fields).strict();
export const updateEquipmentTypeSchema = z.object(fields).strict();
export const equipmentTypeIdSchema = z.string().trim().min(1).max(100);
