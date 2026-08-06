import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  X,
  Bell,
  MessageSquare,
  FolderOpen,
  Calendar,
  Zap,
  Info,
  Check,
  Trash2,
} from 'lucide-react';
import { apiClient } from '@/api/client';

interface NotificationItem {
  id: string;
  type: 'ai' | 'project' | 'calendar' | 'automation' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const TYPE_ICON: Record<NotificationItem['type'], React.ReactNode> = {
  ai: <MessageSquare className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />,
  project: <FolderOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />,
  calendar: <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />,
  automation: <Zap className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />,
  system: <Info className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />,
};

interface NotificationCenterProps {
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<any>('/notifications');
      const items = Array.isArray(data) ? data : data?.data?.items || data?.items || [];
      if (Array.isArray(items)) {
        const mapped: NotificationItem[] = items.map((item: any) => ({
          id: item.id || `notif_${Date.now()}`,
          type: item.type || 'system',
          title: item.title || 'System Notification',
          description: item.message || item.description || '',
          time: item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Just now',
          read: Boolean(item.isRead || item.read),
        }));
        setNotifications(mapped);
        setLoading(false);
        return;
      }
    } catch {
      // Backend not returning notifications list, fallback to local storage
    }

    try {
      const stored = localStorage.getItem('aether_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        setNotifications([]);
      }
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  const saveToStorage = (updated: NotificationItem[]) => {
    setNotifications(updated);
    try {
      localStorage.setItem('aether_notifications', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveToStorage(updated);
  };

  const markRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveToStorage(updated);
    void apiClient.patch(`/notifications/${id}/read`).catch(() => {});
  };

  const dismiss = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveToStorage(updated);
    void apiClient.delete(`/notifications/${id}`).catch(() => {});
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[1040]" onClick={onClose} aria-hidden="true" />

      {/* Popover Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Notifications"
        className="fixed right-4 top-16 z-[1050] w-80 max-w-[90vw] md:right-6 md:top-16"
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h2>
              {unread.length > 0 && (
                <span className="flex h-5 items-center justify-center rounded-full bg-indigo-600 px-2 text-[10px] font-bold text-white shadow-sm">
                  {unread.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread.length > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <Bell className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  All caught up!
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  No new notifications at this time.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {unread.length > 0 && (
                  <div>
                    <p className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      New
                    </p>
                    {unread.map((n) => (
                      <div
                        key={n.id}
                        className="group flex items-start gap-3 bg-indigo-50/40 px-4 py-3 transition-colors hover:bg-indigo-50/80 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40"
                      >
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-800">
                          {TYPE_ICON[n.type] || <Info className="h-3.5 w-3.5 text-slate-400" />}
                        </div>
                        <div
                          className="min-w-0 flex-1 cursor-pointer"
                          onClick={() => markRead(n.id)}
                        >
                          <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                            {n.title}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            {n.description}
                          </p>
                          <p className="mt-1 text-[10px] font-semibold text-slate-400">
                            {n.time}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => markRead(n.id)}
                            title="Mark read"
                            className="rounded p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => dismiss(n.id)}
                            title="Dismiss"
                            className="rounded p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {read.length > 0 && (
                  <div>
                    <p className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Earlier
                    </p>
                    {read.map((n) => (
                      <div
                        key={n.id}
                        className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                          {TYPE_ICON[n.type] || <Info className="h-3.5 w-3.5 text-slate-400" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {n.title}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            {n.description}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">{n.time}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => dismiss(n.id)}
                          title="Dismiss"
                          className="rounded p-1 text-slate-400 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100 dark:hover:text-red-400"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/40">
              <button
                type="button"
                onClick={() => saveToStorage([])}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 transition-colors hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;
