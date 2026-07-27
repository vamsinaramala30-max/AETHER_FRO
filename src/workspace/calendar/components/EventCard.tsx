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

  const bgColor =
    typeof event.color === 'string' && event.color.trim() !== '' ? event.color : '#039be5';

  return (
    <div
      className="event-card"
      onClick={onClick}
      style={{
        backgroundColor: bgColor,
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
