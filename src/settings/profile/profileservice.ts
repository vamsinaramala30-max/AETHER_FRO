// frontend/src/settings/profile/profileService.ts
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

const STORAGE_KEY = 'aether_user_profile';
const LEGACY_USER_STORAGE_KEY = 'aether_user';

function readStoredProfile(): UserProfile | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) {
      return null;
    }
    const parsed = JSON.parse(value) as Partial<UserProfile>;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    return {
      id: typeof parsed.id === 'string' && parsed.id.trim() ? parsed.id : 'user-unknown',
      email: typeof parsed.email === 'string' ? parsed.email : '',
      firstName: typeof parsed.firstName === 'string' ? parsed.firstName : '',
      lastName: typeof parsed.lastName === 'string' ? parsed.lastName : '',
      avatarUrl: typeof parsed.avatarUrl === 'string' ? parsed.avatarUrl : undefined,
      bio: typeof parsed.bio === 'string' ? parsed.bio : '',
      company: typeof parsed.company === 'string' ? parsed.company : '',
    };
  } catch {
    return null;
  }
}

function writeStoredProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

  try {
    const storedUser = window.localStorage.getItem(LEGACY_USER_STORAGE_KEY);
    if (storedUser) {
      const userObj = JSON.parse(storedUser) as Record<string, unknown>;
      userObj.firstName = profile.firstName;
      userObj.lastName = profile.lastName;
      userObj.fullName = `${profile.firstName} ${profile.lastName}`.trim();
      userObj.email = profile.email;
      userObj.avatarUrl = profile.avatarUrl ?? null;
      window.localStorage.setItem(LEGACY_USER_STORAGE_KEY, JSON.stringify(userObj));
    }
  } catch {
    // ignore storage write failures and continue with the primary profile cache
  }
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
    id: normalized.id || fallback.id || 'user-unknown',
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
    try {
      const response = await apiClient.get<any>('/auth/profile');
      const payload = response?.data?.data ?? response?.data ?? response;
      const profile = toUserProfile(payload as Record<string, unknown>);
      writeStoredProfile(profile);
      return profile;
    } catch {
      const cached = readStoredProfile();
      if (cached) {
        return cached;
      }

      return {
        id: 'user-unknown',
        email: '',
        firstName: '',
        lastName: '',
        bio: '',
        company: '',
      };
    }
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const fallbackProfile = readStoredProfile() ?? {
      id: 'user-unknown',
      email: '',
      firstName: '',
      lastName: '',
      bio: '',
      company: '',
    };

    try {
      const response = await apiClient.put<any>('/auth/profile', data);
      const payload = response?.data?.data ?? response?.data ?? response;
      const updatedProfile = toUserProfile(payload as Record<string, unknown>, {
        id: data.id || fallbackProfile.id,
        email: data.email || fallbackProfile.email,
        firstName: data.firstName || fallbackProfile.firstName,
        lastName: data.lastName || fallbackProfile.lastName,
        bio: data.bio ?? fallbackProfile.bio,
        company: data.company ?? fallbackProfile.company,
      });
      writeStoredProfile(updatedProfile);
      window.dispatchEvent(new CustomEvent('aether-profile-updated', { detail: updatedProfile }));
      return updatedProfile;
    } catch {
      const fallbackUpdatedProfile = {
        ...fallbackProfile,
        firstName: data.firstName || fallbackProfile.firstName,
        lastName: data.lastName || fallbackProfile.lastName,
        bio: data.bio ?? fallbackProfile.bio,
        company: data.company ?? fallbackProfile.company,
      };
      writeStoredProfile(fallbackUpdatedProfile);
      window.dispatchEvent(new CustomEvent('aether-profile-updated', { detail: fallbackUpdatedProfile }));
      return fallbackUpdatedProfile;
    }
  },
};
