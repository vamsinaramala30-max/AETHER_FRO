import { authApi, LoginPayload, RegisterPayload, UserDTO } from '../api/Index';
import { storageService } from './storageService';

const TOKEN_KEY = 'auth_token';

export const authService = {
  setToken(token: string): void {
    storageService.set(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return storageService.get<string | null>(TOKEN_KEY, null);
  },

  clearToken(): void {
    storageService.remove(TOKEN_KEY);
  },

  async login(payload: LoginPayload): Promise<UserDTO> {
    const res = await authApi.login(payload);
    this.setToken(res.accessToken);
    return authApi.getCurrentUser();
  },

  async register(payload: RegisterPayload): Promise<UserDTO> {
    const res = await authApi.register(payload);
    this.setToken(res.accessToken);
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
