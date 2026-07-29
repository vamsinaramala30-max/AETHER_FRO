import { authApi } from '../api/auth.api';

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

const TOKEN_KEY = 'aether_auth_token';

// In-memory event bus for real-time auth state synchronization
const listeners = new Set<AuthChangeListener>();

function notifyListeners(event: AuthChangeEvent, session: AuthSession | null) {
  listeners.forEach((listener) => {
    try {
      listener(event, session);
    } catch (err) {
      console.error('[AuthService] Error in listener callback:', err);
    }
  });
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
}

export const authService = {
  async signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    try {
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
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
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
    }
  },

  signInWithGoogle(): void {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL?.replace(/\/api(\/v\d)?\/?$/, '') ||
      'http://localhost:5001';
    window.location.href = `${baseUrl}/api/auth/google`;
  },

  async signOut(): Promise<{ error: Error | null }> {
    try {
      const token = getStoredToken();
      if (token) {
        await authApi.logout().catch((err) => {
          console.warn('[AuthService] Server logout endpoint warning:', err);
        });
      }
      return { error: null };
    } catch (error: any) {
      return { error: error instanceof Error ? error : new Error(String(error)) };
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      notifyListeners('SIGNED_OUT', null);
    }
  },

  async getCurrentSession(): Promise<{ session: AuthSession | null; error: Error | null }> {
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
