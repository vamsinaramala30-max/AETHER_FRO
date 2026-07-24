import { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { NotificationService } from '../services/notificationService';

export const useNotifications = () => {
  const { notifications, settings, addNotification, markAsRead, clearAll, updateSettings } = useNotificationStore();

  useEffect(() => {
    if (settings.enableDesktopNotifications) {
      NotificationService.requestPermission();
    }
  }, [settings.enableDesktopNotifications]);

  return {
    notifications,
    settings,
    addNotification,
    markAsRead,
    clearAll,
    updateSettings,
  };
};