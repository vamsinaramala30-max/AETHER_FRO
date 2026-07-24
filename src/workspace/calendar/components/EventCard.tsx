import React from 'react';
import { CalendarEvent } from '../types/event';
import { format12HourTime } from '../utils/dateUtils';

interface EventCardProps {
  event: CalendarEvent;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, style, onClick }) => {
  const startTimeStr = format12HourTime(new Date(event.start));
  const endTimeStr = format12HourTime(new Date(event.end));

  return (
    <div
      className="event-card"
      onClick={onClick}
      style={{
        backgroundColor: event.color || '#039be5',
        ...style,
      }}
    >
      <div className="event-card-title">{event.title}</div>
      {!event.isAllDay && (
        <div className="event-card-time">
          {startTimeStr} - {endTimeStr}
        </div>
      )}
    </div>
  );
};