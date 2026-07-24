import React from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { CALENDAR_VIEWS } from '../utils/constants';
import { addDays } from '../utils/dateUtils';
import { SearchBar } from './SearchBar';
import { ImportExportService } from '../services/importExportService';
import { useEventStore } from '../store/eventStore';

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

    setCurrentDate(nextDate.toISOString().split('T')[0]);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        borderBottom: '1px solid #dadce0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 style={{ fontSize: '20px', margin: 0, fontWeight: '400' }}>Enterprise Calendar</h1>
        <button
          type="button"
          onClick={() => setCurrentDate(new Date().toISOString().split('T')[0])}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #dadce0', cursor: 'pointer' }}
        >
          Today
        </button>
        <div>
          <button type="button" onClick={() => handleNavigate(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px' }}>
            ‹
          </button>
          <button type="button" onClick={() => handleNavigate(1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px' }}>
            ›
          </button>
        </div>
        <span style={{ fontSize: '18px', fontWeight: '500' }}>{viewState.currentDate}</span>
      </div>

      <SearchBar />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={() => ImportExportService.downloadICS(events)}
          style={{ padding: '6px 12px', border: '1px solid #dadce0', borderRadius: '4px', cursor: 'pointer' }}
        >
          Export ICS
        </button>

        <select
          value={viewState.currentView}
          onChange={(e) => setCurrentView(e.target.value as any)}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #dadce0' }}
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