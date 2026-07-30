/**
 * Shared API client configuration and base types.
 * This file provides common API infrastructure used across the application.
 */
import axios from 'axios';
import { apiConfig } from '../config/api.config';

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
    const token =
      localStorage.getItem('aether_access_token') ||
      localStorage.getItem('aether-auth-token') ||
      localStorage.getItem('auth_token');
    if (typeof token === 'string' && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    const err = error instanceof Error ? error : new Error(String(error));
    return Promise.reject(err);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('aether-auth-token');
      window.location.href = '/login';
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
