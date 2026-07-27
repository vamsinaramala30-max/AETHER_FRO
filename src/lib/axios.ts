import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { apiConfig } from '../config/api.config';
import { authConfig } from '../config/auth.config';

export interface ApiError extends Error {
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
    if (typeof token === 'string' && token.trim() !== '') {
      config.headers[authConfig.tokenHeader] = `${authConfig.tokenPrefix}${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(normalizeError(error)),
);

// Response Interceptor: Normalize Errors
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(normalizeError(error)),
);

function normalizeError(error: AxiosError): ApiError {
  if (axios.isAxiosError(error) && error.response !== undefined) {
    const data = error.response.data as Record<string, unknown> | undefined;
    const msg =
      data !== undefined && typeof data.message === 'string'
        ? data.message
        : error.message.trim() !== ''
          ? error.message
          : 'An unexpected API error occurred.';
    const code = data !== undefined && typeof data.code === 'string' ? data.code : 'HTTP_ERROR';
    const errObj = new Error(msg) as ApiError;
    errObj.code = code;
    errObj.status = error.response.status;
    errObj.details = data;
    return errObj;
  } else if (axios.isAxiosError(error) && error.request !== undefined) {
    const errObj = new Error('Network error. Server did not respond.') as ApiError;
    errObj.code = 'ERR_NETWORK';
    return errObj;
  }
  const msg =
    typeof error.message === 'string' && error.message.trim() !== ''
      ? error.message
      : 'Unknown request exception.';
  const errObj = new Error(msg) as ApiError;
  errObj.code = 'UNKNOWN_ERROR';
  return errObj;
}

export const createCancelTokenSource = () => axios.CancelToken.source();

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await httpClient.request<T>(config);
  return response.data;
}
