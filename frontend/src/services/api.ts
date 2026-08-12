import axios from 'axios';
import { getToken } from '../utils/token';

export const AUTH_INVALID_EVENT = 'auth:invalid';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && !error.config?.url?.startsWith('/auth/login')) {
      window.dispatchEvent(new Event(AUTH_INVALID_EVENT));
    }
    return Promise.reject(error);
  },
);

api.interceptors.request.use((config) => {
  const token = getToken();
  const isAuthEndpoint = config.url?.startsWith('/auth/login') || config.url?.startsWith('/auth/register');

  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
