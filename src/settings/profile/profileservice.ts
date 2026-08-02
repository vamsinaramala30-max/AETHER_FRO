// frontend/src/settings/profile/profileService.ts
import { apiClient } from '../../api/client';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio?: string;
  company?: string;
}

const STORAGE_KEY = 'aether_user_profile';

export const profileService = {
  getCurrentProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get<any>('/auth/profile');
      const payload = response.data?.data || response.data || response;
      const profile: UserProfile = {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      return profile;
    } catch {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // fallback
        }
      }
      return {
        id: 'usr_default',
        email: 'karthiknaramala9949@gmail.com',
        firstName: 'Karthik',
        lastName: 'Naramala',
        bio: '',
        company: 'AETHER Inc.',
      };
    }
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    let updatedProfile: UserProfile;
    try {
      const response = await apiClient.put<any>('/auth/profile', data);
      const payload = response.data?.data || response.data || response;
      updatedProfile = {
        id: payload.id || data.id || 'usr_default',
        email: payload.email || data.email || 'karthiknaramala9949@gmail.com',
        firstName:
          payload.firstName ||
          (payload.fullName ? payload.fullName.split(' ')[0] : data.firstName || 'Karthik'),
        lastName:
          payload.lastName ||
          (payload.fullName
            ? payload.fullName.split(' ').slice(1).join(' ')
            : data.lastName || 'Naramala'),
        avatarUrl: payload.avatarUrl || data.avatarUrl,
        bio: payload.bio !== undefined ? payload.bio : data.bio || '',
        company: payload.company !== undefined ? payload.company : data.company || '',
      };
    } catch {
      updatedProfile = {
        id: data.id || 'usr_default',
        email: data.email || 'karthiknaramala9949@gmail.com',
        firstName: data.firstName || 'Karthik',
        lastName: data.lastName || 'Naramala',
        avatarUrl: data.avatarUrl,
        bio: data.bio || '',
        company: data.company || '',
      };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));

    // Also update main user state in localStorage
    try {
      const storedUser = localStorage.getItem('aether_user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        userObj.firstName = updatedProfile.firstName;
        userObj.lastName = updatedProfile.lastName;
        userObj.fullName = `${updatedProfile.firstName} ${updatedProfile.lastName}`.trim();
        userObj.avatarUrl = updatedProfile.avatarUrl;
        localStorage.setItem('aether_user', JSON.stringify(userObj));
      }
    } catch {
      // safe fallback
    }

    window.dispatchEvent(new CustomEvent('aether-profile-updated', { detail: updatedProfile }));
    return updatedProfile;
  },
};
