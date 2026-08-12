import React, { useState } from 'react';
import { NotificationPreferencesData, notificationService } from './notificationservice';
import { Bell, Mail, ShieldAlert, Cpu, CheckCircle2, RefreshCw } from 'lucide-react';

interface NotificationPreferencesProps {
  initialData: NotificationPreferencesData;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  initialData,
}) => {
  const [prefs, setPrefs] = useState<NotificationPreferencesData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = (key: keyof NotificationPreferencesData) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setIsSaving(true);
    setSaveSuccess(false);

    notificationService
      .updatePreferences(updated)
      .then((saved) => {
        setPrefs(saved);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      })
      .catch(() => {
        setPrefs(prefs);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const renderToggleRow = (
    key: keyof NotificationPreferencesData,
    title: string,
    description: string,
  ) => (
    <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0 dark:border-slate-800/60">
      <div className="pr-4">
        <h5 className="text-xs font-bold text-slate-900 dark:text-white">{title}</h5>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => handleToggle(key)}
        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          prefs[key] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            prefs[key] ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Status */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/60">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Preferences sync automatically per authenticated user across all devices.
        </span>
        {isSaving && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Saving...
          </span>
        )}
        {saveSuccess && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Saved to DB
          </span>
        )}
      </div>

      {/* Global Channel Master Toggles */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h4 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Delivery Channels</h4>
        <div className="space-y-1">
          {renderToggleRow('emailAlerts', 'Email Delivery Channel', 'Receive email dispatches via Resend service.')}
          {renderToggleRow('inAppNotifications', 'In-App Alerts', 'Receive real-time notifications in AETHER header & sidebar.')}
          {renderToggleRow('browserNotifications', 'Browser Notifications', 'Display desktop notification banners when tab is active.')}
        </div>
      </div>

      {/* AETHER Activity Category */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">AETHER Activity Notifications</h4>
        </div>
        <div className="space-y-1">
          {renderToggleRow('projectNotifications', 'Tasks & Projects', 'Task completions, status changes, and project milestone updates.')}
          {renderToggleRow('automationNotifications', 'Automations & AI Tasks', 'Automation execution finishes, workflow failures, and AI task reports.')}
        </div>
      </div>

      {/* Account Category */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Account & Security Notifications</h4>
        </div>
        <div className="space-y-1">
          {renderToggleRow('securityAlerts', 'Security Alerts', 'Password changes, new device logins, and authentication events.')}
          {renderToggleRow('workspaceNotifications', 'Connected Accounts & Org', 'Connected account additions, SSO modifications, and workspace changes.')}
        </div>
      </div>

      {/* Productivity & System Category */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Productivity & System Updates</h4>
        </div>
        <div className="space-y-1">
          {renderToggleRow('mentionNotifications', 'Upcoming Reminders & Daily Summary', 'Focus session completes and task due date alerts.')}
          {renderToggleRow('systemUpdates', 'Product Updates', 'New feature announcements and platform updates.')}
        </div>
      </div>
    </div>
  );
};
