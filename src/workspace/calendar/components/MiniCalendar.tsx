import React, { useState, useEffect } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_NAMES } from '../utils/constants';

export const MiniCalendar: React.FC = () => {
  const { viewState, setCurrentDate } = useCalendar();

  const selectedDate = new Date(viewState.currentDate);
  const validSelectedDate = isNaN(selectedDate.getTime()) ? new Date() : selectedDate;

  const [viewYear, setViewYear] = useState(validSelectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(validSelectedDate.getMonth());

  useEffect(() => {
    const d = new Date(viewState.currentDate);
    if (!isNaN(d.getTime())) {
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [viewState.currentDate]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Generate grid days for viewYear/viewMonth
  const firstDay = new Date(viewYear, viewMonth, 1);
  const startDayOfWeek = firstDay.getDay(); // 0 for Sun, 1 for Mon, etc.
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const gridItems: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonthIdx = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    gridItems.push({ day, dateStr, isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    gridItems.push({ day, dateStr, isCurrentMonth: true });
  }

  // Next month leading days to complete grid (up to 35 or 42)
  const remaining = 35 - gridItems.length > 0 ? 35 - gridItems.length : 42 - gridItems.length;
  for (let day = 1; day <= remaining; day++) {
    const nextMonthIdx = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    gridItems.push({ day, dateStr, isCurrentMonth: false });
  }

  const selectedDateStr = viewState.currentDate;

  return (
    <div className="mb-5 select-none">
      {/* Month & Navigation Header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            title="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            title="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Days of week headers */}
      <div className="mb-1.5 grid grid-cols-7 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
          <span
            key={idx}
            className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Grid Days */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {gridItems.map((item, idx) => {
          const isSelected = item.dateStr === selectedDateStr;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentDate(item.dateStr)}
              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-indigo-600 font-extrabold text-white shadow-md shadow-indigo-500/30 dark:bg-indigo-500'
                  : item.isCurrentMonth
                    ? 'text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                    : 'text-slate-400 hover:bg-slate-50 dark:text-slate-600 dark:hover:bg-slate-800/40'
              }`}
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
