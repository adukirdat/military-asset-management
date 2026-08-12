import { api } from '../services/api';
import type { AuthUser, LoginResponse } from '../types/auth';

export async function loginRequest(username: string, password: string): Promise<LoginResponse['data']> {
  const response = await api.post<LoginResponse>('/auth/login', { username, password });
  return response.data.data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await api.get<{ success: true; data: AuthUser }>('/auth/me');
  return response.data.data;
}
