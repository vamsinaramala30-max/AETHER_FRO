import React, { useState } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { useEvents } from '../hooks/useEvents';
import { getMonthGrid, isToday, formatYMD } from '../utils/dateUtils';
import { useEventStore } from '../store/eventStore';
import { Calendar, Clock } from 'lucide-react';

export const MonthView: React.FC = () => {
  const { viewState, setCurrentDate } = useCalendar();
  const { openEventDetails, openEventForm } = useEventStore();
  const current = new Date(viewState.currentDate);

  const [selectedDate, setSelectedDate] = useState<Date>(current);

  const grid = getMonthGrid(current.getFullYear(), current.getMonth());
  const firstWeek = grid[0];
  const lastWeek = grid[grid.length - 1];
  const firstDay = firstWeek[0];
  const lastDay = lastWeek[lastWeek.length - 1];

  const { events } = useEvents(firstDay, lastDay);

  const dayHeaderNames = [
    { full: 'Sun', short: 'S' },
    { full: 'Mon', short: 'M' },
    { full: 'Tue', short: 'T' },
    { full: 'Wed', short: 'W' },
    { full: 'Thu', short: 'T' },
    { full: 'Fri', short: 'F' },
    { full: 'Sat', short: 'S' },
  ];

  const selectedDayEvents = events.filter((e) => {
    const d = new Date(e.start);
    return (
      d.getFullYear() === selectedDate.getFullYear() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getDate() === selectedDate.getDate()
    );
  });

  return (
    <div className="flex flex-col flex-1 h-full w-full overflow-hidden bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      {/* Day header row */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/60 shrink-0">
        {dayHeaderNames.map((day) => (
          <div
            key={day.full}
            className="py-2 text-center text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500 border-r border-slate-200 dark:border-slate-800 dark:text-slate-400"
          >
            <span className="hidden sm:inline">{day.full}</span>
            <span className="sm:hidden">{day.short}</span>
          </div>
        ))}
      </div>

      {/* 6-Week Month Grid */}
      <div className="grid flex-1 grid-rows-6 min-h-0 overflow-y-auto">
        {grid.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800/70 min-h-[50px]">
            {week.map((day) => {
              const dayYmd = formatYMD(day);
              const dayEvents = events.filter((e) => e.start.startsWith(dayYmd));

              const activeToday = isToday(day);
              const isSelected = formatYMD(selectedDate) === dayYmd;
              const isCurrentMonth = day.getMonth() === current.getMonth();

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => {
                    setSelectedDate(day);
                    setCurrentDate(dayYmd);
                  }}
                  className={`group relative flex flex-col justify-between border-r border-slate-200 p-1 transition-all cursor-pointer dark:border-slate-800/70 ${
                    !isCurrentMonth ? 'bg-slate-50/40 text-slate-400 dark:bg-slate-950/40 dark:text-slate-600' : 'bg-white dark:bg-slate-900'
                  } ${isSelected ? 'bg-indigo-50/60 dark:bg-indigo-950/30 ring-1 ring-inset ring-indigo-500' : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/40'}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[11px] sm:text-xs font-extrabold ${
                        activeToday
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/40'
                          : isSelected
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                          : ''
                      }`}
                    >
                      {day.getDate()}
                    </span>

                    {/* Mobile Dot Indicators */}
                    {dayEvents.length > 0 && (
                      <div className="flex sm:hidden items-center gap-0.5 pr-0.5">
                        {dayEvents.slice(0, 3).map((e, idx) => (
                          <span
                            key={idx}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: e.color || '#6366f1' }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Desktop Event Cards (Hidden on mobile) */}
                  <div className="hidden sm:flex flex-col gap-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((e) => (
                      <div
                        key={e.id}
                        onClick={(evt) => {
                          evt.stopPropagation();
                          openEventDetails(e);
                        }}
                        className="truncate rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-white shadow-xs transition-opacity hover:opacity-90"
                        style={{ backgroundColor: e.color || '#6366f1' }}
                      >
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 pl-0.5">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile Selected Day Event Drawer List */}
      <div className="sm:hidden border-t border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-850 max-h-44 overflow-y-auto shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 dark:text-white">
            <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              openEventForm({
                start: `${formatYMD(selectedDate)}T09:00:00.000Z`,
                end: `${formatYMD(selectedDate)}T10:00:00.000Z`,
                isAllDay: false,
              })
            }
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            + Add Event
          </button>
        </div>

        {selectedDayEvents.length === 0 ? (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            No events scheduled for this day.
          </p>
        ) : (
          <div className="space-y-1.5">
            {selectedDayEvents.map((e) => (
              <div
                key={e.id}
                onClick={() => openEventDetails(e)}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2 text-xs shadow-xs cursor-pointer dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: e.color || '#6366f1' }}
                  />
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    {e.title}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(e.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
