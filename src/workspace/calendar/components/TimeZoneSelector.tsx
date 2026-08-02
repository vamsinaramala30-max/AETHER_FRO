import React from 'react';
import { useTimezone } from '../hooks/useTimezone';

export const TimeZoneSelector: React.FC = () => {
  const { currentTimeZone, timeZones, setTimeZone } = useTimezone();

  return (
    <div
      style={{
        marginTop: 'auto',
        paddingTop: '16px',
        borderTop: '1px solid var(--cal-border-color)',
      }}
    >
      <label
        style={{
          fontSize: '11px',
          fontWeight: '700',
          color: 'var(--cal-text-secondary)',
          display: 'block',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Time Zone
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={currentTimeZone}
          onChange={(e) => setTimeZone(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 30px 8px 12px',
            backgroundColor: 'var(--cal-input-bg)',
            border: '1px solid var(--cal-border-color)',
            borderRadius: '8px',
            color: 'var(--cal-text-primary)',
            fontSize: '12px',
            fontWeight: '500',
            appearance: 'none',
            outline: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {timeZones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
        <svg
          style={{
            width: '14px',
            height: '14px',
            color: 'var(--cal-text-secondary)',
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};
