import { UserRole } from '@prisma/client';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { baseIdSchema, createBaseSchema, updateBaseSchema } from '../schemas/base.schema.js';
import { BaseServiceError, createBase, deleteBase, getBase, listBases, updateBase } from '../services/base.service.js';

function parseId(request: Request, response: Response): string | null {
  const result = baseIdSchema.safeParse(request.params.id);
  if (result.success) return result.data;
  response.status(400).json({ success: false, message: 'Invalid base ID.' });
  return null;
}

function sendError(response: Response, error: unknown): void {
  if (error instanceof BaseServiceError) {
    const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'DELETE_BLOCKED' || error.code === 'DUPLICATE_NAME' ? 409 : 500;
    response.status(status).json({ success: false, message: error.message });
    return;
  }
  response.status(500).json({ success: false, message: 'Unable to process base request.' });
}

function sendValidationError(response: Response, error: ZodError): void {
  response.status(400).json({ success: false, message: 'Invalid request data.', errors: error.flatten().fieldErrors });
}

export async function create(request: Request, response: Response): Promise<void> {
  const parsed = createBaseSchema.safeParse(request.body);
  if (!parsed.success) return sendValidationError(response, parsed.error);
  try { response.status(201).json({ success: true, message: 'Base created successfully', data: await createBase(parsed.data) }); } catch (error) { sendError(response, error); }
}

export async function list(request: Request, response: Response): Promise<void> {
  try {
    const user = request.authUser!;
    response.status(200).json({ success: true, data: await listBases(user.baseId, user.role === UserRole.ADMIN) });
  } catch (error) { sendError(response, error); }
}

export async function getById(request: Request, response: Response): Promise<void> {
  const id = parseId(request, response); if (!id) return;
  try { response.status(200).json({ success: true, data: await getBase(id) }); } catch (error) { sendError(response, error); }
}

export async function update(request: Request, response: Response): Promise<void> {
  const id = parseId(request, response); if (!id) return;
  const parsed = updateBaseSchema.safeParse(request.body); if (!parsed.success) return sendValidationError(response, parsed.error);
  try { response.status(200).json({ success: true, message: 'Base updated successfully', data: await updateBase(id, parsed.data) }); } catch (error) { sendError(response, error); }
}

export async function remove(request: Request, response: Response): Promise<void> {
  const id = parseId(request, response); if (!id) return;
  try { await deleteBase(id); response.status(204).send(); } catch (error) { sendError(response, error); }
}
