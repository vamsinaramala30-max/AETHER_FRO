import React from 'react';
import { ScheduleEvent } from './todaysScheduleService';

interface ScheduleCardProps {
  event: ScheduleEvent;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ event }) => {
  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        event.isCurrent
          ? 'border-indigo-500/60 bg-indigo-950/30 ring-1 ring-indigo-500/40'
          : 'border-slate-700/80 bg-slate-800/80'
      }`}
    >
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-mono font-semibold text-slate-300">
          {event.startTime} - {event.endTime}
        </span>
        {event.isCurrent && (
          <span className="rounded bg-indigo-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            In Progress
          </span>
        )}
      </div>
      <h4 className="mb-1 text-sm font-semibold text-white">{event.title}</h4>
      <p className="text-xs text-slate-400">{event.location}</p>
    </div>
  );
};
