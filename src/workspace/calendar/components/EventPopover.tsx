import React from 'react';
import { CalendarEvent } from '../types/event';

export const EventPopover: React.FC<{ event: CalendarEvent; onClose: () => void }> = ({ event, onClose }) => {
  return (
    <div style={{ position: 'absolute', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', padding: '12px', borderRadius: '4px', zIndex: 200 }}>
      <h4>{event.title}</h4>
      <p>{event.description}</p>
      <button type="button" onClick={onClose}>Close</button>
    </div>
  );
};