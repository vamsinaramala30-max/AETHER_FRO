import React, { useEffect, useState } from 'react';
import { ScheduleEvent, fetchTodaysSchedule } from './todaysScheduleService';
import { ScheduleCard } from './ScheduleCard';
import { UpcomingEvent } from './UpcomingEvent';

export const TodaysSchedule: React.FC = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);

  useEffect(() => {
    fetchTodaysSchedule().then(setEvents);
  }, []);

  const currentEvent = events.find((e) => e.isCurrent);
  const upcomingEvents = events.filter((e) => !e.isCurrent);

  return (
    <section className="space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">Today's Schedule</h3>
        <span className="text-xs text-slate-400">{events.length} Events Scheduled</span>
      </div>

      {currentEvent && (
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
            Active Now
          </span>
          <ScheduleCard event={currentEvent} />
        </div>
      )}

      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Upcoming
        </span>
        {upcomingEvents.map((evt) => (
          <UpcomingEvent key={evt.id} event={evt} />
        ))}
      </div>
    </section>
  );
};
