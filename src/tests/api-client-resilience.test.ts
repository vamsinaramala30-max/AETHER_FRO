import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, ApiError } from '../api/client';
import { authConfig } from '../config/auth.config';

describe('Frontend API Client Resilience & Error Invariants', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    localStorage.clear();
  });

  it('normalizes structured error objects so ApiError.message is a readable string, NEVER [object Object]', async () => {
    const structuredBackendError = {
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Refresh token is expired or invalid',
        details: { hint: 'Re-authenticate with credentials' },
      },
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => structuredBackendError,
    } as unknown as Response);

    try {
      await apiClient.get('/test-endpoint', { skipAuth: true });
      expect.fail('Expected request to throw ApiError');
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(ApiError);
      const apiErr = err as ApiError;
      expect(apiErr.message).toBe('Refresh token is expired or invalid');
      expect(apiErr.message).not.toBe('[object Object]');
      expect(apiErr.code).toBe('AUTHENTICATION_ERROR');
      expect(apiErr.status).toBe(400);
    }
  });

  it('coalesces multiple concurrent 401 requests into a single flight refresh call', async () => {
    localStorage.setItem(authConfig.tokenKey, 'expired_access_token');
    localStorage.setItem(authConfig.refreshTokenKey, 'valid_refresh_token');

    let refreshCalls = 0;
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      const urlStr = String(url);
      if (urlStr.includes('/auth/refresh')) {
        refreshCalls++;
        // Small delay to simulate network latency
        await new Promise((r) => setTimeout(r, 20));
        return {
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            success: true,
            data: {
              tokens: {
                accessToken: 'fresh_new_access_token',
                refreshToken: 'fresh_new_refresh_token',
              },
            },
          }),
        } as unknown as Response;
      }

      // First call fails with 401, subsequent with fresh token succeeds
      if (fetchMock.mock.calls.length <= 4) {
        return {
          ok: false,
          status: 401,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ error: { code: 'UNAUTHORIZED', message: 'Token expired' } }),
        } as unknown as Response;
      }

      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: { item: 'value' } }),
      } as unknown as Response;
    });

    globalThis.fetch = fetchMock;

    // Launch 3 simultaneous requests
    const promises = [
      apiClient.get('/resource-a'),
      apiClient.get('/resource-b'),
      apiClient.get('/resource-c'),
    ];

    await Promise.all(promises);

    // Refresh should only be called once, not 3 times!
    expect(refreshCalls).toBe(1);
    expect(localStorage.getItem(authConfig.tokenKey)).toBe('fresh_new_access_token');
    expect(localStorage.getItem(authConfig.refreshTokenKey)).toBe('fresh_new_refresh_token');
  });

  it('dispatches aether-auth-expired and wipes tokens when refresh token is rejected with 401', async () => {
    localStorage.setItem(authConfig.tokenKey, 'expired_access_token');
    localStorage.setItem(authConfig.refreshTokenKey, 'invalid_refresh_token');

    const authExpiredListener = vi.fn();
    window.addEventListener('aether-auth-expired', authExpiredListener);

    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
      const urlStr = String(url);
      if (urlStr.includes('/auth/refresh')) {
        return {
          ok: false,
          status: 401,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            success: false,
            error: { code: 'INVALID_REFRESH_TOKEN', message: 'Refresh token invalid' },
          }),
        } as unknown as Response;
      }

      return {
        ok: false,
        status: 401,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ error: { code: 'UNAUTHORIZED', message: 'Token expired' } }),
      } as unknown as Response;
    });

    try {
      await apiClient.get('/protected-resource');
    } catch {
      // Expected rejection
    }

    expect(authExpiredListener).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(authConfig.tokenKey)).toBeNull();
    expect(localStorage.getItem(authConfig.refreshTokenKey)).toBeNull();

    window.removeEventListener('aether-auth-expired', authExpiredListener);
  });
});
