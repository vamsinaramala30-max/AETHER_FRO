import React from 'react';
import { useCalendar } from '../hooks/useCalendar';

export const CalendarList: React.FC = () => {
  const { calendars, selectedCalendarIds, toggleCalendarVisibility } = useCalendar();

  return (
    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: '700',
            color: 'var(--cal-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          My Calendars
        </span>
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--cal-accent-color)',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: '700',
            lineHeight: 1,
          }}
        >
          +
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {calendars.map((cal) => {
          const isChecked = selectedCalendarIds.includes(cal.id);
          return (
            <div
              key={cal.id}
              onClick={() => toggleCalendarVisibility(cal.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '13px',
                color: 'var(--cal-text-primary)',
                padding: '6px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                backgroundColor: isChecked ? 'var(--cal-hover-bg)' : 'transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: `2px solid ${cal.color}`,
                    backgroundColor: isChecked ? cal.color : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isChecked && (
                    <svg
                      style={{ width: '10px', height: '10px', color: '#ffffff' }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span style={{ fontWeight: '500', fontSize: '13px' }}>{cal.title}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--cal-text-subtle)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '2px 4px',
                }}
              >
                ⋮
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
