import { authApi, AuthApiResult, UserDTO } from '../api/auth.api';
import { authConfig } from '../config/auth.config';
import { normalizeUserProfile } from './userProfile';
import { ApiError } from '../api/client';

export interface AuthUser extends UserDTO {
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: Error | null;
}

type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED';
type AuthChangeListener = (event: AuthChangeEvent, session: AuthSession | null) => void;

const listeners = new Set<AuthChangeListener>();
let currentSession: AuthSession | null = null;
let initializationPromise: Promise<{ session: AuthSession | null; error: Error | null }> | null = null;

const USER_CACHE_KEY = 'aether_auth_user';

function notifyListeners(event: AuthChangeEvent, session: AuthSession | null) {
  const sameSession =
    currentSession?.accessToken === session?.accessToken &&
    currentSession?.refreshToken === session?.refreshToken &&
    currentSession?.user?.id === session?.user?.id &&
    currentSession?.user?.email === session?.user?.email;

  if (sameSession && event !== 'TOKEN_REFRESHED') {
    return;
  }

  currentSession = session;

  listeners.forEach((listener) => {
    try {
      listener(event, session);
    } catch (err) {
      console.error('[AuthService] Error in listener callback:', err);
    }
  });
}

function getStoredToken(key: string): string | null {
  try {
    const value = localStorage.getItem(key);
    return value && value.trim() !== '' ? value : null;
  } catch {
    return null;
  }
}

function getStoredAccessToken(): string | null {
  return getStoredToken(authConfig.tokenKey);
}

function getStoredRefreshToken(): string | null {
  return getStoredToken(authConfig.refreshTokenKey);
}

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function setStoredTokens(tokens: { accessToken: string; refreshToken?: string }, user?: AuthUser): void {
  try {
    localStorage.setItem(authConfig.tokenKey, tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem(authConfig.refreshTokenKey, tokens.refreshToken);
    } else {
      try { localStorage.removeItem(authConfig.refreshTokenKey); } catch { /* ignore */ }
    }
    if (user) {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error('[AuthService] Error storing tokens:', err);
  }
}

function clearStoredTokens(): void {
  try {
    localStorage.removeItem(authConfig.tokenKey);
  } catch { /* ignore */ }
  try {
    localStorage.removeItem(authConfig.refreshTokenKey);
  } catch { /* ignore */ }
  try {
    localStorage.removeItem(USER_CACHE_KEY);
  } catch { /* ignore */ }
}

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof payload.exp !== 'number') {
      return false;
    }
    // Buffer by 30 seconds
    return Date.now() >= payload.exp * 1000 - 30000;
  } catch {
    return true;
  }
}

function createSession(user: AuthUser, accessToken: string, refreshToken?: string): AuthSession {
  return {
    accessToken,
    refreshToken,
    user,
  };
}

function normalizeAuthUser(input: unknown): AuthUser {
  const normalized = normalizeUserProfile(input as Record<string, unknown> | null | undefined);

  return {
    ...normalized,
    id: normalized.id,
    email: normalized.email,
    name: normalized.name,
    fullName: normalized.fullName,
    firstName: normalized.firstName,
    lastName: normalized.lastName,
    role: typeof (input as Record<string, unknown> | null | undefined)?.role === 'string'
      ? ((input as Record<string, unknown>).role as string)
      : 'USER',
    avatarUrl: typeof normalized.avatarUrl === 'string' ? normalized.avatarUrl : null,
    bio: typeof normalized.bio === 'string' ? normalized.bio : null,
    company: typeof normalized.company === 'string' ? normalized.company : null,
    timezone: typeof normalized.timezone === 'string' ? normalized.timezone : 'UTC',
    language: typeof normalized.language === 'string' ? normalized.language : 'en',
    isEmailVerified:
      typeof normalized.isEmailVerified === 'boolean' ? normalized.isEmailVerified : false,
  } as AuthUser;
}

async function buildUserFromResponse(response: AuthApiResult | UserDTO): Promise<AuthUser> {
  if ('user' in response && response.user) {
    return normalizeAuthUser(response.user);
  }

  if ('id' in response && typeof response.id === 'string') {
    return normalizeAuthUser(response);
  }

  throw new Error('Unable to normalize authenticated user');
}

async function refreshSessionUsingRefreshToken(
  refreshToken: string,
): Promise<{ session: AuthSession | null; error: Error | null }> {
  console.warn('[AUTH_DIAG] TOKEN_REFRESH_STARTED (authservice)');
  try {
    const result = await authApi.refreshToken(refreshToken, { skipAuth: true });
    if (!result.tokens?.accessToken) {
      throw new Error('Refresh operation did not return a valid access token');
    }

    const user = await buildUserFromResponse(result.user ? result : await authApi.getCurrentUser());
    setStoredTokens(result.tokens, user);

    const session = createSession(user, result.tokens.accessToken, result.tokens.refreshToken);
    notifyListeners('TOKEN_REFRESHED', session);
    console.warn('[AUTH_DIAG] TOKEN_REFRESH_SUCCESS (authservice)');
    return { session, error: null };
  } catch (error: unknown) {
    const cachedUser = getStoredUser();
    const isAuthError =
      error instanceof ApiError && (error.status === 401 || error.status === 403);

    if (!isAuthError && cachedUser) {
      console.warn('[AUTH_DIAG] NETWORK_ERROR/API_5XX during refresh - Preserving cached user session');
      const accessToken = getStoredAccessToken() || 'cached_token';
      const session = createSession(cachedUser, accessToken, refreshToken);
      currentSession = session;
      return { session, error: null };
    }

    console.error('[AUTH_DIAG] TOKEN_REFRESH_FAILED - Clearing stored auth tokens (authservice)');
    clearStoredTokens();
    currentSession = null;
    return {
      session: null,
      error: error instanceof Error ? error : new Error('Token refresh failed'),
    };
  }
}

