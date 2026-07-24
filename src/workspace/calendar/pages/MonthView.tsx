import React from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { useEvents } from '../hooks/useEvents';
import { getMonthGrid } from '../utils/dateUtils';
import { EventCard } from '../components/EventCard';
import { useEventStore } from '../store/eventStore';

export const MonthView: React.FC = () => {
  const { viewState } = useCalendar();
  const { openEventDetails } = useEventStore();
  const current = new Date(viewState.currentDate);

  const grid = getMonthGrid(current.getFullYear(), current.getMonth());
  const firstDay = grid[0][0];
  const lastWeek = grid[grid.length - 1];
  const lastDay = lastWeek[lastWeek.length - 1];

  const { events } = useEvents(firstDay, lastDay);

  return (
    <div style={{ display: 'grid', gridTemplateRows: `repeat(${grid.length}, 1fr)`, flex: 1 }}>
      {grid.map((week, weekIndex) => (
        <div key={weekIndex} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #dadce0' }}>
          {week.map((day) => {
            const dayEvents = events.filter((e) => {
              const d = new Date(e.start);
              return d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate();
            });

            return (
              <div key={day.toISOString()} style={{ borderRight: '1px solid #dadce0', padding: '4px', overflow: 'hidden' }}>
                <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>{day.getDate()}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {dayEvents.slice(0, 3).map((e) => (
                    <EventCard key={e.id} event={e} onClick={() => openEventDetails(e)} style={{ position: 'relative' }} />
                  ))}
                  {dayEvents.length > 3 && (
                    <span style={{ fontSize: '10px', color: '#5f6368' }}>+{dayEvents.length - 3} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};