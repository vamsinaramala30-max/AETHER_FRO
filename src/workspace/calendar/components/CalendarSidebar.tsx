import React from 'react';
import { MiniCalendar } from './MiniCalendar';
import { CalendarList } from './CalendarList';
import { TimeZoneSelector } from './TimeZoneSelector';
import { useEventStore } from '../store/eventStore';

export const CalendarSidebar: React.FC = () => {
  const { openEventForm } = useEventStore();

  return (
    <aside className="calendar-sidebar-container">
      <button
        type="button"
        className="cal-create-btn"
        onClick={() => {
          openEventForm();
        }}
      >
        <span className="cal-create-btn-icon">+</span> Create
      </button>

      <MiniCalendar />
      <CalendarList />
      <TimeZoneSelector />
    </aside>
  );
};
