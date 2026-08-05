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
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  avatarUrl?: string | null;
  bio?: string | null;
  company?: string | null;
  timezone?: string | null;
  language?: string | null;
  isEmailVerified?: boolean;
  workspaceId?: string;
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

export interface AuthApiResult {
  user?: UserDTO;
  tokens: AuthTokenResponse;
}

function unwrapResponsePayload(response: unknown): Record<string, unknown> {
  const candidate = (response as Record<string, unknown> | undefined) ?? {};
  const nestedData = candidate.data;

  if (nestedData && typeof nestedData === 'object' && !Array.isArray(nestedData)) {
    const nestedRecord = nestedData as Record<string, unknown>;
    if (
      'user' in nestedRecord ||
      'tokens' in nestedRecord ||
      'id' in nestedRecord ||
      'email' in nestedRecord
    ) {
      return nestedRecord;
    }
  }

  return candidate;
}

function normalizeAuthResponse(response: unknown): AuthApiResult {
  const payload = unwrapResponsePayload(response);
  const tokens = (payload as any)?.tokens ?? (response as any)?.tokens;
  const user = (payload as any)?.user ?? (response as any)?.user;

  if (!tokens || typeof tokens.accessToken !== 'string') {
    throw new Error('Unexpected auth response format: missing tokens');
  }

  return {
    tokens: tokens as AuthTokenResponse,
    user: user as UserDTO | undefined,
  };
}

function extractUser(response: unknown): UserDTO {
  const payload = unwrapResponsePayload(response);
  const user = (payload as any)?.user ?? payload;

  if (!user || typeof user !== 'object' || typeof user.id !== 'string') {
    throw new Error('Unexpected auth response format: missing user information');
  }

  return user as UserDTO;
}

export const authApi = {
  login: async (payload: LoginPayload, config?: RequestConfig): Promise<AuthApiResult> => {
    const res = await apiClient.post<any>(ENDPOINTS.AUTH.LOGIN, payload, {
      ...config,
      skipAuth: true,
    });
    return normalizeAuthResponse(res);
  },

  register: async (payload: RegisterPayload, config?: RequestConfig): Promise<AuthApiResult> => {
    const res = await apiClient.post<any>(ENDPOINTS.AUTH.REGISTER, payload, {
      ...config,
      skipAuth: true,
    });
    return normalizeAuthResponse(res);
  },

  logout: (config?: RequestConfig): Promise<void> =>
    apiClient.post<void>(ENDPOINTS.AUTH.LOGOUT, {}, config),

  refreshToken: async (refreshToken: string, config?: RequestConfig): Promise<AuthApiResult> => {
    const res = await apiClient.post<any>(
      ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
      { ...config, skipAuth: true },
    );
    return normalizeAuthResponse(res);
  },

  getCurrentUser: async (config?: RequestConfig): Promise<UserDTO> => {
    const res = await apiClient.get<any>(ENDPOINTS.AUTH.ME, config);
    return extractUser(res);
  },
};
