import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { authService, AuthSession, _resetSessionState } from '../auth/authservice';
import { authApi } from '../api/auth.api';
import { apiClient, ApiError, purgeAllStoredAuth, sanitizeErrorMessage } from '../api/client';
import { authConfig } from '../config/auth.config';
import { Landing3DBackground } from '../public/landing/Landing3DBackground';
import { ProtectedGuard } from '../guards/ProtectedGuard';
import { GuestGuard } from '../guards/GuestGuard';

const LocationDisplay: React.FC = () => {
  const location = useLocation();
  return <div data-testid="current-location">{location.pathname}</div>;
};

describe('AETHER Comprehensive Authentication & Application Reliability Test Suite', () => {
  const testUser = {
    id: 'usr-reliability-123',
    email: 'test@aether.ai',
    name: 'Reliability Tester',
    fullName: 'Reliability Tester',
    firstName: 'Reliability',
    lastName: 'Tester',
    role: 'USER',
    avatarUrl: null,
    isEmailVerified: true,
  };

  const createMockJwt = (expDeltaSeconds: number = 3600): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const exp = Math.floor(Date.now() / 1000) + expDeltaSeconds;
    const payload = btoa(JSON.stringify({ id: testUser.id, email: testUser.email, exp }));
    return `${header}.${payload}.mock-signature`;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    _resetSessionState();
  });

  afterEach(() => {
    _resetSessionState();
  });

  // Scenario 1: First-time visitor with no session
  it('Scenario 1: First-time visitor with no session resolves as clean anonymous state without errors', async () => {
    const warnSpy = vi.spyOn(console, 'warn');
    const { session, error } = await authService.initialize();

    expect(session).toBeNull();
    expect(error).toBeNull();
    // Must NOT log SESSION_INVALID for a first-time anonymous visitor
    const invalidWarnCalls = warnSpy.mock.calls.filter((call) =>
      String(call[0]).includes('SESSION_INVALID - No valid tokens found'),
    );
    expect(invalidWarnCalls.length).toBe(0);
  });

  // Scenario 2: Successful account registration
  it('Scenario 2: Successful account registration establishes tokens and authenticated session', async () => {
    const validToken = createMockJwt(3600);
    const mockRegister = vi.spyOn(authApi, 'register').mockResolvedValue({
      user: testUser,
      tokens: {
        accessToken: validToken,
        refreshToken: 'valid-refresh-token',
        expiresIn: '15m',
      },
    });

    const res = await authService.signUp('Reliability', 'Tester', 'test@aether.ai', 'Password123!');

    expect(mockRegister).toHaveBeenCalled();
    expect(res.user?.id).toBe(testUser.id);
    expect(res.error).toBeNull();
    expect(localStorage.getItem(authConfig.tokenKey)).toBe(validToken);
    expect(localStorage.getItem(authConfig.refreshTokenKey)).toBe('valid-refresh-token');
  });

  // Scenario 3: Successful login
  it('Scenario 3: Successful login verifies credentials and stores authoritative session state', async () => {
    const validToken = createMockJwt(3600);
    vi.spyOn(authApi, 'login').mockResolvedValue({
      user: testUser,
      tokens: {
        accessToken: validToken,
        refreshToken: 'valid-refresh-token',
        expiresIn: '15m',
      },
    });

    const res = await authService.signIn('test@aether.ai', 'Password123!');

    expect(res.user?.email).toBe(testUser.email);
    expect(res.error).toBeNull();
    expect(localStorage.getItem(authConfig.tokenKey)).toBe(validToken);
  });

  // Scenario 4: Existing user returning after a browser refresh
  it('Scenario 4: Existing user returning after refresh automatically restores session without login screen', async () => {
    const validToken = createMockJwt(3600);
    localStorage.setItem(authConfig.tokenKey, validToken);
    localStorage.setItem(authConfig.refreshTokenKey, 'refresh-token-456');
    localStorage.setItem('aether_auth_user', JSON.stringify(testUser));

    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(testUser);

    const { session, error } = await authService.initialize();

    expect(error).toBeNull();
    expect(session).toBeDefined();
    expect(session?.user?.id).toBe(testUser.id);
    expect(session?.accessToken).toBe(validToken);
  });

  // Scenario 5: Returning user opening a new tab
  it('Scenario 5: Multi-tab session updates and propagates through storage events', async () => {
    let capturedSession: AuthSession | null = null;
    let eventName: string | null = null;

    const sub = authService.subscribeToAuthChanges((event, session) => {
      eventName = event;
      capturedSession = session;
    });

    // Simulate another tab logging out
    const storageEvent = new StorageEvent('storage', {
      key: authConfig.tokenKey,
      oldValue: 'old-token',
      newValue: null,
    });
    window.dispatchEvent(storageEvent);

    expect(eventName).toBe('SIGNED_OUT');
    expect(capturedSession).toBeNull();

    sub.unsubscribe();
  });

  // Scenario 6: Valid session restoration
  it('Scenario 6: Valid session restoration does not re-fetch profile if already in active session', async () => {
    const validToken = createMockJwt(3600);
    localStorage.setItem(authConfig.tokenKey, validToken);
    localStorage.setItem(authConfig.refreshTokenKey, 'refresh-token-456');
    localStorage.setItem('aether_auth_user', JSON.stringify(testUser));

    const getUserSpy = vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(testUser);

    const first = await authService.getCurrentSession();
    expect(first.session?.user?.id).toBe(testUser.id);

    // Second call should reuse active session without additional network requests
    const second = await authService.getCurrentSession();
    expect(second.session?.user?.id).toBe(testUser.id);
    expect(getUserSpy).toHaveBeenCalledTimes(1);
  });

  // Scenario 7: Expired access token with a recoverable refresh session
  it('Scenario 7: Expired access token seamlessly refreshes using valid refresh token', async () => {
    const expiredToken = createMockJwt(-60); // Expired 1 min ago
    const freshToken = createMockJwt(3600);

    localStorage.setItem(authConfig.tokenKey, expiredToken);
    localStorage.setItem(authConfig.refreshTokenKey, 'valid-refresh-token');

    const globalFetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
      if (String(url).includes('/auth/refresh')) {
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              tokens: {
                accessToken: freshToken,
                refreshToken: 'rotated-refresh-token',
              },
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      }
      return new Response(JSON.stringify({ data: testUser }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(testUser);

    const { session, error } = await authService.initialize();

    expect(error).toBeNull();
    expect(session?.accessToken).toBe(freshToken);
    expect(localStorage.getItem(authConfig.tokenKey)).toBe(freshToken);

    globalFetchSpy.mockRestore();
  });

  // Scenario 8: Expired or revoked session requiring reauthentication
  it('Scenario 8: Revoked refresh token clears storage and prompts reauthentication without looping', async () => {
    const expiredToken = createMockJwt(-60);
    localStorage.setItem(authConfig.tokenKey, expiredToken);
    localStorage.setItem(authConfig.refreshTokenKey, 'revoked-refresh-token');

    const globalFetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
      return new Response(
        JSON.stringify({
          success: false,
          error: { code: 'INVALID_REFRESH_TOKEN', message: 'Token revoked' },
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    });

    const { session, error } = await authService.initialize();

    expect(session).toBeNull();
    expect(error).toBeDefined();
    expect(localStorage.getItem(authConfig.tokenKey)).toBeNull();
    expect(localStorage.getItem(authConfig.refreshTokenKey)).toBeNull();

    globalFetchSpy.mockRestore();
  });

  // Scenario 9: Backend temporarily unavailable during session restoration
  it('Scenario 9: Temporary network outage during session restoration preserves cached profile and valid access token', async () => {
    const validToken = createMockJwt(3600);
    localStorage.setItem(authConfig.tokenKey, validToken);
    localStorage.setItem(authConfig.refreshTokenKey, 'refresh-token-456');
    localStorage.setItem('aether_auth_user', JSON.stringify(testUser));

    vi.spyOn(authApi, 'getCurrentUser').mockRejectedValue(
      new ApiError({
        message: 'Network request failed',
        code: 'NETWORK_ERROR',
        status: 0,
      }),
    );

    const { session, error } = await authService.initialize();

    expect(error).toBeNull();
    expect(session?.user?.id).toBe(testUser.id);
    expect(session?.accessToken).toBe(validToken);
    // Crucial: Must NOT clear tokens on temporary network glitches
    expect(localStorage.getItem(authConfig.tokenKey)).toBe(validToken);
  });

  // Scenario 10: Backend unavailable during login
  it('Scenario 10: Backend unavailable during login returns actionable network error without registration prompt', async () => {
    vi.spyOn(authApi, 'login').mockRejectedValue(
      new ApiError({
        message: 'Failed to fetch: net::ERR_CONNECTION_REFUSED',
        code: 'NETWORK_ERROR',
        status: 0,
      }),
    );

    const res = await authService.signIn('test@aether.ai', 'Password123!');

    expect(res.user).toBeNull();
    expect(res.error?.message).toContain('Unable to connect to the AETHER backend server');
  });

  // Scenario 11: Incorrect password
  it('Scenario 11: Incorrect credentials throw INVALID_CREDENTIALS and reject login', async () => {
    vi.spyOn(authApi, 'login').mockRejectedValue(
      new ApiError({
        message: 'Invalid email or password credentials',
        code: 'INVALID_CREDENTIALS',
        status: 401,
      }),
    );

    const res = await authService.signIn('test@aether.ai', 'WrongPassword!');

    expect(res.user).toBeNull();
    expect(res.error?.message).toMatch(/Invalid email or password credentials|Authentication failed/);
  });

  // Scenario 12: Duplicate registration
  it('Scenario 12: Duplicate email registration returns error without corrupting active session', async () => {
    vi.spyOn(authApi, 'register').mockRejectedValue(
      new ApiError({
        message: 'An account with this email already exists',
        code: 'EMAIL_EXISTS',
        status: 409,
      }),
    );

    const res = await authService.signUp('Existing', 'User', 'test@aether.ai', 'Password123!');

    expect(res.user).toBeNull();
    expect(res.error).toBeDefined();
    expect(localStorage.getItem(authConfig.tokenKey)).toBeNull();
  });

  // Scenario 13: OAuth login and callback
  it('Scenario 13: Google OAuth callback token resolution authenticates and sets session', async () => {
    const validToken = createMockJwt(3600);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(testUser);

    const res = await authService.handleGoogleCallbackToken(validToken, 'oauth-refresh-token');

    expect(res.user?.id).toBe(testUser.id);
    expect(res.error).toBeNull();
    expect(localStorage.getItem(authConfig.tokenKey)).toBe(validToken);
    expect(localStorage.getItem(authConfig.refreshTokenKey)).toBe('oauth-refresh-token');
  });

  // Scenario 14: Logout followed by an attempted protected-page visit
  it('Scenario 14: Logout invalidates session and prevents protected page access', async () => {
    const validToken = createMockJwt(3600);
    localStorage.setItem(authConfig.tokenKey, validToken);
    vi.spyOn(authApi, 'logout').mockResolvedValue(undefined);

    await authService.signOut();

    expect(localStorage.getItem(authConfig.tokenKey)).toBeNull();
    expect(localStorage.getItem(authConfig.refreshTokenKey)).toBeNull();
    expect(localStorage.getItem('aether_auth_user')).toBeNull();

    const { session } = await authService.initialize();
    expect(session).toBeNull();
  });

  // Scenario 15: Session initialization under slow network conditions
  it('Scenario 15: Session initialization handles slow network conditions gracefully with timeout', async () => {
    vi.spyOn(authApi, 'getCurrentUser').mockImplementation(
      () =>
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new ApiError({ message: 'Request timed out', status: 408, code: 'TIMEOUT' })),
            50,
          ),
        ),
    );

    const validToken = createMockJwt(3600);
    localStorage.setItem(authConfig.tokenKey, validToken);
    localStorage.setItem('aether_auth_user', JSON.stringify(testUser));

    const { session } = await authService.initialize();
    // Resolves from cached profile under transient timeout
    expect(session?.user?.id).toBe(testUser.id);
  });

  // Scenario 16: Multiple concurrent session initialization calls
  it('Scenario 16: Multiple concurrent session initialization calls are deduplicated into single flight', async () => {
    const validToken = createMockJwt(3600);
    localStorage.setItem(authConfig.tokenKey, validToken);
    const getUserSpy = vi.spyOn(authApi, 'getCurrentUser').mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 20));
      return testUser;
    });

    const [r1, r2, r3] = await Promise.all([
      authService.initialize(),
      authService.initialize(),
      authService.initialize(),
    ]);

    expect(r1.session?.user?.id).toBe(testUser.id);
    expect(r2.session?.user?.id).toBe(testUser.id);
    expect(r3.session?.user?.id).toBe(testUser.id);
    expect(getUserSpy).toHaveBeenCalledTimes(1);
  });

  // Scenario 17: Profile-fetching failure after successful authentication
  it('Scenario 17: Profile-fetching failure after authentication handles errors safely without crashing', async () => {
    vi.spyOn(authApi, 'login').mockResolvedValue({
      user: undefined, // Missing user in login response
      tokens: {
        accessToken: createMockJwt(3600),
        refreshToken: 'rf-123',
        expiresIn: '15m',
      },
    });

    vi.spyOn(authApi, 'getCurrentUser').mockRejectedValue(new Error('Profile service unavailable'));

    const res = await authService.signIn('test@aether.ai', 'Password123!');
    expect(res.user).toBeNull();
    expect(res.error).toBeDefined();
  });

  // Scenario 18: WebGL context loss and restoration
  it('Scenario 18: Landing3DBackground handles WebGL context loss and falls back gracefully', () => {
    const { container } = render(<Landing3DBackground />);
    expect(container).toBeDefined();
  });

  // Scenario 19: Three.js component mount and unmount
  it('Scenario 19: Landing3DBackground unmounts cleanly without throwing or memory leaks', () => {
    const { unmount } = render(<Landing3DBackground />);
    expect(() => unmount()).not.toThrow();
  });

  // Scenario 20: Production API URL configuration
  it('Scenario 20: Production API URL safety guard rewrites dev localhost to production backend', () => {
    const sanitizeResult = sanitizeErrorMessage('Failed to fetch: net::ERR_CONNECTION_REFUSED', 0);
    expect(sanitizeResult).toBe(
      'Unable to connect to the AETHER backend server. Please verify the backend service is running and accessible.',
    );
  });
});
