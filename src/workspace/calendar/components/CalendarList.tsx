import React from 'react';
import { useCalendar } from '../hooks/useCalendar';

export const CalendarList: React.FC = () => {
  const { calendars, selectedCalendarIds, toggleCalendarVisibility } = useCalendar();

  return (
    <div style={{ marginTop: '16px' }}>
      <div className="cal-list-label">My Calendars</div>
      {calendars.map((cal) => {
        const isChecked = selectedCalendarIds.includes(cal.id);
        return (
          <label key={cal.id} className="cal-list-item">
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
                flexShrink: 0,
              }}
            />
            {cal.title}
          </label>
        );
      })}
    </div>
  );
};
