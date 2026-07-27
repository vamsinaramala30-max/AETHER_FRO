import React from 'react';
import { useTimezone } from '../hooks/useTimezone';

export const TimeZoneSelector: React.FC = () => {
  const { currentTimeZone, timeZones, setTimeZone } = useTimezone();

  return (
    <div style={{ padding: '8px 0' }}>
      <label htmlFor="tz-select" style={{ fontSize: '12px', color: '#5f6368', display: 'block' }}>
        Time Zone
      </label>
      <select
        id="tz-select"
        value={currentTimeZone}
        onChange={(e) => {
          setTimeZone(e.target.value);
        }}
        style={{
          width: '100%',
          padding: '6px 8px',
          borderRadius: '4px',
          border: '1px solid #dadce0',
          fontSize: '13px',
          marginTop: '4px',
        }}
      >
        {timeZones.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  );
};
