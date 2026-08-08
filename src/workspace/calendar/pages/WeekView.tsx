import React from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { useEvents } from '../hooks/useEvents';
import { getStartOfWeek, parseYMD } from '../utils/dateUtils';
import { CalendarGrid } from '../components/CalendarGrid';

export const WeekView: React.FC = () => {
  const { viewState } = useCalendar();
  const current = parseYMD(viewState.currentDate);

  const startOfWeek = getStartOfWeek(current);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate() + i,
    );
    return d;
  });

  const rangeEnd = new Date(
    days[6].getFullYear(),
    days[6].getMonth(),
    days[6].getDate(),
    23,
    59,
    59,
    999,
  );

  const { events } = useEvents(startOfWeek, rangeEnd);

  return <CalendarGrid days={days} events={events} />;
};
