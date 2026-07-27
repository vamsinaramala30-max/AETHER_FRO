import React from 'react';
import { CalendarEvent as IEvent } from '../types/event';

export const CalendarEvent: React.FC<{ event: IEvent }> = ({ event }) => {
  const bgColor =
    typeof event.color === 'string' && event.color.trim() !== '' ? event.color : '#039be5';

  return (
    <div
      style={{
        padding: '2px 4px',
        fontSize: '11px',
        borderRadius: '2px',
        backgroundColor: bgColor,
        color: '#fff',
      }}
    >
      {event.title}
    </div>
  );
};
