import React, { useEffect, useState } from 'react';
import { NotificationItem, fetchNotifications, markNotificationAsRead } from './notificationsService';
import { NotificationCard } from './NotificationCard';

export const Notifications: React.FC = () => {
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    fetchNotifications().then(setItems);
  }, []);

  const handleDismiss = (id: string) => {
    markNotificationAsRead(id).then(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    });
  };

  return (
    <section className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Notifications ({items.length})</h3>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <NotificationCard key={item.id} notification={item} onDismiss={handleDismiss} />
        ))}
      </div>
    </section>
  );
};