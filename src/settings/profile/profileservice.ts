import { api } from '../../shared/api';

export interface UserProfile {
  id: string;
  email: string;
  username?: string | null;
  fullName?: string | null;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  phone?: string | null;
  company?: string | null;
  timezone?: string;
  language?: string;
  country?: string;
  role?: string;
  isEmailVerified?: boolean;
  is2FAEnabled?: boolean;
  passwordLastChangedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
}

export const profileService = {
  getCurrentProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get<any>('/settings/profile');
      if (response.data?.data) return response.data.data;
      if (response.data) return response.data;
    } catch {
      const fallbackResponse = await api.get<any>('/auth/me');
      if (fallbackResponse.data?.data) return fallbackResponse.data.data;
    }

    throw new Error('Unable to resolve user profile.');
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch<any>('/settings/profile', data);
    const updated = response.data?.data || response.data;
    window.dispatchEvent(new CustomEvent('aether-profile-updated', { detail: updated }));
    return updated;
  },

  uploadAvatar: async (file: File): Promise<UserProfile> => {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only PNG, JPEG, WEBP, and GIF images are allowed.');
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds maximum limit of 5MB.');
    }

    // Convert to Base64 preview/upload data URL or multipart form
    const reader = new FileReader();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });

    const response = await api.post<any>('/settings/profile/avatar', { avatarUrl: dataUrl });
    const updated = response.data?.data || response.data;
    window.dispatchEvent(new CustomEvent('aether-profile-updated', { detail: updated }));
    return updated;
  },

  removeAvatar: async (): Promise<UserProfile> => {
    const response = await api.delete<any>('/settings/profile/avatar');
    const updated = response.data?.data || response.data;
    window.dispatchEvent(new CustomEvent('aether-profile-updated', { detail: updated }));
    return updated;
  },
};
