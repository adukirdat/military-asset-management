import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isAxiosError } from 'axios';
import { getCurrentUser, loginRequest } from '../api/auth';
import type { AuthUser } from '../types/auth';
import { getToken, removeToken, setToken } from '../utils/token';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
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

  const login = useCallback(async (username: string, password: string) => {
    const { token, user: authenticatedUser } = await loginRequest(username, password);
    setToken(token);
    setUser(authenticatedUser);
  }, []);

  const value = useMemo(() => ({ user, isAuthenticated: user !== null, isLoading, login, logout, refreshAuth }), [isLoading, login, logout, refreshAuth, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
}
