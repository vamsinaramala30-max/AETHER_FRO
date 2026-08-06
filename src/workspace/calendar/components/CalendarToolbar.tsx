import React from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { addDays, getStartOfWeek, formatYMD, parseYMD } from '../utils/dateUtils';
import { importExportService } from '../services/importExportService';
import { useEventStore } from '../store/eventStore';
import { useFilterStore } from '../store/filterStore';
import { FilterPanel } from './FilterPanel';
import { CalendarViewType } from '../types/calendar';
import { ChevronLeft, ChevronRight, Plus, Download, Filter } from 'lucide-react';

const formatToolbarDateLabel = (dateStr: string, view: CalendarViewType): string => {
  const date = parseYMD(dateStr);
  if (isNaN(date.getTime())) return 'August 2026';

  if (view === 'day') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (view === 'month' || view === 'year') {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  // Week or Agenda view
  const start = getStartOfWeek(date);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()} – ${end.getDate()}, ${year}`;
  }
  return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${year}`;
};

export const CalendarToolbar: React.FC = () => {
  const { viewState, setCurrentView, setCurrentDate } = useCalendar();
  const { events, openEventForm } = useEventStore();
  const { toggleFilterPanel } = useFilterStore();

  const handleNavigate = (delta: number) => {
    const current = parseYMD(viewState.currentDate);
    let nextDate = current;

    switch (viewState.currentView) {
      case 'day':
        nextDate = addDays(current, delta);
        break;
      case 'week':
        nextDate = addDays(current, delta * 7);
        break;
      case 'month':
        nextDate = new Date(current.getFullYear(), current.getMonth() + delta, 1);
        break;
      case 'year':
        nextDate = new Date(current.getFullYear() + delta, current.getMonth(), 1);
        break;
      default:
        nextDate = addDays(current, delta * 7);
    }

    const ymdStr = formatYMD(nextDate);
    if (ymdStr) {
      setCurrentDate(ymdStr);
    }
  };

  const todayYmd = formatYMD(new Date());
  const isToday = viewState.currentDate === todayYmd;
  const dateLabel = formatToolbarDateLabel(viewState.currentDate, viewState.currentView);

  return (
    <header className="flex flex-col gap-3 border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
      {/* Left Section: Title & Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-sm shadow-indigo-500/50 dark:bg-indigo-400" />
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Calendar
          </h1>
        </div>

        {/* Navigation Strip */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentDate(todayYmd)}
            className={`rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 ${
              isToday ? 'opacity-60' : ''
            }`}
          >
            Today
          </button>

          <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => handleNavigate(-1)}
              className="rounded-lg p-1 text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              title="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />
            <button
              type="button"
              onClick={() => handleNavigate(1)}
              className="rounded-lg p-1 text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              title="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-100">
            {dateLabel}
          </div>
        </div>
      </div>

      {/* Right Section: Actions & View Switcher */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={toggleFilterPanel}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>
          <FilterPanel />
        </div>

        <button
          type="button"
          onClick={() => importExportService.downloadICS(events)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>

        <button
          type="button"
          onClick={() => openEventForm()}
          className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          <span>Create Event</span>
        </button>

        {/* View Switcher Pill */}
        <div className="flex rounded-xl border border-slate-300 bg-slate-100 p-0.5 dark:border-slate-700 dark:bg-slate-800">
          {(['day', 'week', 'month', 'agenda'] as CalendarViewType[]).map((v) => {
            const isActive = viewState.currentView === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setCurrentView(v)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-all ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
