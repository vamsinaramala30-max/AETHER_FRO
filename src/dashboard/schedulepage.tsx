import React from 'react';
import { Calendar as CalendarIcon, Clock, Video, Plus } from 'lucide-react';

export const SchedulePage: React.FC = () => {
  const events = [
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

      <div className="space-y-4">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between gap-3 rounded-xl border border-[#192032] bg-[#0D121F] p-4 transition-all hover:border-indigo-500/40 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-24 font-mono text-sm font-bold text-indigo-400">{event.time}</div>
              <div>
                <h3 className="text-base font-semibold text-white">{event.title}</h3>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    {event.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="h-3.5 w-3.5 text-slate-500" />
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="self-start rounded-lg border border-[#242E47] bg-[#161C2E] px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:text-white sm:self-center"
            >
              Join Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
