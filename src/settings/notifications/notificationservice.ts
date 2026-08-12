import { api } from '../../shared/api';

export interface NotificationPreferencesData {
  emailAlerts: boolean;
  inAppNotifications: boolean;
  pushNotifications: boolean;
  browserNotifications: boolean;
  workspaceNotifications: boolean;
  projectNotifications: boolean;
  mentionNotifications: boolean;
  automationNotifications: boolean;
  securityAlerts: boolean;
  systemUpdates: boolean;
  weeklyDigest: boolean;
}

export const notificationService = {
  getPreferences: async (): Promise<NotificationPreferencesData> => {
    try {
      const response = await api.get<any>('/settings/notifications');
      if (response.data?.data) return response.data.data;
      if (response.data) return response.data;
    } catch {
      // Fallback if network offline
    }

    const stored = localStorage.getItem('aether_notification_prefs');
    if (stored) return JSON.parse(stored);

    return {
      emailAlerts: true,
      inAppNotifications: true,
      pushNotifications: true,
      browserNotifications: true,
      workspaceNotifications: true,
      projectNotifications: true,
      mentionNotifications: true,
      automationNotifications: true,
      securityAlerts: true,
      systemUpdates: true,
      weeklyDigest: false,
    };
  },

  updatePreferences: async (
    prefs: Partial<NotificationPreferencesData>,
  ): Promise<NotificationPreferencesData> => {
    const response = await api.patch<any>('/settings/notifications', prefs);
    const updated = response.data?.data || response.data;
    localStorage.setItem('aether_notification_prefs', JSON.stringify(updated));
    return updated;
  },
};
