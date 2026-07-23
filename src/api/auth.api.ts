import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
}

export const authApi = {
  login: (payload: LoginPayload, config?: RequestConfig): Promise<AuthTokenResponse> =>
    apiClient.post<AuthTokenResponse>(ENDPOINTS.AUTH.LOGIN, payload, { ...config, skipAuth: true }),

  register: (payload: RegisterPayload, config?: RequestConfig): Promise<AuthTokenResponse> =>
    apiClient.post<AuthTokenResponse>(ENDPOINTS.AUTH.REGISTER, payload, { ...config, skipAuth: true }),

  logout: (config?: RequestConfig): Promise<void> =>
    apiClient.post<void>(ENDPOINTS.AUTH.LOGOUT, {}, config),

  refreshToken: (refreshToken: string, config?: RequestConfig): Promise<AuthTokenResponse> =>
    apiClient.post<AuthTokenResponse>(ENDPOINTS.AUTH.REFRESH, { refreshToken }, { ...config, skipAuth: true }),

  getCurrentUser: (config?: RequestConfig): Promise<UserDTO> =>
    apiClient.get<UserDTO>(ENDPOINTS.AUTH.ME, config),
};