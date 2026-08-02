import React from 'react';
import { NotificationItem } from './notificationsService';

interface NotificationCardProps {
  notification: NotificationItem;
  onDismiss: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onDismiss }) => {
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-lg border p-3 ${
        notification.isRead
          ? 'border-slate-700/40 bg-slate-800/40 opacity-75'
          : 'border-indigo-500/30 bg-slate-800'
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white">{notification.title}</span>
          <span className="text-[10px] text-slate-500">{notification.createdAt}</span>
        </div>
        <p className="text-xs text-slate-300">{notification.message}</p>
      </div>

      <button
        onClick={() => onDismiss(notification.id)}
        className="px-1.5 py-0.5 text-xs font-bold text-slate-500 hover:text-slate-300"
      >
        ✕
      </button>
    </div>
  );
};
