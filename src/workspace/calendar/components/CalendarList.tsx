import React from 'react';
import { useCalendar } from '../hooks/useCalendar';

export const CalendarList: React.FC = () => {
  const { calendars, selectedCalendarIds, toggleCalendarVisibility } = useCalendar();

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: '600', color: '#5f6368', marginBottom: '8px' }}>
        My Calendars
      </div>
      {calendars.map((cal) => {
        const isChecked = selectedCalendarIds.includes(cal.id);
        return (
          <label
            key={cal.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 0',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => {
                toggleCalendarVisibility(cal.id);
              }}
              style={{ accentColor: cal.color }}
            />
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: cal.color,
                display: 'inline-block',
              }}
            />
            {cal.title}
          </label>
        );
      })}
    </div>
  );
};
