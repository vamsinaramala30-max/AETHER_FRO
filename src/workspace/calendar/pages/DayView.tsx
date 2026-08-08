import React from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { useEvents } from '../hooks/useEvents';
import { parseYMD } from '../utils/dateUtils';
import { CalendarGrid } from '../components/CalendarGrid';

export const DayView: React.FC = () => {
  const { viewState } = useCalendar();
  const current = parseYMD(viewState.currentDate);

  const start = new Date(current.getFullYear(), current.getMonth(), current.getDate(), 0, 0, 0, 0);
  const end = new Date(
    current.getFullYear(),
    current.getMonth(),
    current.getDate(),
    23,
    59,
    59,
    999,
  );

  const { events } = useEvents(start, end);

  return <CalendarGrid days={[current]} events={events} />;
};
