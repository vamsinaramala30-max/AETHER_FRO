import { create } from 'zustand';
import { CalendarNotification, NotificationSettings } from '../types/notification';

interface NotificationState {
  notifications: CalendarNotification[];
  settings: NotificationSettings;
  
  // Actions
  addNotification: (notification: CalendarNotification) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  settings: {
    enableDesktopNotifications: true,
    enableEmailNotifications: true,
    enableSoundAlerts: true,
    defaultReminderMinutes: 10,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  },

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
  })),

  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
  })),

  clearAll: () => set({ notifications: [] }),

  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings },
  })),
}));