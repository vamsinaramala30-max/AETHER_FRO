export interface NotificationPreferencesData {
  emailAlerts: boolean;
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
      const response = await fetch('/api/v1/notifications/preferences');
      const data = await response.json();
      if (data.data) return data.data;
    } catch {
      // Fallback local storage sync
    }
    const stored = localStorage.getItem('aether_notification_prefs');
    if (stored) return JSON.parse(stored);

    return {
      emailAlerts: true,
      pushNotifications: true,
      browserNotifications: true,
      workspaceNotifications: true,
      projectNotifications: true,
      mentionNotifications: true,
      automationNotifications: true,
      securityAlerts: true,
      systemUpdates: false,
      weeklyDigest: false,
    };
  },

  updatePreferences: async (
    prefs: NotificationPreferencesData,
  ): Promise<NotificationPreferencesData> => {
    localStorage.setItem('aether_notification_prefs', JSON.stringify(prefs));
    return prefs;
  },
};
