import React from 'react';
import { EventReminder as IReminder } from '../types/reminder';
import { DEFAULT_REMINDER_OPTIONS } from '../utils/constants';
import { Bell, Plus, X } from 'lucide-react';

interface EventReminderProps {
  reminders: IReminder[];
  onAddReminder: (reminder: IReminder) => void;
  onUpdateReminder?: (id: string, minutesBefore: number) => void;
  onRemoveReminder: (id: string) => void;
}

export const EventReminder: React.FC<EventReminderProps> = ({
  reminders,
  onAddReminder,
  onUpdateReminder,
  onRemoveReminder,
}) => {
  const handleAdd = () => {
    const newRem: IReminder = {
      id: `rem_${String(Date.now())}`,
      method: 'popup',
      minutesBefore: 10,
    };
    onAddReminder(newRem);
  };

  return (
    <div className="mt-4 space-y-2">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <Bell className="h-3.5 w-3.5 text-indigo-500" />
        Reminders & Notifications
      </label>

      {reminders.length > 0 && (
        <div className="space-y-2">
          {reminders.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-2 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Notification
              </span>
              <select
                value={r.minutesBefore}
                onChange={(e) => {
                  const minutes = Number(e.target.value);
                  if (onUpdateReminder) {
                    onUpdateReminder(r.id, minutes);
                  }
                }}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {DEFAULT_REMINDER_OPTIONS.map((opt) => (
                  <option key={opt.minutes} value={opt.minutes}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => onRemoveReminder(r.id)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                title="Remove reminder"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        <Plus className="h-3.5 w-3.5" />
        Add notification
      </button>
    </div>
  );
};
