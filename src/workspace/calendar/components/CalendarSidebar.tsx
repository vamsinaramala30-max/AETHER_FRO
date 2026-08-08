import React from 'react';
import { MiniCalendar } from './MiniCalendar';
import { CalendarList } from './CalendarList';
import { TimeZoneSelector } from './TimeZoneSelector';
import { useEventStore } from '../store/eventStore';
import { Plus } from 'lucide-react';

export const CalendarSidebar: React.FC = () => {
  const { openEventForm } = useEventStore();

  return (
    <aside className="hidden w-[260px] min-w-[260px] shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white p-4 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 lg:flex">
      <MiniCalendar />

      <button
        type="button"
        onClick={() => openEventForm()}
        className="shadow-2xs my-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 p-2.5 text-xs font-bold text-indigo-700 transition-all hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/80"
      >
        <Plus className="h-4 w-4" />
        <span>Create Event</span>
      </button>

      <CalendarList />
      <TimeZoneSelector />
    </aside>
  );
};
