import { z } from 'zod';

const baseFields = {
  name: z.string().trim().min(1, 'Name is required.').max(120),
  location: z.string().trim().min(1, 'Location is required.').max(160),
};

export const createBaseSchema = z.object(baseFields).strict();
export const updateBaseSchema = z.object(baseFields).strict();
export const baseIdSchema = z.string().trim().min(1).max(100);
