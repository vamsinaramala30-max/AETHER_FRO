import { authConfig } from '../config/auth.config';

// ---- Token refresh state (module-level singleton) ----
let _refreshPromise: Promise<{ accessToken: string | null; isAuthError: boolean }> | null = null;

async function _performTokenRefresh(): Promise<{
  accessToken: string | null;
  isAuthError: boolean;
}> {
  console.warn('[AUTH_DIAG] TOKEN_REFRESH_STARTED');
  try {
    const refreshToken = localStorage.getItem(authConfig.refreshTokenKey);
    if (!refreshToken) {
      console.warn('[AUTH_DIAG] TOKEN_REFRESH_FAILED - No refresh token in storage');
      return { accessToken: null, isAuthError: true };
    }

    const rawBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
    const refreshUrl = rawBase.replace(/\/+$/, '') + '/auth/refresh';

    const res = await fetch(refreshUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (res.status === 401 || res.status === 403) {
      console.error(
        `[AUTH_DIAG] TOKEN_REFRESH_FAILED - Refresh token invalid/revoked (HTTP ${res.status})`,
      );
      return { accessToken: null, isAuthError: true };
    }

    if (!res.ok) {
      console.warn(
        `[AUTH_DIAG] API_5XX - Refresh endpoint returned temporary error (HTTP ${res.status})`,
      );
      return { accessToken: null, isAuthError: false };
    }

    const body = await res.json();
    const tokens = body?.data?.tokens ?? body?.tokens ?? body?.data;
    const accessToken: string | undefined = tokens?.accessToken ?? body?.accessToken;

    if (typeof accessToken !== 'string' || !accessToken) {
      console.error(
        '[AUTH_DIAG] TOKEN_REFRESH_FAILED - Invalid payload structure from refresh response',
      );
      return { accessToken: null, isAuthError: true };
    }

    console.warn('[AUTH_DIAG] TOKEN_REFRESH_SUCCESS');
    localStorage.setItem(authConfig.tokenKey, accessToken);
    if (tokens?.refreshToken) {
      localStorage.setItem(authConfig.refreshTokenKey, tokens.refreshToken);
    }
    return { accessToken, isAuthError: false };
  } catch (err) {
    console.warn(
      '[AUTH_DIAG] NETWORK_ERROR - Refresh token request network failure:',
      err instanceof Error ? err.message : err,
    );
    return { accessToken: null, isAuthError: false };
  }
}

/** Returns an in-flight refresh promise or starts a new one (singleton pattern). */
function getOrStartRefresh(): Promise<{ accessToken: string | null; isAuthError: boolean }> {
  if (!_refreshPromise) {
    _refreshPromise = _performTokenRefresh().finally(() => {
      _refreshPromise = null;
    });
  }
  return _refreshPromise;
}

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
  endpoint?: string;
  method?: string;
  requestId?: string;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly endpoint?: string;
  public readonly method?: string;
  public readonly requestId?: string;
  public readonly details?: Record<string, unknown>;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.status = payload.status || 500;
    this.code = payload.code;
    this.endpoint = payload.endpoint;
    this.method = payload.method;
    this.requestId = payload.requestId;
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
        let token =
          localStorage.getItem(authConfig.tokenKey) ||
          localStorage.getItem('aether-auth-token') ||
          localStorage.getItem('auth_token');

        if (!token) {
          const zustandStore = localStorage.getItem('aether-auth-storage');
          if (zustandStore) {
            const parsed = JSON.parse(zustandStore);
            if (parsed?.state?.token && typeof parsed.state.token === 'string') {
              token = parsed.state.token;
            }
          }
        }

        if (token && typeof token === 'string' && token.trim() !== '') {
          config.headers = {
            ...config.headers,
            [authConfig.tokenHeader]: `${authConfig.tokenPrefix}${token.trim()}`,
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

    let fullUrlString: string;
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      fullUrlString = endpoint;
    } else if (cleanBaseUrl.startsWith('http://') || cleanBaseUrl.startsWith('https://')) {
      fullUrlString = `${cleanBaseUrl}${cleanEndpoint}`;
    } else {
      fullUrlString = `${cleanBaseUrl}${cleanEndpoint}`;
    }

    // Resolve URL host
    let url: URL;
    try {
      url = new URL(fullUrlString);
    } catch {
      url = new URL(fullUrlString, window.location.origin);
    }

    // If running in browser and pointing to localhost, but accessing via IP/hostname (e.g. mobile testing), resolve host dynamically
    if (
      typeof window !== 'undefined' &&
      window.location &&
      window.location.hostname &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1' &&
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
    ) {
      url.hostname = window.location.hostname;
    }

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
    return this._requestWithAutoRefresh<T>(endpoint, config, false);
  }

  private async _requestWithAutoRefresh<T>(
    endpoint: string,
    config: RequestConfig,
    isRetryAfterRefresh: boolean,
  ): Promise<T> {
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

        // ---- 401 Auto-Refresh Logic ----
        if (response.status === 401 && !isRetryAfterRefresh && !config.skipAuth) {
          console.warn(
            `[AUTH_DIAG] API_401 encountered on endpoint: ${endpoint}. Attempting automatic session refresh...`,
          );
          const refreshResult = await getOrStartRefresh();
          if (refreshResult.accessToken) {
            // Retry the original request exactly once with the fresh token
            return this._requestWithAutoRefresh<T>(endpoint, config, true);
          } else if (refreshResult.isAuthError) {
            // Genuine authentication failure: refresh token is invalid or revoked
            console.error(
              '[AUTH_DIAG] SESSION_INVALID - Genuine auth failure. Triggering session expiration...',
            );
            localStorage.removeItem(authConfig.tokenKey);
            localStorage.removeItem(authConfig.refreshTokenKey);
            localStorage.removeItem('aether_auth_user');
            window.dispatchEvent(new CustomEvent('aether-auth-expired'));
          } else {
            console.warn(
              '[AUTH_DIAG] NETWORK_ERROR/API_5XX during refresh - Preserving authenticated state.',
            );
          }
        }

        const correlationId =
          response.headers.get('x-request-id') ||
          response.headers.get('x-correlation-id') ||
          undefined;

        if (!response.ok) {
          let errorData: ApiErrorPayload = {
            message: `HTTP Error ${response.status}: ${response.statusText}`,
            status: response.status,
            endpoint,
            method: fetchOptions.method || 'GET',
            requestId: correlationId,
          };
          try {
            const body = await response.json();
            errorData = {
              message: body.message || body.error || errorData.message,
              code: body.code,
              status: response.status,
              endpoint,
              method: fetchOptions.method || 'GET',
              requestId: correlationId,
              details: body.details,
            };
          } catch {
            // Non-JSON response body (e.g. HTML 404/500 page)
          }

          // Safe diagnostic logging (sanitized, no secrets)
          console.error(
            `[API Error] Endpoint: ${endpoint} | Method: ${fetchOptions.method || 'GET'} | Status: ${response.status} | Request ID: ${correlationId || 'N/A'} | Code: ${errorData.code || 'UNKNOWN'} | Message: ${errorData.message}`,
          );

          throw new ApiError(errorData);
        }

        if (response.status === 204) {
          return {} as T;
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          return (await response.json()) as T;
        }

        // Handle case where endpoint returns text/html or non-JSON when expected JSON
        const rawText = await response.text();
        try {
          return JSON.parse(rawText) as T;
        } catch {
          console.error(
            `[API Error] Endpoint: ${endpoint} returned non-JSON response format (${contentType || 'unknown'}).`,
          );
          throw new ApiError({
            message: `Endpoint ${endpoint} returned invalid non-JSON response payload`,
            code: 'INVALID_RESPONSE',
            status: response.status,
            endpoint,
            method: fetchOptions.method || 'GET',
            requestId: correlationId,
          });
        }
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
