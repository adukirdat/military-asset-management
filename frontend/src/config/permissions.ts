import type { UserRole } from '../types/auth';

export const Permission = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN', BASE_MANAGEMENT: 'BASE_MANAGEMENT', USER_MANAGEMENT: 'USER_MANAGEMENT',
  EQUIPMENT_MANAGEMENT: 'EQUIPMENT_MANAGEMENT', ASSET_MANAGEMENT: 'ASSET_MANAGEMENT', PURCHASE_MANAGEMENT: 'PURCHASE_MANAGEMENT',
  TRANSFER_MANAGEMENT: 'TRANSFER_MANAGEMENT', ASSIGNMENT_MANAGEMENT: 'ASSIGNMENT_MANAGEMENT', EXPENDITURE_MANAGEMENT: 'EXPENDITURE_MANAGEMENT',
  INVENTORY_VIEW: 'INVENTORY_VIEW', INVENTORY_MANAGE: 'INVENTORY_MANAGE', REPORT_VIEW: 'REPORT_VIEW',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

const operationalPermissions: Permission[] = [
  Permission.EQUIPMENT_MANAGEMENT, Permission.ASSET_MANAGEMENT, Permission.PURCHASE_MANAGEMENT,
  Permission.TRANSFER_MANAGEMENT, Permission.ASSIGNMENT_MANAGEMENT, Permission.EXPENDITURE_MANAGEMENT,
  Permission.INVENTORY_VIEW, Permission.INVENTORY_MANAGE, Permission.REPORT_VIEW,
];

export const rolePermissions: Record<UserRole, readonly Permission[]> = {
  ADMIN: Object.values(Permission),
  BASE_COMMANDER: [Permission.BASE_MANAGEMENT, ...operationalPermissions],
  LOGISTICS_OFFICER: operationalPermissions,
};

export const hasRole = (role: UserRole | undefined, ...roles: UserRole[]): boolean => role !== undefined && roles.includes(role);
export const hasPermission = (role: UserRole | undefined, permission: Permission): boolean => role !== undefined && rolePermissions[role].includes(permission);
export const hasAnyPermission = (role: UserRole | undefined, permissions: Permission[]): boolean => permissions.some((permission) => hasPermission(role, permission));
export const hasAllPermissions = (role: UserRole | undefined, permissions: Permission[]): boolean => permissions.every((permission) => hasPermission(role, permission));
