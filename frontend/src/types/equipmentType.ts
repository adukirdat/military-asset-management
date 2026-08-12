export type EquipmentCategory = 'WEAPON' | 'VEHICLE' | 'AMMUNITION';
export type EquipmentType = { id: string; name: string; category: EquipmentCategory; createdAt: string; updatedAt: string };
export type CreateEquipmentTypeInput = Pick<EquipmentType, 'name' | 'category'>;
export type UpdateEquipmentTypeInput = CreateEquipmentTypeInput;

export const equipmentCategoryLabels: Record<EquipmentCategory, string> = { WEAPON: 'Weapon', VEHICLE: 'Vehicle', AMMUNITION: 'Ammunition' };
