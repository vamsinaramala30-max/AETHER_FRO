import React from 'react';
import { calculateEventPositions } from '../utils/calendarUtils';
import { CalendarEvent } from '../types/event';
import { EventCard } from './EventCard';
import { useEventStore } from '../store/eventStore';

interface CalendarGridProps {
  days: Date[];
  events: CalendarEvent[];
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ days, events }) => {
  const { openEventDetails } = useEventStore();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div style={{ display: 'flex', flex: 1, overflowY: 'auto', position: 'relative' }}>
      {/* Time column */}
      <div style={{ width: '60px', borderRight: '1px solid #dadce0' }}>
        {hours.map((hour) => (
          <div
            key={hour}
            style={{
              height: '48px',
              fontSize: '10px',
              color: '#5f6368',
              textAlign: 'right',
              paddingRight: '4px',
            }}
          >
            {hour === 0 ? '' : `${String(hour)}:00`}
          </div>
        ))}
      </div>

      {/* Day columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${String(days.length)}, 1fr)`,
          flex: 1,
          position: 'relative',
        }}
      >
        {days.map((day) => {
          const dayEvents = events.filter((e) => {
            const eStart = new Date(e.start);
            return (
              eStart.getFullYear() === day.getFullYear() &&
              eStart.getMonth() === day.getMonth() &&
              eStart.getDate() === day.getDate()
            );
          });

          const positioned = calculateEventPositions(dayEvents);

          return (
            <div
              key={day.toISOString()}
              style={{ borderRight: '1px solid #dadce0', position: 'relative' }}
            >
              {hours.map((hour) => (
                <div key={hour} style={{ height: '48px', borderBottom: '1px solid #f1f3f4' }} />
              ))}

              {positioned.map(({ event, topPercent, heightPercent, leftPercent, widthPercent }) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => {
                    openEventDetails(event);
                  }}
                  style={{
                    top: `${String(topPercent)}%`,
                    height: `${String(heightPercent)}%`,
                    left: `${String(leftPercent)}%`,
                    width: `${String(widthPercent)}%`,
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
