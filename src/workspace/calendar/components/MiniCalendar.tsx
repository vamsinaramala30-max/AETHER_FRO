import React from 'react';
import { getMonthGrid, isSameDay, isToday } from '../utils/dateUtils';
import { useCalendar } from '../hooks/useCalendar';

export const MiniCalendar: React.FC = () => {
  const { viewState, setCurrentDate } = useCalendar();
  const currentDate = new Date(viewState.currentDate);

  const grid = getMonthGrid(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <div style={{ padding: '8px', fontSize: '12px' }}>
      <div style={{ fontWeight: '600', marginBottom: '8px', textAlign: 'center' }}>
        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textTransform: 'uppercase', color: '#5f6368' }}>
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginTop: '4px' }}>
        {grid.flatMap((week) =>
          week.map((day) => {
            const isSelected = isSameDay(day, currentDate);
            const activeToday = isToday(day);

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setCurrentDate(day.toISOString().split('T')[0])}
                style={{
                  border: 'none',
                  background: isSelected ? '#1a73e8' : activeToday ? '#e8f0fe' : 'none',
                  color: isSelected ? '#fff' : activeToday ? '#1a73e8' : '#202124',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  margin: 'auto',
                }}
              >
                {day.getDate()}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};