import { env } from './environment';

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  version: string;
  retryAttempts: number;
  retryDelayMs: number;
  headers: Record<string, string>;
}

export const apiConfig: ApiConfig = {
  baseUrl: env.VITE_API_BASE_URL,
  timeout: env.VITE_API_TIMEOUT,
  version: 'v1',
  retryAttempts: 3,
  retryDelayMs: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;
