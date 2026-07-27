import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface UserProfileDTO {
  id: string;
  name: string;
  email: string;
  theme: 'light' | 'dark' | 'system';
}

export const settingsApi = {
  getProfile: (config?: RequestConfig): Promise<UserProfileDTO> =>
    apiClient.get<UserProfileDTO>(ENDPOINTS.SETTINGS.PROFILE, config),

  updateProfile: (
    payload: Partial<UserProfileDTO>,
    config?: RequestConfig,
  ): Promise<UserProfileDTO> =>
    apiClient.patch<UserProfileDTO>(ENDPOINTS.SETTINGS.PROFILE, payload, config),
};
