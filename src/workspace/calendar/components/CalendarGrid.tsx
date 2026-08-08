import React from 'react';
import { CalendarEvent } from '../types/event';
import { EventCard } from './EventCard';
import { useEventStore } from '../store/eventStore';
import { useCalendar } from '../hooks/useCalendar';
import { formatYMD } from '../utils/dateUtils';

interface CalendarGridProps {
  days: Date[];
  events: CalendarEvent[];
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ days, events }) => {
  const { openEventDetails, openEventForm } = useEventStore();
  const { viewState, setCurrentDate } = useCalendar();

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

    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const endHour = endDate.getHours() + endDate.getMinutes() / 60;

    const baseHour = 8;
    const totalSlotHours = 13;

    const topPercent = Math.max(0, ((startHour - baseHour) / totalSlotHours) * 100);
    const heightPercent = Math.max(4, ((endHour - startHour) / totalSlotHours) * 100);

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

  const selectedDateStr = viewState.currentDate;

  const handleSlotClick = (dayDate: Date, hourIndex: number) => {
    const dateStr = formatYMD(dayDate);

    const startHour = 8 + hourIndex;
    const timeStr = `${String(startHour).padStart(2, '0')}:00`;
    const endHour = startHour + 1;
    const endTimeStr = `${String(endHour).padStart(2, '0')}:00`;

    const startIso = `${dateStr}T${timeStr}:00.000Z`;
    const endIso = `${dateStr}T${endTimeStr}:00.000Z`;

    setCurrentDate(dateStr);
    openEventForm({
      start: startIso,
      end: endIso,
      isAllDay: false,
    });
  };

  const handleAllDaySlotClick = (dayDate: Date) => {
    const dateStr = formatYMD(dayDate);

    setCurrentDate(dateStr);
    openEventForm({
      start: `${dateStr}T00:00:00.000Z`,
      end: `${dateStr}T23:59:59.000Z`,
      isAllDay: true,
    });
  };

  return (
    <div className="flex flex-1 flex-col h-full w-full overflow-x-auto overflow-y-hidden bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex flex-col flex-1 h-full min-w-full" style={{ minWidth: days.length > 3 ? '680px' : '100%' }}>
        {/* Header Bar: Day Columns */}
        <div className="flex shrink-0 border-b border-slate-200 bg-slate-50/80 pr-2 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="w-12 sm:w-16 min-w-[48px] sm:min-w-[64px] border-r border-slate-200 dark:border-slate-800" />
          <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
            {days.map((day, idx) => {
              const dayNum = day.getDate();
              const dayName = day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
              const dayDateStr = formatYMD(day);
              const isSelected = dayDateStr === selectedDateStr;

              return (
                <div
                  key={idx}
                  onClick={() => setCurrentDate(dayDateStr)}
                  className="cursor-pointer border-r border-slate-200 py-2 sm:py-3 text-center transition-colors hover:bg-slate-100/60 dark:border-slate-800 dark:hover:bg-slate-800/80"
                >
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {dayName}
                  </div>
                  <div
                    className={`mx-auto mt-0.5 sm:mt-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs sm:text-sm font-extrabold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 dark:bg-indigo-500'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {dayNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All-Day Events Row */}
        <div className="flex shrink-0 min-h-[40px] sm:min-h-[44px] items-center border-b border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="w-12 sm:w-16 min-w-[48px] sm:min-w-[64px] border-r border-slate-200 px-1 sm:px-2 text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
            All-day
          </div>
          <div
            className="grid flex-1 py-1"
            style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}
          >
            {days.map((day, dIdx) => {
              const dayDateStr = formatYMD(day);
              const matchingAllDay = allDayEvents.filter((e) => e.start.startsWith(dayDateStr));

              return (
                <div
                  key={dIdx}
                  onClick={() => handleAllDaySlotClick(day)}
                  className="min-h-[32px] cursor-pointer border-r border-slate-200 px-1 transition-colors hover:bg-indigo-50/30 dark:border-slate-800 dark:hover:bg-indigo-950/20"
                >
                  {matchingAllDay.map((e) => (
                    <div
                      key={e.id}
                      onClick={(evt) => {
                        evt.stopPropagation();
                        openEventDetails(e);
                      }}
                      className="truncate rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 text-[11px] sm:text-xs font-semibold text-white shadow-sm"
                      style={{ backgroundColor: e.color || '#6366f1' }}
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
        <div className="relative flex flex-1 overflow-y-auto">
          {/* Time Labels Gutter */}
          <div className="relative w-12 sm:w-16 min-w-[48px] sm:min-w-[64px] shrink-0 border-r border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60">
            {hourLabels.map((lbl, hIdx) => (
              <div
                key={hIdx}
                className="flex h-14 items-center justify-end pr-1.5 sm:pr-2.5 text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-500"
              >
                {lbl}
              </div>
            ))}
          </div>

          {/* Day Columns Container */}
          <div
            className="relative grid flex-1"
            style={{
              gridTemplateColumns: `repeat(${days.length}, 1fr)`,
              height: `${hourLabels.length * 56}px`,
            }}
          >
          {/* Background Horizontal Slot Lines */}
          <div className="pointer-events-none absolute inset-0">
            {hourLabels.map((_, hIdx) => (
              <div
                key={hIdx}
                className="h-[56px] border-b border-slate-100 dark:border-slate-800/60"
              />
            ))}
          </div>

          {/* Day Columns */}
          {days.map((day, dIdx) => {
            const dayDateStr = formatYMD(day);
            const dayTimedEvents = timedEvents.filter((e) => e.start.startsWith(dayDateStr));

            return (
              <div
                key={dIdx}
                className="relative h-full border-r border-slate-200 dark:border-slate-800/80"
              >
                {/* Slot click targets */}
                {hourLabels.map((_, hIdx) => (
                  <div
                    key={hIdx}
                    onClick={() => handleSlotClick(day, hIdx)}
                    className="h-[56px] cursor-pointer transition-colors hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20"
                    title={`Click to add event at ${hourLabels[hIdx]}`}
                  />
                ))}

                {/* Timed Events Rendered Absolutely */}
                {dayTimedEvents.map((e) => (
                  <div key={e.id} className="absolute z-10" style={getEventStyle(e)}>
                    <EventCard event={e} onClick={() => openEventDetails(e)} style={{}} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);
};
