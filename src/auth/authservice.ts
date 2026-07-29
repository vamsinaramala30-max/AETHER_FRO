<<<<<<< HEAD
import { authApi, AuthApiResult, UserDTO } from '../api/auth.api';
import { authConfig } from '../config/auth.config';

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
=======
import { authApi } from '../api/auth.api';
>>>>>>> 19791367768ed0b92fd72126e7e9d85df398ff26

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: Error | null;
}

type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED';
type AuthChangeListener = (event: AuthChangeEvent, session: AuthSession | null) => void;

<<<<<<< HEAD
const listeners = new Set<AuthChangeListener>();
let currentSession: AuthSession | null = null;
let initializationPromise: Promise<{ session: AuthSession | null; error: Error | null }> | null = null;

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

=======
const TOKEN_KEY = 'aether_auth_token';

// In-memory event bus for real-time auth state synchronization
const listeners = new Set<AuthChangeListener>();

function notifyListeners(event: AuthChangeEvent, session: AuthSession | null) {
>>>>>>> 19791367768ed0b92fd72126e7e9d85df398ff26
  listeners.forEach((listener) => {
    try {
      listener(event, session);
    } catch (err) {
      console.error('[AuthService] Error in listener callback:', err);
    }
  });
<<<<<<< HEAD
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

function setStoredTokens(tokens: AuthApiResult['tokens']): void {
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

async function buildUserFromResponse(response: AuthApiResult | UserDTO): Promise<AuthUser> {
  if ('user' in response && response.user) {
    return response.user as AuthUser;
  }

  if ('id' in response && typeof response.id === 'string') {
    return response as AuthUser;
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
    const user = await buildUserFromResponse(
      result.user ? result : await authApi.getCurrentUser(),
    );

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
      const user = await authApi.getCurrentUser();
      const session = createSession(user as AuthUser, accessToken, refreshToken ?? undefined);
      currentSession = session;
      return { session, error: null };
    } catch (error: unknown) {
      if (refreshToken) {
        return await refreshSessionUsingRefreshToken(refreshToken);
      }
      clearStoredTokens();
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
=======
}

function extractAccessToken(res: any): string | null {
  if (res?.data?.tokens?.accessToken) return res.data.tokens.accessToken;
  if (res?.tokens?.accessToken) return res.tokens.accessToken;
  if (res?.accessToken) return res.accessToken;
  if (typeof res?.data === 'string') return res.data;
  return null;
}

function extractUserData(res: any): AuthUser | null {
  const rawUser = res?.data?.user || res?.user || res?.data;
  if (rawUser && typeof rawUser === 'object' && 'id' in rawUser) {
    return rawUser as AuthUser;
  }
  return null;
}

/**
 * Safely decodes a JWT payload to check expiration without external libraries.
 */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return false;
    // Buffer of 10 seconds before actual expiration time
    return Date.now() >= payload.exp * 1000 - 10000;
  } catch {
    return true;
  }
}

function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    // Handle legacy double-stringified tokens or plain strings safely
    if (raw.startsWith('"') && raw.endsWith('"')) {
      return JSON.parse(raw);
    }
    return raw;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
>>>>>>> 19791367768ed0b92fd72126e7e9d85df398ff26
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
<<<<<<< HEAD
      const result = await authApi.register({ firstName, lastName, email, password });
      if (!result.tokens?.accessToken) {
        throw new Error('Registration response did not provide authentication tokens');
      }

      setStoredTokens(result.tokens);
      const user = await buildUserFromResponse(
        result.user ?? (await authApi.getCurrentUser()),
      );
      const session = createSession(user, result.tokens.accessToken, result.tokens.refreshToken);
      notifyListeners('SIGNED_IN', session);
      return { user, error: null };
    } catch (error: unknown) {
      return {
        user: null,
        error: error instanceof Error ? error : new Error('Registration failed'),
      };
=======
      const res = await authApi.register({ firstName, lastName, email, password });
      const accessToken = extractAccessToken(res);
      const user = extractUserData(res) || { id: '', email, firstName, lastName };

      if (accessToken) {
        localStorage.setItem(TOKEN_KEY, accessToken);
        notifyListeners('SIGNED_IN', { accessToken, user });
      }

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error instanceof Error ? error : new Error(String(error)) };
>>>>>>> 19791367768ed0b92fd72126e7e9d85df398ff26
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
<<<<<<< HEAD
      const result = await authApi.login({ email, password });
      if (!result.tokens?.accessToken) {
        throw new Error('Login did not return a valid access token');
      }

      setStoredTokens(result.tokens);
      const user = await buildUserFromResponse(
        result.user ?? (await authApi.getCurrentUser()),
      );
      const session = createSession(user, result.tokens.accessToken, result.tokens.refreshToken);
      notifyListeners('SIGNED_IN', session);
      return { user, error: null };
    } catch (error: unknown) {
      return {
        user: null,
        error: error instanceof Error ? error : new Error('Login failed'),
      };
=======
      const res = await authApi.login({ email, password });
      const accessToken = extractAccessToken(res);
      const user = extractUserData(res) || { id: '', email };

      if (accessToken) {
        localStorage.setItem(TOKEN_KEY, accessToken);
        notifyListeners('SIGNED_IN', { accessToken, user });
      }

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error instanceof Error ? error : new Error(String(error)) };
>>>>>>> 19791367768ed0b92fd72126e7e9d85df398ff26
    }
  },

  signInWithGoogle(): void {
<<<<<<< HEAD
    const rawBaseUrl =
      import.meta.env.VITE_API_BASE_URL?.replace(/\/api(\/v\d)?\/?$/, '') ||
      'http://localhost:5000';
    window.location.href = `${rawBaseUrl}/api/auth/google`;
=======
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL?.replace(/\/api(\/v\d)?\/?$/, '') ||
      'http://localhost:5001';
    window.location.href = `${baseUrl}/api/auth/google`;
>>>>>>> 19791367768ed0b92fd72126e7e9d85df398ff26
  },

  async signOut(): Promise<{ error: Error | null }> {
    try {
<<<<<<< HEAD
      const accessToken = getStoredAccessToken();
      if (accessToken) {
=======
      const token = getStoredToken();
      if (token) {
>>>>>>> 19791367768ed0b92fd72126e7e9d85df398ff26
        await authApi.logout().catch((err) => {
          console.warn('[AuthService] Server logout endpoint warning:', err);
        });
      }
      return { error: null };
<<<<<<< HEAD
    } catch (error: unknown) {
      return {
        error: error instanceof Error ? error : new Error('Logout failed'),
      };
    } finally {
      clearStoredTokens();
      currentSession = null;
=======
    } catch (error: any) {
      return { error: error instanceof Error ? error : new Error(String(error)) };
    } finally {
      localStorage.removeItem(TOKEN_KEY);
>>>>>>> 19791367768ed0b92fd72126e7e9d85df398ff26
      notifyListeners('SIGNED_OUT', null);
    }
  },

  async getCurrentSession(): Promise<{ session: AuthSession | null; error: Error | null }> {
<<<<<<< HEAD
    return await resolveSession();
=======
    try {
      const token = getStoredToken();
      if (!token || isTokenExpired(token)) {
        if (token) localStorage.removeItem(TOKEN_KEY);
        return { session: null, error: null };
      }

      // Validate session against backend server
      const res = await authApi.getCurrentUser();
      const user = extractUserData(res);

      if (!user) {
        localStorage.removeItem(TOKEN_KEY);
        return { session: null, error: new Error('Invalid session data received from server') };
      }

      return {
        session: { accessToken: token, user },
        error: null,
      };
    } catch (error: any) {
      localStorage.removeItem(TOKEN_KEY);
      return {
        session: null,
        error: error instanceof Error ? error : new Error('Session verification failed'),
      };
    }
>>>>>>> 19791367768ed0b92fd72126e7e9d85df398ff26
  },

  subscribeToAuthChanges(callback: AuthChangeListener) {
    listeners.add(callback);
    return {
      unsubscribe: () => {
        listeners.delete(callback);
      },
    };
  },
};
