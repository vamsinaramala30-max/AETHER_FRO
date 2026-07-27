import React from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { useEvents } from '../hooks/useEvents';
import { CalendarGrid } from '../components/CalendarGrid';

export const DayView: React.FC = () => {
  const { viewState } = useCalendar();
  const current = new Date(viewState.currentDate);

  const start = new Date(current);
  start.setHours(0, 0, 0, 0);

  const end = new Date(current);
  end.setHours(23, 59, 59, 999);

  const { events } = useEvents(start, end);

  return <CalendarGrid days={[current]} events={events} />;
};
