import React from 'react';
import { ScheduleEvent } from './todaysScheduleService';

interface ScheduleCardProps {
  event: ScheduleEvent;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ event }) => {
  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        event.isCurrent
          ? 'bg-indigo-950/30 border-indigo-500/60 ring-1 ring-indigo-500/40'
          : 'bg-slate-800/80 border-slate-700/80'
      }`}
    >
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-mono text-slate-300 font-semibold">
          {event.startTime} - {event.endTime}
        </span>
        {event.isCurrent && (
          <span className="px-2 py-0.5 bg-indigo-500 text-white font-bold rounded text-[10px] uppercase">
            In Progress
          </span>
        )}
      </div>
      <h4 className="text-sm font-semibold text-white mb-1">{event.title}</h4>
      <p className="text-xs text-slate-400">{event.location}</p>
    </div>
  );
};