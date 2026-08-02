import React from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { CALENDAR_VIEWS } from '../utils/constants';
import { addDays } from '../utils/dateUtils';
import { SearchBar } from './SearchBar';
import { importExportService } from '../services/importExportService';
import { useEventStore } from '../store/eventStore';
import { CalendarViewType } from '../types/calendar';

export const CalendarToolbar: React.FC = () => {
  const { viewState, setCurrentView, setCurrentDate } = useCalendar();
  const { events } = useEventStore();

  const handleNavigate = (delta: number) => {
    const current = new Date(viewState.currentDate);
    let nextDate = current;

    switch (viewState.currentView) {
      case 'day':
        nextDate = addDays(current, delta);
        break;
      case 'week':
        nextDate = addDays(current, delta * 7);
        break;
      case 'month':
        nextDate = new Date(current.getFullYear(), current.getMonth() + delta, 1);
        break;
      case 'year':
        nextDate = new Date(current.getFullYear() + delta, current.getMonth(), 1);
        break;
      default:
        nextDate = addDays(current, delta * 7);
    }

    const isoStr = nextDate.toISOString().split('T')[0];
    if (isoStr) {
      setCurrentDate(isoStr);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        borderBottom: '1px solid var(--cal-border-color)',
        backgroundColor: 'var(--cal-bg-primary)',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <h1
          style={{
            fontSize: '20px',
            margin: 0,
            fontWeight: '500',
            color: 'var(--cal-text-primary)',
          }}
        >
          Enterprise Calendar
        </h1>
        <button
          type="button"
          className="cal-toolbar-btn"
          onClick={() => {
            const todayStr = new Date().toISOString().split('T')[0];
            if (todayStr) setCurrentDate(todayStr);
          }}
        >
          Today
        </button>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            className="cal-toolbar-nav-btn"
            onClick={() => {
              handleNavigate(-1);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            className="cal-toolbar-nav-btn"
            onClick={() => {
              handleNavigate(1);
            }}
          >
            ›
          </button>
        </div>
        <span style={{ fontSize: '18px', fontWeight: '500', color: 'var(--cal-text-primary)' }}>
          {viewState.currentDate}
        </span>
      </div>

      <SearchBar />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          className="cal-toolbar-btn"
          onClick={() => {
            importExportService.downloadICS(events);
          }}
        >
          Export ICS
        </button>

        <select
          className="cal-toolbar-select"
          value={viewState.currentView}
          onChange={(e) => {
            setCurrentView(e.target.value as CalendarViewType);
          }}
        >
          {CALENDAR_VIEWS.map((v) => (
            <option key={v.type} value={v.type}>
              {v.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
