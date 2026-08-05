import React from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';

export const SchedulePage: React.FC = () => {
  const _events = [
    { time: '09:00 AM', title: 'Daily Standup & Sync', duration: '30m', location: 'Google Meet' },
    {
      time: '11:00 AM',
      title: 'Architecture Review: Microservices',
      duration: '1h',
      location: 'Room A / Zoom',
    },
    { time: '02:00 PM', title: 'Product & Design Alignment', duration: '45m', location: 'Virtual' },
    {
      time: '04:00 PM',
      title: 'Deep Work: Code Optimization',
      duration: '2h',
      location: 'Focus Mode',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-[#192032] pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white">
            <CalendarIcon className="h-6 w-6 text-indigo-400" />
            Today's Schedule
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Detailed timeline of events, focus blocks, and upcoming meetings.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition-all hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </button>
      </div>

      <div className="rounded-2xl border border-[#192032] bg-[#0D121F] p-8 text-center space-y-2">
        <CalendarIcon className="mx-auto h-8 w-8 text-slate-500" />
        <p className="text-sm font-semibold text-slate-300">No events scheduled for today</p>
        <p className="text-xs text-slate-400">Click "Add Event" to schedule meetings, focus sessions, or reminders.</p>
      </div>
    </div>
  );
};
