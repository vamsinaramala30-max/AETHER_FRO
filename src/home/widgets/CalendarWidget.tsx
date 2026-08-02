import React from 'react';
import { CalendarSummaryData } from './widgetsService';

interface CalendarWidgetProps {
  calendar: CalendarSummaryData;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ calendar }) => {
  return (
    <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-800 p-4">
      <span className="text-[10px] font-bold uppercase text-slate-400">Calendar Summary</span>
      <div className="flex items-baseline justify-between">
        <span className="text-xl font-bold text-white">{calendar.totalMeetingsToday} Events</span>
        <span className="text-xs font-semibold text-indigo-400">
          Next in {calendar.nextMeetingInMinutes}m
        </span>
      </div>
      <p className="text-xs text-slate-400">{calendar.freeSlotsCount} open focus slots remaining</p>
    </div>
  );
};
