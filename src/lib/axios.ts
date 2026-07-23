import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { apiConfig } from '../config/api.config';
import { authConfig } from '../config/auth.config';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

export const httpClient: AxiosInstance = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

// Request Interceptor: Inject Auth Token
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(authConfig.tokenKey);
    if (token && config.headers) {
      config.headers[authConfig.tokenHeader] = `${authConfig.tokenPrefix}${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(normalizeError(error))
);

// Response Interceptor: Normalize Errors
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(normalizeError(error))
);

function normalizeError(error: AxiosError): ApiError {
  if (error.response) {
    const data = error.response.data as Record<string, unknown>;
    return {
      message: (data?.message as string) || error.message || 'An unexpected API error occurred.',
      code: (data?.code as string) || 'HTTP_ERROR',
      status: error.response.status,
      details: data,
    };
  } else if (error.request) {
    return {
      message: 'Network error. Server did not respond.',
      code: 'ERR_NETWORK',
    };
  }
  return {
    message: error.message || 'Unknown request exception.',
    code: 'UNKNOWN_ERROR',
  };
}

export const createCancelTokenSource = () => axios.CancelToken.source();

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await httpClient.request<T>(config);
  return response.data;
}