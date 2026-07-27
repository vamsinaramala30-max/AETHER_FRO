// frontend/src/settings/notifications/NotificationPreferences.tsx
import React, { useState } from 'react';
import { NotificationPreferencesData, notificationService } from './notificationservice';

interface NotificationPreferencesProps {
  initialData: NotificationPreferencesData;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  initialData,
}) => {
  const [prefs, setPrefs] = useState<NotificationPreferencesData>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key: keyof NotificationPreferencesData) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setIsSaving(true);
    void (async () => {
      try {
        await notificationService.updatePreferences(updated);
      } catch {
        setPrefs(prefs); // Revert state on network error safely
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const renderToggle = (
    key: keyof NotificationPreferencesData,
    title: string,
    description: string,
  ) => (
    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="pr-4">
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          handleToggle(key);
        }}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${prefs[key] ? 'bg-indigo-600' : 'bg-slate-700'}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prefs[key] ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );

  return (
    <div className="relative max-w-2xl space-y-4">
      {isSaving && (
        <div className="absolute right-0 top-0 rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
          Syncing settings...
        </div>
      )}
      {renderToggle(
        'emailAlerts',
        'Critical Operations Alerts',
        'Immediate dispatches via email on runtime interruptions.',
      )}
      {renderToggle(
        'securityAlerts',
        'Security Verification Records',
        'Notification alerts regarding authentication updates and IP authorization alterations.',
      )}
      {renderToggle(
        'systemUpdates',
        'Core System Engine Changes',
        'Summarized reports documenting functional updates to the Aether client base.',
      )}
      {renderToggle(
        'weeklyDigest',
        'Performance Optimization Summaries',
        'Aggregated runtime charts delivered at weekly milestones.',
      )}
    </div>
  );
};
