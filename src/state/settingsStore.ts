import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  defaultAIModel: string;
}

interface SettingsState {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        theme: 'system',
        emailNotifications: true,
        defaultAIModel: 'aether-core-v1',
      },
      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),
    }),
    {
      name: 'aether-settings-storage',
    },
  ),
);
