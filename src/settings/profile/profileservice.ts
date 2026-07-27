// frontend/src/settings/profile/profileService.ts
import { api } from '../../shared/api'; // Reusing existing app API client

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio?: string;
  company?: string;
}

export const profileService = {
  getCurrentProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch<UserProfile>('/auth/profile', data);
    return response.data;
  },
};
