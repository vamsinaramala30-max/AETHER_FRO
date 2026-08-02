import React from 'react';
import { ScheduleEvent } from './todaysScheduleService';

interface UpcomingEventProps {
  event: ScheduleEvent;
}

export const UpcomingEvent: React.FC<UpcomingEventProps> = ({ event }) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-900/60 p-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-indigo-400">{event.startTime}</span>
          <span className="text-xs font-semibold text-slate-200">{event.title}</span>
        </div>
        <p className="text-[11px] text-slate-400">{event.location}</p>
      </div>

      {event.meetingLink && (
        <a
          href={event.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-indigo-500/30 bg-indigo-600/30 px-3 py-1 text-xs text-indigo-300 transition-colors hover:bg-indigo-600/50"
        >
          Join
        </a>
      )}
    </div>
  );
};
