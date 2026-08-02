import React from 'react';
import { MiniCalendar } from './MiniCalendar';
import { CalendarList } from './CalendarList';
import { TimeZoneSelector } from './TimeZoneSelector';
import { useEventStore } from '../store/eventStore';

export const CalendarSidebar: React.FC = () => {
  const { openEventForm } = useEventStore();

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        backgroundColor: 'var(--cal-bg-secondary)',
        borderRight: '1px solid var(--cal-border-color)',
        color: 'var(--cal-text-primary)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <MiniCalendar />

      <button
        type="button"
        onClick={() => openEventForm()}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
          color: 'var(--cal-accent-color)',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'all 0.15s ease',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '16px' }}>+</span> Create Event
      </button>

      <CalendarList />
      <TimeZoneSelector />
    </aside>
  );
};
