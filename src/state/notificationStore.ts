import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'ai' | 'project' | 'calendar' | 'automation' | 'system' | 'info' | 'success' | 'warning' | 'error';
  title: string;
  description: string;
  time: string;
  read: boolean;
  createdAt: string;
}

interface NotificationInput {
  title: string;
  description?: string;
  message?: string;
  type?: Notification['type'];
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  addNotification: (notif: NotificationInput) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

const STORAGE_KEY = 'aether_notifications';

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_welcome',
    type: 'system',
    title: 'Welcome to Aether OS',
    description: 'System initialization complete. Explore features and automation workflows.',
    time: 'Just now',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif_ai_ready',
    type: 'ai',
    title: 'AI Engine Active',
    description: 'Contextual AI assistance and automated agents are active and ready.',
    time: '5m ago',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

const loadInitialNotifications = (): Notification[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse error
  }
  return DEFAULT_NOTIFICATIONS;
};

const saveNotifications = (notifications: Notification[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {
    // Ignore storage save error
  }
};

const initial = loadInitialNotifications();

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: initial,
  unreadCount: initial.filter((n) => !n.read).length,

  addNotification: (notif) => {
    set((state) => {
      const newNotif: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: notif.type || 'system',
        title: notif.title,
        description: notif.description || notif.message || '',
        time: 'Just now',
        read: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [newNotif, ...state.notifications];
      saveNotifications(updated);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      saveNotifications(updated);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, read: true }));
      saveNotifications(updated);
      return {
        notifications: updated,
        unreadCount: 0,
      };
    });
  },

  dismissNotification: (id) => {
    set((state) => {
      const updated = state.notifications.filter((n) => n.id !== id);
      saveNotifications(updated);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  clearAll: () => {
    saveNotifications([]);
    set({
      notifications: [],
      unreadCount: 0,
    });
  },
}));

