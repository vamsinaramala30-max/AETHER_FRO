import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { aiService } from '../services/aiService';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  read: boolean;
  priority?: 'high' | 'normal' | 'low';
}

export interface NotificationContextValue {
  notifications: ToastNotification[];
  unreadCount: number;
  urgentSummary: string | null;
  notify: (notification: Omit<ToastNotification, 'id' | 'read'>) => string;
  dismiss: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [urgentSummary, setUrgentSummary] = useState<string | null>(null);

  useEffect(() => {
    if (notifications.length > 0 && aiService.isAiEnabled()) {
      aiService
        .rankNotifications(notifications)
        .then((res) => {
          setUrgentSummary(res.urgentSummary);
        })
        .catch(() => {
          setUrgentSummary(null);
        });
    } else {
      setUrgentSummary(null);
    }
  }, [notifications]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (item: Omit<ToastNotification, 'id' | 'read'>): string => {
      const id = `notif_${String(Date.now())}_${Math.random().toString(36).substring(2, 7)}`;
      const newNotif: ToastNotification = { ...item, id, read: false };

      setNotifications((prev) => [newNotif, ...prev]);

      const duration = item.duration ?? 5000;
      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss],
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUrgentSummary(null);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount,
      urgentSummary,
      notify,
      dismiss,
      markAsRead,
      clearAll,
    }),
    [notifications, unreadCount, urgentSummary, notify, dismiss, markAsRead, clearAll],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotification = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
