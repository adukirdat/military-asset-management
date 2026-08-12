import { api } from '../services/api';
import type { Base, CreateBaseInput, UpdateBaseInput } from '../types/base';

export async function getBases(): Promise<Base[]> { return (await api.get<{ success: true; data: Base[] }>('/bases')).data.data; }
export async function getBase(id: string): Promise<Base> { return (await api.get<{ success: true; data: Base }>(`/bases/${id}`)).data.data; }
export async function createBase(input: CreateBaseInput): Promise<Base> { return (await api.post<{ success: true; data: Base }>('/bases', input)).data.data; }
export async function updateBase(id: string, input: UpdateBaseInput): Promise<Base> { return (await api.put<{ success: true; data: Base }>(`/bases/${id}`, input)).data.data; }
export async function deleteBase(id: string): Promise<void> { await api.delete(`/bases/${id}`); }
