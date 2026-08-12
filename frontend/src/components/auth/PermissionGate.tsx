import type { ReactNode } from 'react';
import type { Permission } from '../../config/permissions';
import { useAuth } from '../../context/AuthContext';

export function PermissionGate({ permission, children, fallback = null }: { permission: Permission; children: ReactNode; fallback?: ReactNode }) {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
}
