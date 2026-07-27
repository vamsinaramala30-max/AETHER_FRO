// frontend/src/auth/authService.ts
import { authApi } from '../api/auth.api';

export interface AuthResponse {
  user: any | null;
  error: Error | null;
}

/**
 * Extract the access token from backend response.
 * Backend returns: { success: true, data: { user, tokens: { accessToken, refreshToken, expiresIn } } }
 * The API client returns the raw response body as-is.
 */
function extractAccessToken(res: any): string | null {
  // If response has data.tokens structure (standard envelope)
  if (res?.data?.tokens?.accessToken) {
    return res.data.tokens.accessToken;
  }
  // If response has tokens at top level (direct response)
  if (res?.tokens?.accessToken) {
    return res.tokens.accessToken;
  }
  // Fallback: try top-level accessToken
  if (res?.accessToken) {
    return res.accessToken;
  }
  return null;
}

/**
 * Extract refresh token from backend response for session management.
 */
function _extractRefreshToken(res: any): string | null {
  if (res?.data?.tokens?.refreshToken) {
    return res.data.tokens.refreshToken;
  }
  if (res?.tokens?.refreshToken) {
    return res.tokens.refreshToken;
  }
  return null;
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
      if (accessToken) {
        localStorage.setItem('aether_auth_token', JSON.stringify(accessToken));
      }
      return { user: { email }, error: null };
    } catch (error: any) {
      return { user: null, error: error as Error };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await authApi.login({ email, password });
      const accessToken = extractAccessToken(res);
      if (accessToken) {
        localStorage.setItem('aether_auth_token', JSON.stringify(accessToken));
      }
      return { user: { email }, error: null };
    } catch (error: any) {
      return { user: null, error: error as Error };
    }
  },

  signInWithGoogle(): void {
    // VITE_API_BASE_URL is 'http://localhost:5001/api' — strip the '/api' suffix to get server root
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL?.replace(/\/api(\/v\d)?\/?$/, '') ||
      'http://localhost:5001';
    // The OAuth route is mounted at /api/auth/google in the backend
    window.location.href = `${baseUrl}/api/auth/google`;
  },

  async signOut(): Promise<{ error: Error | null }> {
    try {
      const token = localStorage.getItem('aether_auth_token');
      if (token) {
        const _parsedToken = JSON.parse(token);
        await authApi.logout();
      }
      localStorage.removeItem('aether_auth_token');
      return { error: null };
    } catch (error: any) {
      return { error: error as Error };
    }
  },

  async getCurrentSession() {
    try {
      const token = localStorage.getItem('aether_auth_token');
      if (token) {
        const parsedToken = JSON.parse(token);
        if (parsedToken) {
          return {
            session: {
              access_token: parsedToken,
              user: { id: 'restored', email: 'session@aether.app' },
            },
            error: null,
          };
        }
      }
      return { session: null, error: null };
    } catch {
      return { session: null, error: new Error('No session') };
    }
  },

  subscribeToAuthChanges(_callback: (event: string, session: any) => void) {
    // No-op for now - we don't have real-time auth state changes with JWT
    // The callback will be invoked manually on login/logout
    return { unsubscribe: () => {} };
  },
};
