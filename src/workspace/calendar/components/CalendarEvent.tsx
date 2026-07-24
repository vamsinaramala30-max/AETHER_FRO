import React from 'react';
import { CalendarEvent as IEvent } from '../types/event';

export const CalendarEvent: React.FC<{ event: IEvent }> = ({ event }) => {
  return (
    <div style={{ padding: '2px 4px', fontSize: '11px', borderRadius: '2px', backgroundColor: event.color || '#039be5', color: '#fff' }}>
      {event.title}
    </div>
  );
};