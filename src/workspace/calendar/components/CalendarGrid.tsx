import React from 'react';
import { CalendarEvent } from '../types/event';
import { EventCard } from './EventCard';
import { useEventStore } from '../store/eventStore';

interface CalendarGridProps {
  days: Date[];
  events: CalendarEvent[];
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ days, events }) => {
  const { openEventDetails } = useEventStore();

  const hourLabels = [
    '8 AM',
    '9 AM',
    '10 AM',
    '11 AM',
    '12 PM',
    '1 PM',
    '2 PM',
    '3 PM',
    '4 PM',
    '5 PM',
    '6 PM',
    '7 PM',
    '8 PM',
  ];

  const getEventStyle = (event: CalendarEvent) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    const startHour = startDate.getUTCHours() + startDate.getUTCMinutes() / 60;
    const endHour = endDate.getUTCHours() + endDate.getUTCMinutes() / 60;

    const baseHour = 8;
    const totalSlotHours = 13;

    const topPercent = Math.max(0, ((startHour - baseHour) / totalSlotHours) * 100);
    const heightPercent = Math.max(3, ((endHour - startHour) / totalSlotHours) * 100);

    return {
      top: `${topPercent}%`,
      height: `${heightPercent}%`,
      left: '4px',
      right: '4px',
      width: 'calc(100% - 8px)',
    };
  };

  const allDayEvents = events.filter((e) => e.isAllDay);
  const timedEvents = events.filter((e) => !e.isAllDay);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        backgroundColor: 'var(--cal-bg-secondary)',
        color: 'var(--cal-text-primary)',
        overflow: 'hidden',
      }}
    >
      {/* Header bar: Day Columns */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--cal-border-color)',
          backgroundColor: 'var(--cal-bg-elevated)',
          paddingRight: '15px',
          flexShrink: 0,
        }}
      >
        {/* Empty corner cell */}
        <div
          style={{
            width: '65px',
            minWidth: '65px',
            borderRight: '1px solid var(--cal-border-color)',
          }}
        />

        {/* Days Header */}
        <div
          style={{ display: 'grid', gridTemplateColumns: `repeat(${days.length}, 1fr)`, flex: 1 }}
        >
          {days.map((day, idx) => {
            const dayNum = day.getDate();
            const dayName = day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
            const isSelectedSun = dayNum === 2;

            return (
              <div
                key={idx}
                style={{
                  padding: '12px 4px',
                  textAlign: 'center',
                  borderRight: '1px solid var(--cal-border-color)',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--cal-text-secondary)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {dayName}
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    marginTop: '4px',
                    fontSize: '15px',
                    fontWeight: '700',
                    backgroundColor: isSelectedSun ? 'var(--cal-accent-color)' : 'transparent',
                    color: isSelectedSun ? '#ffffff' : 'var(--cal-text-primary)',
                  }}
                >
                  {dayNum}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All-Day Events Section */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--cal-border-color)',
          backgroundColor: 'var(--cal-bg-primary)',
          minHeight: '44px',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '65px',
            minWidth: '65px',
            padding: '0 8px',
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--cal-text-secondary)',
            borderRight: '1px solid var(--cal-border-color)',
          }}
        >
          All-day
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${days.length}, 1fr)`,
            flex: 1,
            padding: '4px 0',
          }}
        >
          {days.map((day, dIdx) => {
            const dayDateStr = day.toISOString().split('T')[0];
            const matchingAllDay = allDayEvents.filter((e) => e.start.startsWith(dayDateStr));

            return (
              <div
                key={dIdx}
                style={{
                  padding: '0 4px',
                  borderRight: '1px solid var(--cal-border-color)',
                  minHeight: '32px',
                }}
              >
                {matchingAllDay.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => openEventDetails(e)}
                    style={{
                      backgroundColor: e.color || '#059669',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    }}
                  >
                    {e.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Hourly Grid with Scroll */}
      <div style={{ display: 'flex', flex: 1, overflowY: 'auto', position: 'relative' }}>
        {/* Time Labels Gutter */}
        <div
          style={{
            width: '65px',
            minWidth: '65px',
            borderRight: '1px solid var(--cal-border-color)',
            backgroundColor: 'var(--cal-bg-elevated)',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          {hourLabels.map((lbl, hIdx) => {
            const is12PM = lbl === '12 PM';
            return (
              <div
                key={hIdx}
                style={{
                  height: '56px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: is12PM ? '#ef4444' : 'var(--cal-text-secondary)',
                  textAlign: 'right',
                  paddingRight: '10px',
                  boxSizing: 'border-box',
                  transform: 'translateY(-6px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '4px',
                }}
              >
                {is12PM && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      display: 'inline-block',
                    }}
                  />
                )}
                <span>{lbl}</span>
              </div>
            );
          })}
        </div>

        {/* 7 Day Columns Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${days.length}, 1fr)`,
            flex: 1,
            position: 'relative',
            height: `${hourLabels.length * 56}px`,
          }}
        >
          {/* Background Horizontal Slot Lines */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
            }}
          >
            {hourLabels.map((_, hIdx) => (
              <div
                key={hIdx}
                style={{
                  height: '56px',
                  borderBottom: '1px solid var(--cal-border-color)',
                  boxSizing: 'border-box',
                }}
              />
            ))}
          </div>

          {/* Red Current Time Line Across 12 PM */}
          <div
            style={{
              position: 'absolute',
              top: `${(4 / 13) * 100}%`,
              left: 0,
              right: 0,
              height: '2px',
              backgroundColor: '#ef4444',
              zIndex: 10,
              pointerEvents: 'none',
              boxShadow: '0 0 6px rgba(239, 68, 68, 0.8)',
            }}
          />

          {/* Day Columns for Events */}
          {days.map((day, dIdx) => {
            const dayDateStr = day.toISOString().split('T')[0];
            const dayTimedEvents = timedEvents.filter((e) => e.start.startsWith(dayDateStr));

            return (
              <div
                key={dIdx}
                style={{
                  borderRight: '1px solid var(--cal-border-color)',
                  position: 'relative',
                  height: '100%',
                }}
              >
                {dayTimedEvents.map((e) => (
                  <EventCard
                    key={e.id}
                    event={e}
                    onClick={() => openEventDetails(e)}
                    style={getEventStyle(e)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
