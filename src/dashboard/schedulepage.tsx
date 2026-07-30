import React from 'react';
import { Calendar as CalendarIcon, Clock, Video, Plus } from 'lucide-react';

export const SchedulePage: React.FC = () => {
  const events = [
    { time: '09:00 AM', title: 'Daily Standup & Sync', duration: '30m', location: 'Google Meet' },
    { time: '11:00 AM', title: 'Architecture Review: Microservices', duration: '1h', location: 'Room A / Zoom' },
    { time: '02:00 PM', title: 'Product & Design Alignment', duration: '45m', location: 'Virtual' },
    { time: '04:00 PM', title: 'Deep Work: Code Optimization', duration: '2h', location: 'Focus Mode' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#192032] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
            Today's Schedule
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Detailed timeline of events, focus blocks, and upcoming meetings.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-900/30 hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="space-y-4">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="bg-[#0D121F] border border-[#192032] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-500/40 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-mono font-bold text-indigo-400">{event.time}</div>
              <div>
                <h3 className="font-semibold text-white text-base">{event.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {event.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-slate-500" />
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="self-start sm:self-center px-3 py-1.5 bg-[#161C2E] border border-[#242E47] text-xs font-semibold text-slate-300 rounded-lg hover:text-white transition-colors"
            >
              Join Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
