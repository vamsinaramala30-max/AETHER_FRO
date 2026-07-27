// frontend/src/settings/notifications/NotificationsPage.tsx
import React, { useEffect, useState } from 'react';
import { NotificationPreferences } from './notificationperferences';
import { notificationService, NotificationPreferencesData } from './notificationservice';

export const NotificationsPage: React.FC = () => {
  const [data, setData] = useState<NotificationPreferencesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationService
      .getPreferences()
      .then((res) => {
        setData(res);
      })
      .catch(() => {
        setData({
          emailAlerts: true,
          securityAlerts: true,
          systemUpdates: false,
          weeklyDigest: false,
        });
      }) // Isolated fallback safe execution
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">Notification Channels</h2>
        <p className="mt-1 text-sm text-slate-400">
          Configure event notifications and transmission infrastructure bounds.
        </p>
      </div>
      <hr className="border-slate-800" />
      {loading ? (
        <div className="animate-pulse text-sm text-slate-400">
          Loading messaging configuration framework...
        </div>
      ) : (
        data && <NotificationPreferences initialData={data} />
      )}
    </div>
  );
};
