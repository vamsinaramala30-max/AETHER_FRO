import React from 'react';
import { EventReminder as IReminder } from '../types/reminder';
import { DEFAULT_REMINDER_OPTIONS } from '../utils/constants';

interface EventReminderProps {
  reminders: IReminder[];
  onAddReminder: (reminder: IReminder) => void;
  onRemoveReminder: (id: string) => void;
}

export const EventReminder: React.FC<EventReminderProps> = ({
  reminders,
  onAddReminder,
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
    <div style={{ marginTop: '12px' }}>
      <label style={{ fontSize: '13px', fontWeight: '500', color: '#3c4043' }}>Reminders</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
        {reminders.map((r) => (
          <div key={r.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#5f6368' }}>Notification</span>
            <select
              value={r.minutesBefore}
              onChange={() => {}}
              style={{
                padding: '4px',
                borderRadius: '4px',
                border: '1px solid #dadce0',
                fontSize: '12px',
              }}
            >
              {DEFAULT_REMINDER_OPTIONS.map((opt) => (
                <option key={opt.minutes} value={opt.minutes}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                onRemoveReminder(r.id);
              }}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#5f6368' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        style={{
          marginTop: '6px',
          background: 'none',
          border: 'none',
          color: '#1a73e8',
          fontSize: '12px',
          cursor: 'pointer',
          fontWeight: '500',
        }}
      >
        + Add notification
      </button>
    </div>
  );
};
