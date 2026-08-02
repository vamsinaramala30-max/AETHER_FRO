import React from 'react';
import { useCalendar } from '../hooks/useCalendar';

export const MiniCalendar: React.FC = () => {
  const { setCurrentDate } = useCalendar();

  const daysGrid = [
    { day: 26, isCurrentMonth: false, dateStr: '2026-07-26' },
    { day: 27, isCurrentMonth: false, dateStr: '2026-07-27' },
    { day: 28, isCurrentMonth: false, dateStr: '2026-07-28' },
    { day: 29, isCurrentMonth: false, dateStr: '2026-07-29' },
    { day: 30, isCurrentMonth: false, dateStr: '2026-07-30' },
    { day: 31, isCurrentMonth: false, dateStr: '2026-07-31' },
    { day: 1, isCurrentMonth: true, dateStr: '2026-08-01' },

    { day: 2, isCurrentMonth: true, isHighlighted: true, dateStr: '2026-08-02' },
    { day: 3, isCurrentMonth: true, dateStr: '2026-08-03' },
    { day: 4, isCurrentMonth: true, dateStr: '2026-08-04' },
    { day: 5, isCurrentMonth: true, dateStr: '2026-08-05' },
    { day: 6, isCurrentMonth: true, dateStr: '2026-08-06' },
    { day: 7, isCurrentMonth: true, dateStr: '2026-08-07' },
    { day: 8, isCurrentMonth: true, dateStr: '2026-08-08' },

    { day: 9, isCurrentMonth: true, dateStr: '2026-08-09' },
    { day: 10, isCurrentMonth: true, dateStr: '2026-08-10' },
    { day: 11, isCurrentMonth: true, dateStr: '2026-08-11' },
    { day: 12, isCurrentMonth: true, dateStr: '2026-08-12' },
    { day: 13, isCurrentMonth: true, dateStr: '2026-08-13' },
    { day: 14, isCurrentMonth: true, dateStr: '2026-08-14' },
    { day: 15, isCurrentMonth: true, dateStr: '2026-08-15' },

    { day: 16, isCurrentMonth: true, dateStr: '2026-08-16' },
    { day: 17, isCurrentMonth: true, dateStr: '2026-08-17' },
    { day: 18, isCurrentMonth: true, dateStr: '2026-08-18' },
    { day: 19, isCurrentMonth: true, dateStr: '2026-08-19' },
    { day: 20, isCurrentMonth: true, dateStr: '2026-08-20' },
    { day: 21, isCurrentMonth: true, dateStr: '2026-08-21' },
    { day: 22, isCurrentMonth: true, dateStr: '2026-08-22' },

    { day: 23, isCurrentMonth: true, dateStr: '2026-08-23' },
    { day: 24, isCurrentMonth: true, dateStr: '2026-08-24' },
    { day: 25, isCurrentMonth: true, dateStr: '2026-08-25' },
    { day: 26, isCurrentMonth: true, dateStr: '2026-08-26' },
    { day: 27, isCurrentMonth: true, dateStr: '2026-08-27' },
    { day: 28, isCurrentMonth: true, dateStr: '2026-08-28' },
    { day: 29, isCurrentMonth: true, dateStr: '2026-08-29' },

    { day: 30, isCurrentMonth: true, dateStr: '2026-08-30' },
    { day: 31, isCurrentMonth: true, dateStr: '2026-08-31' },
    { day: 1, isCurrentMonth: false, dateStr: '2026-09-01' },
    { day: 2, isCurrentMonth: false, dateStr: '2026-09-02' },
    { day: 3, isCurrentMonth: false, dateStr: '2026-09-03' },
    { day: 4, isCurrentMonth: false, dateStr: '2026-09-04' },
    { day: 5, isCurrentMonth: false, dateStr: '2026-09-05' },
  ];

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          padding: '0 4px',
        }}
      >
        <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--cal-text-primary)' }}>
          August 2026
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--cal-text-secondary)',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ‹
          </button>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--cal-text-secondary)',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ›
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          marginBottom: '8px',
        }}
      >
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
          <span
            key={idx}
            style={{ fontSize: '11px', fontWeight: '600', color: 'var(--cal-text-secondary)' }}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px 0',
          textAlign: 'center',
        }}
      >
        {daysGrid.map((item, idx) => {
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentDate(item.dateStr)}
              style={{
                width: '26px',
                height: '26px',
                margin: '0 auto',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: item.isHighlighted ? 'var(--cal-accent-color)' : 'transparent',
                color: item.isHighlighted
                  ? '#ffffff'
                  : item.isCurrentMonth
                    ? 'var(--cal-text-primary)'
                    : 'var(--cal-text-subtle)',
                fontSize: '12px',
                fontWeight: item.isHighlighted ? '700' : '400',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
