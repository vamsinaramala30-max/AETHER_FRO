import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
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
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

/**
 * Backend response envelope: { success: true, data: { user, tokens: { accessToken, refreshToken, expiresIn } } }
 * This helper extracts the tokens from the envelope.
 */
function extractTokens(res: any): AuthTokenResponse {
  // If response has the standard envelope with data.tokens
  if (res?.data?.tokens?.accessToken) {
    return res.data.tokens;
  }
  // If response has tokens at top level (alternative format)
  if (res?.tokens?.accessToken) {
    return res.tokens;
  }
  // If somehow the response IS the tokens directly
  if (res?.accessToken) {
    return res;
  }
  throw new Error('Unexpected auth response format: could not extract tokens');
}

export const authApi = {
  login: async (payload: LoginPayload, config?: RequestConfig): Promise<AuthTokenResponse> => {
    const res = await apiClient.post<any>(ENDPOINTS.AUTH.LOGIN, payload, {
      ...config,
      skipAuth: true,
    });
    return extractTokens(res);
  },

  register: async (
    payload: RegisterPayload,
    config?: RequestConfig,
  ): Promise<AuthTokenResponse> => {
    const res = await apiClient.post<any>(ENDPOINTS.AUTH.REGISTER, payload, {
      ...config,
      skipAuth: true,
    });
    return extractTokens(res);
  },

  logout: (config?: RequestConfig): Promise<void> =>
    apiClient.post<void>(ENDPOINTS.AUTH.LOGOUT, {}, config),

  refreshToken: async (
    refreshToken: string,
    config?: RequestConfig,
  ): Promise<AuthTokenResponse> => {
    const res = await apiClient.post<any>(
      ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
      { ...config, skipAuth: true },
    );
    return extractTokens(res);
  },

  getCurrentUser: (config?: RequestConfig): Promise<UserDTO> =>
    apiClient.get<UserDTO>(ENDPOINTS.AUTH.ME, config),
};
