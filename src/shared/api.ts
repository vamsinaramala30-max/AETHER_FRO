import axios from 'axios';
import { apiConfig } from '../config/api.config';
import { authConfig } from '../config/auth.config';

export const apiClient = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    let token =
      localStorage.getItem(authConfig.tokenKey) ||
      localStorage.getItem('aether-auth-token') ||
      localStorage.getItem('auth_token');

    if (!token) {
      try {
        const store = localStorage.getItem('aether-auth-storage');
        if (store) {
          const parsed = JSON.parse(store);
          if (parsed?.state?.token && typeof parsed.state.token === 'string') {
            token = parsed.state.token;
          }
        }
      } catch {
        // Ignore JSON parse errors for auth storage fallback
      }
    }

    if (typeof token === 'string' && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
    return config;
  },
  (error: unknown) => {
    const err = error instanceof Error ? error : new Error(String(error));
    return Promise.reject(err);
  },
);

import { getOrStartRefresh } from '../api/client';

// Response interceptor for error handling & transparent auto-refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const originalRequest = error.config as (typeof error.config & { _retry?: boolean });
      // Skip auto-refresh for auth endpoints or if already retried
      if (originalRequest && !originalRequest.url?.includes('/auth/') && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshResult = await getOrStartRefresh();
          if (refreshResult.accessToken) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${refreshResult.accessToken}`;
            return apiClient(originalRequest);
          }
        } catch {
          // Allow error to propagate if refresh fails
        }
      }
    }
    const err = error instanceof Error ? error : new Error(String(error));
    return Promise.reject(err);
  },
);

export const api = apiClient;

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
