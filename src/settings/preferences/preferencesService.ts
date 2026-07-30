// frontend/src/settings/preferences/preferencesService.ts
import { api } from '../../shared/api';

export interface UIPreferences {
  denseMode: boolean;
  autocompleteAI: boolean;
  telemetryLogging: boolean;
}

export const preferencesService = {
  getPreferences: async (): Promise<UIPreferences> => {
    const response = await api.get<UIPreferences>('/users/preferences');
    return response.data;
  },

  savePreference: async (key: keyof UIPreferences, value: boolean): Promise<void> => {
    await api.patch('/users/preferences', { [key]: value });
  },
};
