// frontend/src/auth/authService.ts
import { authApi } from '../api/auth.api';

export interface AuthResponse {
  user: any | null;
  error: Error | null;
}

export const authService = {
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await authApi.register({ name: email, email, password });
      localStorage.setItem('aether_auth_token', JSON.stringify(res.accessToken));
      return { user: { email }, error: null };
    } catch (error: any) {
      return { user: null, error: error as Error };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem('aether_auth_token', JSON.stringify(res.accessToken));
      return { user: { email }, error: null };
    } catch (error: any) {
      return { user: null, error: error as Error };
    }
  },

  signInWithGoogle(): void {
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    window.location.href = `${baseUrl}/api/auth/google`;
  },

  async signOut(): Promise<{ error: Error | null }> {
    try {
      const token = localStorage.getItem('aether_auth_token');
      if (token) {
        const parsedToken = JSON.parse(token);
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
      return { session: { access_token: token ? JSON.parse(token) : null }, error: null };
    } catch {
      return { session: null, error: new Error('No session') };
    }
  },

  subscribeToAuthChanges(callback: (event: string, session: any) => void) {
    // No-op for now - we don't have real-time auth state changes with JWT
    // The callback will be invoked manually on login/logout
    return { unsubscribe: () => {} };
  }
};
