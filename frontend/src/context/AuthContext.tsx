import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isAxiosError } from 'axios';
import { getCurrentUser, loginRequest } from '../api/auth';
import type { AuthUser } from '../types/auth';
import { getToken, removeToken, setToken } from '../utils/token';
import { AUTH_INVALID_EVENT } from '../services/api';
import { hasPermission as roleHasPermission, hasRole as roleHasRole, type Permission } from '../config/permissions';
import type { UserRole } from '../types/auth';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  const refreshAuth = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      setUser(await getCurrentUser());
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void refreshAuth(); }, [refreshAuth]);
  useEffect(() => {
    const handleInvalidAuth = () => logout();
    window.addEventListener(AUTH_INVALID_EVENT, handleInvalidAuth);
    return () => window.removeEventListener(AUTH_INVALID_EVENT, handleInvalidAuth);
  }, [logout]);

  const login = useCallback(async (username: string, password: string) => {
    const { token, user: authenticatedUser } = await loginRequest(username, password);
    setToken(token);
    setUser(authenticatedUser);
  }, []);

  const hasRole = useCallback((...roles: UserRole[]) => roleHasRole(user?.role, ...roles), [user?.role]);
  const hasPermission = useCallback((permission: Permission) => roleHasPermission(user?.role, permission), [user?.role]);
  const value = useMemo(() => ({ user, isAuthenticated: user !== null, isLoading, login, logout, refreshAuth, hasRole, hasPermission }), [hasPermission, hasRole, isLoading, login, logout, refreshAuth, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
}
