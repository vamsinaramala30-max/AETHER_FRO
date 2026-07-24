import React from 'react';
import { RecurrenceRule, RecurrenceFrequency } from '../types/recurrence';

interface RecurringEventEditorProps {
  rule?: RecurrenceRule;
  onChange: (rule: RecurrenceRule | undefined) => void;
}

export const RecurringEventEditor: React.FC<RecurringEventEditorProps> = ({ rule, onChange }) => {
  const isRecurring = Boolean(rule);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onChange({ freq: 'WEEKLY', interval: 1 });
    } else {
      onChange(undefined);
    }
  };

  const handleFreqChange = (freq: RecurrenceFrequency) => {
    if (!rule) return;
    onChange({ ...rule, freq });
  };

  return (
    <div style={{ marginTop: '12px', padding: '8px 0' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
        <input type="checkbox" checked={isRecurring} onChange={handleToggle} />
        Repeat event
      </label>

      {isRecurring && rule && (
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px' }}>Every</span>
          <input
            type="number"
            min={1}
            value={rule.interval || 1}
            onChange={(e) => onChange({ ...rule, interval: parseInt(e.target.value) || 1 })}
            style={{ width: '50px', padding: '4px', border: '1px solid #dadce0', borderRadius: '4px' }}
          />
          <select
            value={rule.freq}
            onChange={(e) => handleFreqChange(e.target.value as RecurrenceFrequency)}
            style={{ padding: '4px 8px', border: '1px solid #dadce0', borderRadius: '4px' }}
          >
            <option value="DAILY">Day(s)</option>
            <option value="WEEKLY">Week(s)</option>
            <option value="MONTHLY">Month(s)</option>
            <option value="YEARLY">Year(s)</option>
          </select>
        </div>
      )}
    </div>
  );
};