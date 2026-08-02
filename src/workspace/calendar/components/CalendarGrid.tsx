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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header bar showing day names and numbers */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--cal-border-color)',
          backgroundColor: 'var(--cal-bg-primary)',
          paddingRight: '15px' /* scrollbar gutter alignment */,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '60px',
            minWidth: '60px',
            borderRight: '1px solid var(--cal-border-color)',
          }}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${String(days.length)}, 1fr)`,
            flex: 1,
          }}
        >
          {days.map((day) => {
            const isTodayDate = day.toDateString() === new Date().toDateString();
            return (
              <div
                key={day.toISOString()}
                style={{
                  padding: '10px 4px',
                  textAlign: 'center',
                  borderRight: '1px solid var(--cal-border-color)',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: isTodayDate ? 'var(--cal-accent-color)' : 'var(--cal-text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    marginTop: '2px',
                    fontSize: '15px',
                    fontWeight: isTodayDate ? 700 : 500,
                    backgroundColor: isTodayDate ? 'var(--cal-accent-color)' : 'transparent',
                    color: isTodayDate ? '#ffffff' : 'var(--cal-text-primary)',
                  }}
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scrollable time grid */}
      <div style={{ display: 'flex', flex: 1, overflowY: 'auto', position: 'relative' }}>
        {/* Time column */}
        <div
          style={{
            width: '60px',
            minWidth: '60px',
            borderRight: '1px solid var(--cal-border-color)',
            flexShrink: 0,
          }}
        >
          {hours.map((hour) => (
            <div key={hour} className="cal-time-label">
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
                style={{ borderRight: '1px solid var(--cal-border-color)', position: 'relative' }}
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    style={{
                      height: '48px',
                      borderBottom: '1px solid var(--cal-border-color)',
                      opacity: 0.4,
                    }}
                  />
                ))}

                {positioned.map(
                  ({ event, topPercent, heightPercent, leftPercent, widthPercent }) => (
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
                  ),
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
