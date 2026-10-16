import { authApi, LoginPayload, RegisterPayload, UserDTO } from '../api/Index';
import { storageService } from './storageService';
import { authConfig } from '../config/auth.config';

const TOKEN_KEY = 'auth_token';

export const authService = {
  setToken(token: string, refreshToken?: string): void {
    storageService.set(TOKEN_KEY, token);
    try {
      localStorage.setItem('auth_token', token);
      localStorage.setItem(authConfig.tokenKey, token);
      localStorage.setItem('aether_access_token', token);
      localStorage.setItem('aether-auth-token', token);
      if (refreshToken) {
        localStorage.setItem(authConfig.refreshTokenKey, refreshToken);
      }
    } catch {
      // Ignore storage errors
    }
  },

  getToken(): string | null {
    return (
      storageService.get<string | null>(TOKEN_KEY, null) ||
      localStorage.getItem('auth_token') ||
      localStorage.getItem(authConfig.tokenKey) ||
      localStorage.getItem('aether_access_token') ||
      null
    );
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(authConfig.refreshTokenKey) || null;
  },

  clearToken(): void {
    storageService.remove(TOKEN_KEY);
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('aether_auth_token');
      localStorage.removeItem(authConfig.tokenKey);
      localStorage.removeItem(authConfig.refreshTokenKey);
      localStorage.removeItem('aether_access_token');
      localStorage.removeItem('aether-auth-token');
    } catch {
      // Ignore storage errors
    }
  },

  async login(payload: LoginPayload): Promise<UserDTO> {
    const res = await authApi.login(payload);
    this.setToken(res.tokens.accessToken, res.tokens.refreshToken);
    return authApi.getCurrentUser();
  },

  async register(payload: RegisterPayload): Promise<UserDTO> {
    const res = await authApi.register(payload);
    this.setToken(res.tokens.accessToken, res.tokens.refreshToken);
    return authApi.getCurrentUser();
  },

  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } finally {
      this.clearToken();
    }
  },

  async getCurrentUser(): Promise<UserDTO | null> {
    const token = this.getToken();
    if (typeof token !== 'string' || token.trim() === '') return null;
    try {
      return await authApi.getCurrentUser();
    } catch {
      this.clearToken();
      return null;
    }
  },
};
