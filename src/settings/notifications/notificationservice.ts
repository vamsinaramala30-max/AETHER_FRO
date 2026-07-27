// frontend/src/settings/notifications/notificationService.ts
import { api } from '../../shared/api';

export interface NotificationPreferencesData {
  emailAlerts: boolean;
  securityAlerts: boolean;
  systemUpdates: boolean;
  weeklyDigest: boolean;
}

export const notificationService = {
  getPreferences: async (): Promise<NotificationPreferencesData> => {
    const response = await api.get<NotificationPreferencesData>('/user/settings/notifications');
    return response.data;
  },

  updatePreferences: async (
    prefs: NotificationPreferencesData,
  ): Promise<NotificationPreferencesData> => {
    const response = await api.put<NotificationPreferencesData>(
      '/user/settings/notifications',
      prefs,
    );
    return response.data;
  },
};
