import { create } from 'zustand';
import { apiClient } from '../api/client';

export interface Notification {
  id: string;
  type:
    | 'ai'
    | 'project'
    | 'calendar'
    | 'automation'
    | 'system'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  title: string;
  description: string;
  time: string;
  read: boolean;
  createdAt: string;
  link?: string;
  metadata?: Record<string, any>;
}

export interface NotificationInput {
  title: string;
  description?: string;
  message?: string;
  type?: Notification['type'];
  link?: string;
  metadata?: Record<string, any>;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  fetchNotifications: () => Promise<void>;
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

import { socketClient } from '../lib/socketClient';

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

  fetchNotifications: async () => {
    try {
      const res = await apiClient.get<any>('/notifications');
      const payload = res?.data || res;
      const items = Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload)
          ? payload
          : [];
      if (Array.isArray(items) && items.length > 0) {
        const mapped: Notification[] = items.map((item: any) => ({
          id: item.id || `notif_${Date.now()}`,
          type: (item.type?.toLowerCase() as Notification['type']) || 'system',
          title: item.title || 'Notification',
          description: item.message || item.description || '',
          time: item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Just now',
          read: Boolean(item.isRead ?? item.read),
          createdAt: item.createdAt || new Date().toISOString(),
          link: item.link || item.url || item.metadata?.link || item.metadata?.url || undefined,
          metadata: item.metadata || undefined,
        }));
        saveNotifications(mapped);
        set({
          notifications: mapped,
          unreadCount: mapped.filter((n) => !n.read).length,
        });
      }
    } catch {
      // Keep existing
    }
  },

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
        link: notif.link || notif.metadata?.link || undefined,
        metadata: notif.metadata || undefined,
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
    try {
      void apiClient.patch(`/notifications/${id}/read`).catch(() => {});
    } catch {
      // Ignore
    }
    set((state) => {
      const updated = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveNotifications(updated);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  markAllAsRead: () => {
    try {
      void apiClient.patch('/notifications/read-all').catch(() => {});
    } catch {
      // Ignore
    }
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
    try {
      void apiClient.delete(`/notifications/${id}`).catch(() => {});
    } catch {
      // Ignore
    }
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
    try {
      void apiClient.delete('/notifications/clear-all').catch(() => {});
    } catch {
      // Ignore
    }
    saveNotifications([]);
    set({
      notifications: [],
      unreadCount: 0,
    });
  },
}));

// Setup automatic realtime listener for notifications
if (typeof window !== 'undefined') {
  const handleIncomingNotification = (notifData: any) => {
    if (!notifData) return;
    const store = useNotificationStore.getState();
    const existing = store.notifications.find((n) => n.id === notifData.id);
    if (existing) return;

    const newNotif: Notification = {
      id: notifData.id || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: (notifData.type?.toLowerCase() as Notification['type']) || 'system',
      title: notifData.title || 'Notification',
      description: notifData.message || notifData.description || '',
      time: 'Just now',
      read: false,
      createdAt: notifData.createdAt || new Date().toISOString(),
      link: notifData.link || notifData.url || notifData.metadata?.link || notifData.metadata?.url || undefined,
      metadata: notifData.metadata || undefined,
    };

    const updated = [newNotif, ...store.notifications];
    saveNotifications(updated);
    useNotificationStore.setState({
      notifications: updated,
      unreadCount: updated.filter((n) => !n.read).length,
    });
  };

  socketClient.on('notification:new', handleIncomingNotification);
  socketClient.on('notification:created', handleIncomingNotification);
}

