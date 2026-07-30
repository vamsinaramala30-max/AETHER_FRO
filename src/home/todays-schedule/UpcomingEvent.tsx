import React from 'react';
import { ScheduleEvent } from './todaysScheduleService';

interface UpcomingEventProps {
  event: ScheduleEvent;
}

export const UpcomingEvent: React.FC<UpcomingEventProps> = ({ event }) => {
  return (
    <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-indigo-400">{event.startTime}</span>
          <span className="text-xs font-semibold text-slate-200">{event.title}</span>
        </div>
        <p className="text-[11px] text-slate-400">{event.location}</p>
      </div>

      {event.meetingLink && (
        <a
          href={event.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="text-xs bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-md transition-colors"
        >
          Join
        </a>
      )}
    </div>
  );
};