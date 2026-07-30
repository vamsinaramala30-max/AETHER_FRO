import React from 'react';
import { CalendarSummaryData } from './widgetsService';

interface CalendarWidgetProps {
  calendar: CalendarSummaryData;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ calendar }) => {
  return (
    <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl space-y-2">
      <span className="text-[10px] uppercase font-bold text-slate-400">Calendar Summary</span>
      <div className="flex justify-between items-baseline">
        <span className="text-xl font-bold text-white">{calendar.totalMeetingsToday} Events</span>
        <span className="text-xs text-indigo-400 font-semibold">Next in {calendar.nextMeetingInMinutes}m</span>
      </div>
      <p className="text-xs text-slate-400">{calendar.freeSlotsCount} open focus slots remaining</p>
    </div>
  );
};