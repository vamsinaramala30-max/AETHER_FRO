import { apiClient } from '../../api/client';
import { normalizeUserProfile } from '../../auth/userProfile';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  bio?: string;
  company?: string;
}

function toUserProfile(payload: Record<string, unknown>, fallback: Partial<UserProfile> = {}): UserProfile {
  const normalized = normalizeUserProfile({
    id: fallback.id,
    email: fallback.email,
    fullName: typeof payload.fullName === 'string' ? payload.fullName : undefined,
    name: typeof payload.name === 'string' ? payload.name : undefined,
    firstName: typeof payload.firstName === 'string' ? payload.firstName : undefined,
    lastName: typeof payload.lastName === 'string' ? payload.lastName : undefined,
    avatarUrl: typeof payload.avatarUrl === 'string' ? payload.avatarUrl : undefined,
    bio: typeof payload.bio === 'string' ? payload.bio : fallback.bio,
    company: typeof payload.company === 'string' ? payload.company : fallback.company,
    role: typeof payload.role === 'string' ? payload.role : undefined,
  });

  return {
    id: normalized.id || fallback.id || '',
    email: normalized.email || fallback.email || '',
    firstName: normalized.firstName || fallback.firstName || '',
    lastName: normalized.lastName || fallback.lastName || '',
    avatarUrl: typeof normalized.avatarUrl === 'string' ? normalized.avatarUrl : undefined,
    bio: typeof normalized.bio === 'string' ? normalized.bio : fallback.bio || '',
    company: typeof normalized.company === 'string' ? normalized.company : fallback.company || '',
  };
}

export const profileService = {
  getCurrentProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<any>('/auth/profile');
    const payload = response?.data?.data ?? response?.data ?? response;
    return toUserProfile(payload as Record<string, unknown>);
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.put<any>('/auth/profile', data);
    const payload = response?.data?.data ?? response?.data ?? response;
    const updatedProfile = toUserProfile(payload as Record<string, unknown>, data);
    window.dispatchEvent(new CustomEvent('aether-profile-updated', { detail: updatedProfile }));
    return updatedProfile;
  },
};
