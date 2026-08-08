import React, { useEffect, useState } from 'react';
import { NotificationPreferences } from './notificationperferences';
import { notificationService, NotificationPreferencesData } from './notificationservice';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Bell } from 'lucide-react';

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
          pushNotifications: true,
          browserNotifications: true,
          workspaceNotifications: true,
          projectNotifications: true,
          mentionNotifications: true,
          automationNotifications: true,
          securityAlerts: true,
          systemUpdates: false,
          weeklyDigest: false,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
          <Bell className="h-7 w-7 shrink-0 text-amber-500 dark:text-amber-400" />
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Notification Preferences
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configure event notifications and transmission infrastructure bounds.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Loading notification preferences...
          </div>
        ) : (
          data && <NotificationPreferences initialData={data} />
        )}
      </div>
    </PageWrapper>
  );
};