async function resolveSession(): Promise<{ session: AuthSession | null; error: Error | null }> {
  console.warn('[AUTH_DIAG] AUTH_INIT - Resolving session...');
  const accessToken = getStoredAccessToken();
  const refreshToken = getStoredRefreshToken();
  const cachedUser = getStoredUser();

  if (accessToken && !isTokenExpired(accessToken)) {
    try {
      const user = await buildUserFromResponse(await authApi.getCurrentUser());
      setStoredTokens({ accessToken, refreshToken: refreshToken || undefined }, user);
      const session = createSession(user, accessToken, refreshToken ?? undefined);
      currentSession = session;
      console.warn('[AUTH_DIAG] AUTH_RESTORED - Session active with valid access token');
      return { session, error: null };
    } catch (error: unknown) {
      if (cachedUser) {
        console.warn('[AUTH_DIAG] NETWORK_ERROR/API_5XX on getCurrentUser - Restoring session from cached profile');
        const session = createSession(cachedUser, accessToken, refreshToken ?? undefined);
        currentSession = session;
        return { session, error: null };
      }
      if (refreshToken) {
        return await refreshSessionUsingRefreshToken(refreshToken);
      }
      clearStoredTokens();
      currentSession = null;
      return {
        session: null,
        error: error instanceof Error ? error : new Error('Session validation failed'),
      };
    }
  }

  if (refreshToken) {
    return await refreshSessionUsingRefreshToken(refreshToken);
  }

  // If cached user exists and token isn't invalid, try using cached user session
  if (cachedUser && accessToken) {
    console.warn('[AUTH_DIAG] AUTH_RESTORED - Restoring session from cached user & access token');
    const session = createSession(cachedUser, accessToken, refreshToken ?? undefined);
    currentSession = session;
    return { session, error: null };
  }

  console.warn('[AUTH_DIAG] SESSION_INVALID - No valid tokens or user session found');
  clearStoredTokens();
  currentSession = null;
  return { session: null, error: null };
}

export const authService = {
  async initialize(): Promise<{ session: AuthSession | null; error: Error | null }> {
    if (!initializationPromise) {
      initializationPromise = resolveSession().finally(() => {
        initializationPromise = null;
      });
    }

    return initializationPromise;
  },

  async signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    try {
      const result = await authApi.register({ firstName, lastName, email, password });
      if (!result.tokens?.accessToken) {
        throw new Error('Registration response did not provide authentication tokens');
      }

      const user = await buildUserFromResponse(result.user ?? (await authApi.getCurrentUser()));
      setStoredTokens(result.tokens, user);
      const session = createSession(user, result.tokens.accessToken, result.tokens.refreshToken);
      notifyListeners('SIGNED_IN', session);
      return { user, error: null };
    } catch (error: unknown) {
      return {
        user: null,
        error: error instanceof Error ? error : new Error('Registration failed'),
      };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const result = await authApi.login({ email, password });
      if (!result.tokens?.accessToken) {
        throw new Error('Login did not return a valid access token');
      }

      const user = await buildUserFromResponse(result.user ?? (await authApi.getCurrentUser()));
      setStoredTokens(result.tokens, user);
      const session = createSession(user, result.tokens.accessToken, result.tokens.refreshToken);
      notifyListeners('SIGNED_IN', session);
      return { user, error: null };
    } catch (error: unknown) {
      return {
        user: null,
        error: error instanceof Error ? error : new Error('Login failed'),
      };
    }
  },

  signInWithGoogle(): void {
    const rawBaseUrl =
      import.meta.env.VITE_API_BASE_URL?.replace(/\/api(\/v\d)?\/?$/, '') ||
      'http://localhost:5001';
    window.location.href = `${rawBaseUrl}/api/auth/google`;
  },

  async handleGoogleCallbackToken(token: string): Promise<AuthResponse> {
    try {
      setStoredTokens({ accessToken: token });
      const user = await buildUserFromResponse(await authApi.getCurrentUser());
      setStoredTokens({ accessToken: token }, user);
      const session = createSession(user, token);
      notifyListeners('SIGNED_IN', session);
      return { user, error: null };
    } catch (error: unknown) {
      clearStoredTokens();
      return {
        user: null,
        error:
          error instanceof Error
            ? error
            : new Error('OAuth authentication token resolution failed'),
      };
    }
  },

  async signOut(): Promise<{ error: Error | null }> {
    try {
      const accessToken = getStoredAccessToken();
      if (accessToken) {
        await authApi.logout().catch((err) => {
          console.warn('[AuthService] Server logout endpoint warning:', err);
        });
      }
      return { error: null };
    } catch (error: unknown) {
      return {
        error: error instanceof Error ? error : new Error('Logout failed'),
      };
    } finally {
      clearStoredTokens();
      currentSession = null;
      notifyListeners('SIGNED_OUT', null);
    }
  },

  async getCurrentSession(): Promise<{ session: AuthSession | null; error: Error | null }> {
    return await resolveSession();
  },

  subscribeToAuthChanges(callback: AuthChangeListener) {
    listeners.add(callback);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === authConfig.tokenKey || e.key === authConfig.refreshTokenKey || e.key === USER_CACHE_KEY) {
        resolveSession().then(({ session }) => {
          if (session) {
            notifyListeners('SIGNED_IN', session);
          } else {
            notifyListeners('SIGNED_OUT', null);
          }
        });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    return {
      unsubscribe: () => {
        listeners.delete(callback);
        if (typeof window !== 'undefined') {
          window.removeEventListener('storage', handleStorageChange);
        }
      },
    };
  },
};
