import { AssetStatus } from '@prisma/client';
import { z } from 'zod';
const id = z.string().trim().min(1).max(100);
const fields = { assetTag: z.string().trim().min(1).max(120), equipmentTypeId: id, baseId: id, status: z.nativeEnum(AssetStatus) };
export const createAssetSchema = z.object(fields).strict();
export const updateAssetSchema = z.object(fields).strict();
export const assetIdSchema = id;
export const assetQuerySchema = z.object({ baseId: id.optional(), equipmentTypeId: id.optional(), status: z.nativeEnum(AssetStatus).optional(), search: z.string().trim().max(120).optional() }).strict();
