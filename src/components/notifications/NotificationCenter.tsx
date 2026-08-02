import React, { useRef, useEffect } from 'react';
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
  Archive,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'ai' | 'project' | 'calendar' | 'automation' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const TYPE_ICON: Record<Notification['type'], React.ReactNode> = {
  ai: <MessageSquare className="h-3.5 w-3.5 text-purple-400" />,
  project: <FolderOpen className="h-3.5 w-3.5 text-blue-400" />,
  calendar: <Calendar className="h-3.5 w-3.5 text-indigo-400" />,
  automation: <Zap className="h-3.5 w-3.5 text-amber-400" />,
  system: <Info className="h-3.5 w-3.5 text-slate-400" />,
};

// Placeholder notifications — replace with real API
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'ai',
    title: 'AI completed your request',
    description: 'Architecture review analysis is ready',
    time: '2m ago',
    read: false,
  },
  {
    id: '2',
    type: 'project',
    title: 'Task assigned to you',
    description: 'Implement GlobalSearch — AETHER Frontend',
    time: '15m ago',
    read: false,
  },
  {
    id: '3',
    type: 'calendar',
    title: 'Upcoming meeting',
    description: 'Team standup in 30 minutes',
    time: '30m ago',
    read: false,
  },
  {
    id: '4',
    type: 'automation',
    title: 'Workflow completed',
    description: 'Daily report automation ran successfully',
    time: '2h ago',
    read: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'System update',
    description: 'New features available in the AI module',
    time: '1d ago',
    read: true,
  },
];

interface NotificationCenterProps {
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const dismiss = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const NotifRow = ({ n }: { n: Notification }) => (
    <div
      className={`group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-800/40 ${
        !n.read ? 'bg-slate-800/20' : ''
      }`}
    >
      <div
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
          n.read ? 'bg-slate-800/40' : 'bg-slate-700/50'
        }`}
      >
        {TYPE_ICON[n.type]}
      </div>
      <div className="min-w-0 flex-1" onClick={() => markRead(n.id)} role="button" tabIndex={0}>
        <p
          className={`truncate text-xs font-semibold ${n.read ? 'text-slate-400' : 'text-slate-200'}`}
        >
          {n.title}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-slate-500">{n.description}</p>
        <p className="mt-1 text-[10px] text-slate-600">{n.time}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!n.read && (
          <button
            type="button"
            onClick={() => markRead(n.id)}
            title="Mark as read"
            className="rounded p-1 text-slate-500 transition-colors hover:text-emerald-400"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => dismiss(n.id)}
          title="Dismiss"
          className="rounded p-1 text-slate-500 transition-colors hover:text-red-400"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />}
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[1040]" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Notifications"
        className="fixed right-4 top-16 z-[1050] w-80 md:right-6 md:top-6"
      >
        <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-[#111827] shadow-2xl shadow-black/60">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-200">Notifications</h2>
              {unread.length > 0 && (
                <span className="flex h-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                  {unread.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread.length > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="rounded px-2 py-1 text-[11px] text-slate-500 transition-colors hover:bg-slate-800/60 hover:text-indigo-400"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded p-1 text-slate-500 transition-colors hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[480px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Bell className="mb-3 h-8 w-8 text-slate-700" />
                <p className="text-sm text-slate-500">All caught up!</p>
                <p className="mt-1 text-xs text-slate-600">No new notifications</p>
              </div>
            ) : (
              <>
                {unread.length > 0 && (
                  <>
                    <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                      New
                    </p>
                    {unread.map((n) => (
                      <NotifRow key={n.id} n={n} />
                    ))}
                  </>
                )}
                {read.length > 0 && (
                  <>
                    <p className="mt-1 border-t border-slate-800/40 px-4 py-2 pt-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                      Earlier
                    </p>
                    {read.map((n) => (
                      <NotifRow key={n.id} n={n} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-800/60 px-4 py-2.5">
              <button
                type="button"
                onClick={() => setNotifications([])}
                className="flex items-center gap-1.5 text-[11px] text-slate-600 transition-colors hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
                Clear all
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 text-[11px] text-slate-600 transition-colors hover:text-slate-300"
              >
                <Archive className="h-3 w-3" />
                View archive
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;
