import React from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { useEvents } from '../hooks/useEvents';
import { getMonthGrid, isToday } from '../utils/dateUtils';
import { EventCard } from '../components/EventCard';
import { useEventStore } from '../store/eventStore';

export const MonthView: React.FC = () => {
  const { viewState } = useCalendar();
  const { openEventDetails } = useEventStore();
  const current = new Date(viewState.currentDate);

  const grid = getMonthGrid(current.getFullYear(), current.getMonth());
  const firstWeek = grid[0];
  const lastWeek = grid[grid.length - 1];
  const firstDay = firstWeek[0];
  const lastDay = lastWeek[lastWeek.length - 1];

  const { events } = useEvents(firstDay, lastDay);

  const dayHeaderNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Day header row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1px solid var(--cal-border-color)',
          backgroundColor: 'var(--cal-bg-primary)',
          flexShrink: 0,
        }}
      >
        {dayHeaderNames.map((dayName) => (
          <div
            key={dayName}
            style={{
              padding: '8px 4px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--cal-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              borderRight: '1px solid var(--cal-border-color)',
            }}
          >
            {dayName}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateRows: `repeat(${String(grid.length)}, 1fr)`,
          flex: 1,
        }}
      >
        {grid.map((week, weekIndex) => (
          <div key={weekIndex} className="cal-month-row">
            {week.map((day) => {
              const dayEvents = events.filter((e) => {
                const d = new Date(e.start);
                return (
                  d.getFullYear() === day.getFullYear() &&
                  d.getMonth() === day.getMonth() &&
                  d.getDate() === day.getDate()
                );
              });

              const activeToday = isToday(day);

              return (
                <div key={day.toISOString()} className="cal-month-cell">
                  <div className={`cal-day-number${activeToday ? 'today' : ''}`}>
                    {day.getDate()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {dayEvents.slice(0, 3).map((e) => (
                      <EventCard
                        key={e.id}
                        event={e}
                        onClick={() => {
                          openEventDetails(e);
                        }}
                        style={{ position: 'relative' }}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="cal-more-label">+{String(dayEvents.length - 3)} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
