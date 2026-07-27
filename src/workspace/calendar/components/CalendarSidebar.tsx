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
        onClick={() => {
          openEventForm();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          borderRadius: '24px',
          border: '1px solid #dadce0',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: '16px',
        }}
      >
        <span style={{ fontSize: '20px', color: '#1a73e8' }}>+</span> Create
      </button>

      <MiniCalendar />
      <CalendarList />
      <TimeZoneSelector />
    </aside>
  );
};
