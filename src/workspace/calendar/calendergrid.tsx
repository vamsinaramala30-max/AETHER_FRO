// frontend/src/workspace/calendar/CalendarGrid.tsx
import React from 'react';
import { CalendarEventData } from './calendarService';
import { CalendarEvent } from './CalendarEvent';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEventData[];
  onSelectDay: (date: Date) => void;
  onSelectEvent: (event: CalendarEventData) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  events,
  onSelectDay,
  onSelectEvent
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray: (Date | null)[] = [];
  
  // Padding for leading empty slots matching grid configuration
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }

  // Active dates allocation
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(new Date(year, month, d));
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const getEventsForDay = (date: Date) => {
    return events.filter(e => {
      const eventDate = new Date(e.startTime);
      return isSameDay(eventDate, date);
    });
  };

  return (
    <div className="w-full flex flex-col border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/40 backdrop-blur-md">
      {/* Weekday headers layout */}
      <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-900/60 text-center py-2.5">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Primary Month Calendar Matrix */}
      <div className="grid grid-cols-7 grid-rows-5 auto-rows-fr bg-slate-950/20 divide-x divide-y divide-slate-800/60 border-l border-t border-slate-800/60">
        {daysArray.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="bg-slate-900/10 min-h-[90px] sm:min-h-[120px]" />;
          }

          const dayEvents = getEventsForDay(date);
          const currentIsToday = isSameDay(date, today);

          return (
            <div
              key={date.toISOString()}
              onClick={() => { onSelectDay(date); }}
              className="min-h-[90px] sm:min-h-[120px] p-2 hover:bg-slate-800/20 transition-colors cursor-pointer flex flex-col justify-between group relative"
            >
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`text-xs font-semibold font-mono w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                    currentIsToday
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {date.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[10px] font-medium text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded-md sm:hidden">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Event Stack Layer for Desktop/Tablet Viewports */}
              <div className="hidden sm:flex flex-col gap-1 flex-1 overflow-y-auto no-scrollbar max-h-[85px]">
                {dayEvents.map((event) => (
                  <CalendarEvent key={event.id} event={event} onClick={onSelectEvent} />
                ))}
              </div>

              {/* Indicative mobile micro-dots view */}
              <div className="flex sm:hidden flex-row gap-0.5 mt-auto flex-wrap justify-center">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: event.color || '#3b82f6' }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};