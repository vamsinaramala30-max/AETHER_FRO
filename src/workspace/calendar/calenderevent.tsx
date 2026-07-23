// frontend/src/workspace/calendar/CalendarEvent.tsx
import React from 'react';
import { CalendarEventData } from './calendarService';

interface CalendarEventProps {
  event: CalendarEventData;
  onClick: (event: CalendarEventData) => void;
}

export const CalendarEvent: React.FC<CalendarEventProps> = ({ event, onClick }) => {
  const start = new Date(event.startTime);
  const timeStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
      className="w-full text-left p-1.5 rounded text-xs font-medium border border-transparent hover:border-white/20 transition-all shadow-sm truncate flex flex-col items-start gap-0.5 active:scale-[0.98]"
      style={{
        backgroundColor: `${event.color || '#3b82f6'}25`,
        color: event.color || '#3b82f6',
        borderLeft: `3px solid ${event.color || '#3b82f6'}`
      }}
    >
      <span className="font-semibold text-[11px] text-white/90 truncate w-full">{event.title}</span>
      <span className="opacity-80 text-[10px] font-mono">{timeStr}</span>
    </button>
  );
};