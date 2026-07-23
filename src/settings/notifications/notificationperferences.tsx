// frontend/src/settings/notifications/NotificationPreferences.tsx
import React, { useState } from 'react';
import { NotificationPreferencesData, notificationService } from './notificationService';

interface NotificationPreferencesProps {
  initialData: NotificationPreferencesData;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ initialData }) => {
  const [prefs, setPrefs] = useState<NotificationPreferencesData>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (key: keyof NotificationPreferencesData) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setIsSaving(true);
    try {
      await notificationService.updatePreferences(updated);
    } catch (err) {
      setPrefs(prefs); // Revert state on network error safely
    } finally {
      setIsSaving(false);
    }
  };

  const renderToggle = (key: keyof NotificationPreferencesData, title: string, description: string) => (
    <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg">
      <div className="pr-4">
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <button type="button" onClick={() => handleToggle(key)} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${prefs[key] ? 'bg-indigo-600' : 'bg-slate-700'}`}>
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prefs[key] ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-4 max-w-2xl relative">
      {isSaving && <div className="absolute top-0 right-0 text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Syncing settings...</div>}
      {renderToggle('emailAlerts', 'Critical Operations Alerts', 'Immediate dispatches via email on runtime interruptions.')}
      {renderToggle('securityAlerts', 'Security Verification Records', 'Notification alerts regarding authentication updates and IP authorization alterations.')}
      {renderToggle('systemUpdates', 'Core System Engine Changes', 'Summarized reports documenting functional updates to the Aether client base.')}
      {renderToggle('weeklyDigest', 'Performance Optimization Summaries', 'Aggregated runtime charts delivered at weekly milestones.')}
    </div>
  );
};