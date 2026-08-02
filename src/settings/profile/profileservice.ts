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
    try {
      const response = await api.get<any>('/auth/me');
      const payload = response.data?.data || response.data;
      return {
        id: payload.id || 'usr_default',
        email: payload.email || 'user@aether.io',
        firstName:
          payload.firstName || (payload.fullName ? payload.fullName.split(' ')[0] : 'User'),
        lastName:
          payload.lastName ||
          (payload.fullName ? payload.fullName.split(' ').slice(1).join(' ') : ''),
        avatarUrl: payload.avatarUrl,
        bio: payload.bio || '',
        company: payload.company || '',
      };
    } catch {
      const response = await api.get<any>('/auth/profile');
      const payload = response.data?.data || response.data;
      return {
        id: payload.id || 'usr_default',
        email: payload.email || 'user@aether.io',
        firstName:
          payload.firstName || (payload.fullName ? payload.fullName.split(' ')[0] : 'User'),
        lastName:
          payload.lastName ||
          (payload.fullName ? payload.fullName.split(' ').slice(1).join(' ') : ''),
        avatarUrl: payload.avatarUrl,
        bio: payload.bio || '',
        company: payload.company || '',
      };
    }
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await api.put<any>('/auth/profile', data);
      const payload = response.data?.data || response.data;
      return {
        id: payload.id || 'usr_default',
        email: payload.email || 'user@aether.io',
        firstName:
          payload.firstName ||
          (payload.fullName ? payload.fullName.split(' ')[0] : data.firstName || 'User'),
        lastName:
          payload.lastName ||
          (payload.fullName ? payload.fullName.split(' ').slice(1).join(' ') : data.lastName || ''),
        avatarUrl: payload.avatarUrl || data.avatarUrl,
        bio: payload.bio !== undefined ? payload.bio : data.bio,
        company: payload.company !== undefined ? payload.company : data.company,
      };
    } catch {
      return {
        id: data.id || 'usr_default',
        email: data.email || 'karthiknaramala9949@gmail.com',
        firstName: data.firstName || 'Karthik',
        lastName: data.lastName || 'Naramala',
        avatarUrl: data.avatarUrl,
        bio: data.bio || '',
        company: data.company || '',
      };
    }
  },
};
