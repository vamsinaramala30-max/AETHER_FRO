import React from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SchedulePage: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            <CalendarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Today's Schedule
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Detailed timeline of events, focus blocks, and upcoming meetings.
          </p>
        </div>
        <Link
          to="/app/workspace/calendar"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CalendarIcon className="mb-3 h-10 w-10 text-slate-400 dark:text-slate-500" />
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
          No events scheduled for today
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Open your calendar to schedule meetings, focus sessions, or reminders.
        </p>
      </div>
    </div>
  );
};
