import { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
  const { notifications, settings, addNotification, markAsRead, clearAll, updateSettings } =
    useNotificationStore();

  useEffect(() => {
    if (settings.enableDesktopNotifications) {
      void notificationService.requestPermission();
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
