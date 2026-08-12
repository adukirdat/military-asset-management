import { Navigate, Outlet } from 'react-router-dom';
import type { Permission } from '../config/permissions';
import { useAuth } from '../context/AuthContext';

export function RequirePermission({ permission }: { permission: Permission }) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  if (isLoading) return <main className="grid min-h-screen place-items-center text-sm text-slate-300">Checking authorization…</main>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasPermission(permission)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
