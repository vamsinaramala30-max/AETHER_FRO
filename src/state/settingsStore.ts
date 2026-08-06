import { create } from 'zustand';
import { settingsApi } from '@/api/settings.api';

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  defaultAIModel: string;
  language?: string;
  timezone?: string;
}

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (partial: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  settings: {
    theme: 'dark',
    emailNotifications: true,
    defaultAIModel: 'aether-core-v1',
    language: 'en',
    timezone: 'UTC',
  },
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await settingsApi.getProfile();
      set({
        settings: {
          theme: data.theme || 'dark',
          emailNotifications: true,
          defaultAIModel: 'aether-core-v1',
        },
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  updateSettings: async (partial) => {
    const current = get().settings;
    const updated = { ...current, ...partial };
    set({ settings: updated, isLoading: true });

    try {
      await settingsApi.updateProfile({
        theme: updated.theme,
      });
      set({ isLoading: false, error: null });
    } catch (err) {
      set({
        settings: current,
        error: err instanceof Error ? err.message : 'Failed to save settings',
        isLoading: false,
      });
    }
  },
}));
