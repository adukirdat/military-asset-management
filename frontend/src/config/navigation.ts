import { Building2, ShieldCheck, Warehouse } from 'lucide-react';
import type { ComponentType } from 'react';
import type { Permission } from './permissions';

export type NavigationItem = { label: string; path: string; icon: ComponentType<{ size?: number }>; permission: Permission };

export const navigationItems: NavigationItem[] = [
  { label: 'Bases', path: '/app/bases', icon: Building2, permission: 'INVENTORY_VIEW' },
  { label: 'Inventory access', path: '/app/inventory-test', icon: Warehouse, permission: 'INVENTORY_VIEW' },
  { label: 'System administration', path: '/app/admin-test', icon: ShieldCheck, permission: 'SYSTEM_ADMIN' },
];
