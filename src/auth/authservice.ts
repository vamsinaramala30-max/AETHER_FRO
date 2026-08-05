import { authApi, AuthApiResult, UserDTO } from '../api/auth.api';
import { authConfig } from '../config/auth.config';
import { normalizeUserProfile } from './userProfile';

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
let initializationPromise: Promise<{ session: AuthSession | null; error: Error | null }> | null =
  null;

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

function setStoredTokens(tokens: { accessToken: string; refreshToken?: string }): void {
  localStorage.setItem(authConfig.tokenKey, tokens.accessToken);
  if (tokens.refreshToken) {
    localStorage.setItem(authConfig.refreshTokenKey, tokens.refreshToken);
  } else {
    localStorage.removeItem(authConfig.refreshTokenKey);
  }
}

function clearStoredTokens(): void {
  localStorage.removeItem(authConfig.tokenKey);
  localStorage.removeItem(authConfig.refreshTokenKey);
}

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof payload.exp !== 'number') {
      return false;
    }
    return Date.now() >= payload.exp * 1000 - 10000;
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
  try {
    const result = await authApi.refreshToken(refreshToken, { skipAuth: true });
    if (!result.tokens?.accessToken) {
      throw new Error('Refresh operation did not return a valid access token');
    }

    setStoredTokens(result.tokens);
    const user = await buildUserFromResponse(result.user ? result : await authApi.getCurrentUser());

    const session = createSession(user, result.tokens.accessToken, result.tokens.refreshToken);
    notifyListeners('TOKEN_REFRESHED', session);
    return { session, error: null };
  } catch (error: unknown) {
    clearStoredTokens();
    currentSession = null;
    return {
      session: null,
      error: error instanceof Error ? error : new Error('Token refresh failed'),
    };
  }
}

async function resolveSession(): Promise<{ session: AuthSession | null; error: Error | null }> {
  const accessToken = getStoredAccessToken();
  const refreshToken = getStoredRefreshToken();

  if (accessToken && !isTokenExpired(accessToken)) {
    try {
      const user = await buildUserFromResponse(await authApi.getCurrentUser());
      const session = createSession(user, accessToken, refreshToken ?? undefined);
      currentSession = session;
      return { session, error: null };
    } catch (error: unknown) {
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

      setStoredTokens(result.tokens);
      const user = await buildUserFromResponse(result.user ?? (await authApi.getCurrentUser()));
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

      setStoredTokens(result.tokens);
      const user = await buildUserFromResponse(result.user ?? (await authApi.getCurrentUser()));
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
      if (e.key === authConfig.tokenKey || e.key === authConfig.refreshTokenKey) {
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
