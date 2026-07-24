// frontend/src/settings/notifications/NotificationsPage.tsx
import React, { useEffect, useState } from 'react';
import { NotificationPreferences } from './notificationperferences';
import { notificationService, NotificationPreferencesData } from './notificationService';

export const NotificationsPage: React.FC = () => {
  const [data, setData] = useState<NotificationPreferencesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationService.getPreferences()
      .then((res) => { setData(res); })
      .catch(() => { setData({ emailAlerts: true, securityAlerts: true, systemUpdates: false, weeklyDigest: false }); }) // Isolated fallback safe execution
      .finally(() => { setLoading(false); });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Notification Channels</h2>
        <p className="text-sm text-slate-400 mt-1">Configure event notifications and transmission infrastructure bounds.</p>
      </div>
      <hr className="border-slate-800" />
      {loading ? (
        <div className="text-sm text-slate-400 animate-pulse">Loading messaging configuration framework...</div>
      ) : (
        data && <NotificationPreferences initialData={data} />
      )}
    </div>
  );
};