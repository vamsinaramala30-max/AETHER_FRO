import { authApi, LoginPayload, RegisterPayload, UserDTO } from '../api';
import { storageService } from './storageService';

export class AuthService {
  private tokenKey = 'auth_token';

  public setToken(token: string): void {
    storageService.set(this.tokenKey, token);
  }

  public getToken(): string | null {
    return storageService.get<string | null>(this.tokenKey, null);
  }

  public clearToken(): void {
    storageService.remove(this.tokenKey);
  }

  public async login(payload: LoginPayload): Promise<UserDTO> {
    const res = await authApi.login(payload);
    this.setToken(res.accessToken);
    return authApi.getCurrentUser();
  }

  public async register(payload: RegisterPayload): Promise<UserDTO> {
    const res = await authApi.register(payload);
    this.setToken(res.accessToken);
    return authApi.getCurrentUser();
  }

  public async logout(): Promise<void> {
    try {
      await authApi.logout();
    } finally {
      this.clearToken();
    }
  }

  public async getCurrentUser(): Promise<UserDTO | null> {
    if (!this.getToken()) return null;
    try {
      return await authApi.getCurrentUser();
    } catch {
      this.clearToken();
      return null;
    }
  }
}

export const authService = new AuthService();