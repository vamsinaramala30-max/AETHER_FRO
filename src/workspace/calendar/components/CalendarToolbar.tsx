import React from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { addDays } from '../utils/dateUtils';
import { importExportService } from '../services/importExportService';
import { useEventStore } from '../store/eventStore';
import { useFilterStore } from '../store/filterStore';
import { FilterPanel } from './FilterPanel';
import { CalendarViewType } from '../types/calendar';

export const CalendarToolbar: React.FC = () => {
  const { viewState, setCurrentView, setCurrentDate } = useCalendar();
  const { events, openEventForm } = useEventStore();
  const { toggleFilterPanel } = useFilterStore();

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

  const isToday = viewState.currentDate === new Date().toISOString().split('T')[0];

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        backgroundColor: 'var(--cal-bg-secondary)',
        borderBottom: '1px solid var(--cal-border-color)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)',
        zIndex: 20,
      }}
    >
      {/* Left Section: Title & Date Range Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--cal-accent-color)',
              boxShadow: '0 0 10px var(--cal-accent-color)',
            }}
          />
          <h1
            style={{
              fontSize: '20px',
              fontWeight: '800',
              color: 'var(--cal-text-primary)',
              margin: 0,
              letterSpacing: '-0.02em',
              fontFamily: 'inherit',
            }}
          >
            Calendar
          </h1>
        </div>

        {/* Date Navigation Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="cal-btn-secondary"
            onClick={() => {
              setCurrentDate(new Date().toISOString().split('T')[0]);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              opacity: isToday ? 0.7 : 1,
            }}
          >
            Today
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--cal-bg-elevated)',
              border: '1px solid var(--cal-border-color)',
              borderRadius: '8px',
              padding: '2px',
            }}
          >
            <button
              type="button"
              className="cal-icon-btn"
              onClick={() => handleNavigate(-1)}
              title="Previous"
              style={{ padding: '4px 10px', fontSize: '14px', fontWeight: '700' }}
            >
              ‹
            </button>
            <div
              style={{ width: '1px', height: '16px', backgroundColor: 'var(--cal-border-color)' }}
            />
            <button
              type="button"
              className="cal-icon-btn"
              onClick={() => handleNavigate(1)}
              title="Next"
              style={{ padding: '4px 10px', fontSize: '14px', fontWeight: '700' }}
            >
              ›
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--cal-text-primary)',
              fontSize: '15px',
              fontWeight: '700',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'var(--cal-bg-elevated)',
              border: '1px solid var(--cal-border-color)',
              marginLeft: '4px',
            }}
          >
            <span>Aug 2 – Aug 8, 2026</span>
            <svg
              style={{ width: '14px', height: '14px', color: 'var(--cal-text-secondary)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Section: Actions & View Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="cal-btn-secondary"
            onClick={toggleFilterPanel}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            <svg
              style={{ width: '15px', height: '15px', color: 'var(--cal-text-secondary)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filters</span>
          </button>
          <FilterPanel />
        </div>

        <button
          type="button"
          className="cal-btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
          }}
          onClick={() => importExportService.downloadICS(events)}
        >
          <svg
            style={{ width: '15px', height: '15px', color: 'var(--cal-text-secondary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>Export</span>
        </button>

        <button
          type="button"
          className="cal-btn-primary"
          onClick={() => openEventForm()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>
          <span>Create Event</span>
        </button>

        {/* View Switcher Segmented Pill Control */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--cal-bg-elevated)',
            borderRadius: '10px',
            padding: '3px',
            border: '1px solid var(--cal-border-color)',
          }}
        >
          {(['day', 'week', 'month', 'agenda'] as CalendarViewType[]).map((v) => {
            const isActive = viewState.currentView === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setCurrentView(v)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  fontSize: '12px',
                  fontWeight: isActive ? '700' : '500',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  backgroundColor: isActive ? 'var(--cal-bg-secondary)' : 'transparent',
                  color: isActive ? 'var(--cal-accent-color)' : 'var(--cal-text-secondary)',
                  boxShadow: isActive ? '0 1px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
