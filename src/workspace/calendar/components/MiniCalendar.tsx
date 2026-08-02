import React from 'react';
import { getMonthGrid, isSameDay, isToday } from '../utils/dateUtils';
import { useCalendar } from '../hooks/useCalendar';

export const MiniCalendar: React.FC = () => {
  const { viewState, setCurrentDate } = useCalendar();
  const currentDate = new Date(viewState.currentDate);

  const grid = getMonthGrid(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <div style={{ padding: '8px', fontSize: '12px' }}>
      <div
        style={{
          fontWeight: '600',
          marginBottom: '8px',
          textAlign: 'center',
          color: 'var(--cal-text-primary)',
        }}
      >
        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '2px',
          textTransform: 'uppercase',
        }}
        className="cal-mini-header-label"
      >
        <span>S</span>
        <span>M</span>
        <span>T</span>
        <span>W</span>
        <span>T</span>
        <span>F</span>
        <span>S</span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '2px',
          marginTop: '4px',
        }}
      >
        {grid.flatMap((week) =>
          week.map((day) => {
            const isSelected = isSameDay(day, currentDate);
            const activeToday = isToday(day);

            const btnClass = [
              'cal-mini-day-btn',
              isSelected ? 'selected' : activeToday ? 'today' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={day.toISOString()}
                type="button"
                className={btnClass}
                onClick={() => {
                  setCurrentDate(day.toISOString().split('T')[0]);
                }}
              >
                {day.getDate()}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
};
