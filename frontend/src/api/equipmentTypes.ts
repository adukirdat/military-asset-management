import { api } from '../services/api';
import type { CreateEquipmentTypeInput, EquipmentType, UpdateEquipmentTypeInput } from '../types/equipmentType';

export async function getEquipmentTypes(): Promise<EquipmentType[]> { return (await api.get<{ success: true; data: EquipmentType[] }>('/equipment-types')).data.data; }
export async function getEquipmentType(id: string): Promise<EquipmentType> { return (await api.get<{ success: true; data: EquipmentType }>(`/equipment-types/${id}`)).data.data; }
export async function createEquipmentType(input: CreateEquipmentTypeInput): Promise<EquipmentType> { return (await api.post<{ success: true; data: EquipmentType }>('/equipment-types', input)).data.data; }
export async function updateEquipmentType(id: string, input: UpdateEquipmentTypeInput): Promise<EquipmentType> { return (await api.put<{ success: true; data: EquipmentType }>(`/equipment-types/${id}`, input)).data.data; }
export async function deleteEquipmentType(id: string): Promise<void> { await api.delete(`/equipment-types/${id}`); }
