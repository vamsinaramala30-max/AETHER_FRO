import { authConfig } from '../config/auth.config';

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  skipAuth?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface ApiErrorPayload {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: Record<string, unknown>;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.status = payload.status || 500;
    this.code = payload.code;
    this.details = payload.details;
  }
}

type RequestInterceptor = (config: RequestConfig) => Promise<RequestConfig> | RequestConfig;
type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

class HttpClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';
    this.defaultTimeout = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

    // --- Global Auth Token Interceptor Wiring ---
    this.addRequestInterceptor(async (config) => {
      if (config.skipAuth) {
        return config;
      }

      try {
        const token = localStorage.getItem(authConfig.tokenKey);
        if (token) {
          config.headers = {
            ...config.headers,
            [authConfig.tokenHeader]: `${authConfig.tokenPrefix}${token}`,
          };
        }
      } catch {
        // Storage may be unavailable in restrictive environments; continue without auth headers.
      }

      return config;
    });
  }

  public addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  public addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const cleanBaseUrl = this.baseUrl.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const fullPath = endpoint.startsWith('http') ? endpoint : `${cleanBaseUrl}${cleanEndpoint}`;
    const url = new URL(fullPath, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  public async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    let currentConfig: RequestConfig = {
      timeout: this.defaultTimeout,
      retries: 0,
      retryDelay: 1000,
      ...config,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config.headers,
      },
    };

    if (currentConfig.body instanceof FormData) {
      const headers = { ...(currentConfig.headers as Record<string, string>) };
      delete headers['Content-Type'];
      currentConfig.headers = headers;
    }

    for (const interceptor of this.requestInterceptors) {
      currentConfig = await interceptor(currentConfig);
    }

    const {
      timeout,
      retries = 0,
      retryDelay = 1000,
      params,
      skipAuth: _skipAuth,
      ...fetchOptions
    } = currentConfig;
    const url = this.buildUrl(endpoint, params);

    let attempt = 0;
    while (attempt <= retries) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);

      try {
        let response = await fetch(url, {
          ...fetchOptions,
          signal: fetchOptions.signal || controller.signal,
        });

        clearTimeout(timeoutId);

        for (const interceptor of this.responseInterceptors) {
          response = await interceptor(response);
        }

        if (!response.ok) {
          let errorData: ApiErrorPayload = {
            message: `HTTP Error ${response.status}: ${response.statusText}`,
            status: response.status,
          };
          try {
            const body = await response.json();
            errorData = {
              message: body.message || errorData.message,
              code: body.code,
              status: response.status,
              details: body.details,
            };
          } catch {
            // Non-JSON response body
          }
          throw new ApiError(errorData);
        }

        if (response.status === 204) {
          return {} as T;
        }

        return (await response.json()) as T;
      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          throw error;
        }

        if (attempt < retries) {
          attempt++;
          await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
          continue;
        }

        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new ApiError({ message: 'Request timed out', code: 'TIMEOUT', status: 408 });
        }

        throw new ApiError({
          message: error instanceof Error ? error.message : 'Network request failed',
          code: 'NETWORK_ERROR',
          status: 0,
        });
      }
    }

    throw new ApiError({ message: 'Unknown request failure', status: 500 });
  }

  public async *stream(
    endpoint: string,
    config: RequestConfig = {},
  ): AsyncGenerator<string, void, unknown> {
    let currentConfig: RequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...config.headers,
      },
    };

    for (const interceptor of this.requestInterceptors) {
      currentConfig = await interceptor(currentConfig);
    }

    const { params, skipAuth: _skipAuth, ...fetchOptions } = currentConfig;
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new ApiError({
        message: `Streaming failed with status ${response.status}`,
        status: response.status,
      });
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new ApiError({ message: 'Response body is not readable', status: 500 });
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            yield trimmed.replace(/^data:\s*/, '');
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  public get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  public post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  public put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  public patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  public delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new HttpClient();



