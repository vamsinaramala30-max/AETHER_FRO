import React from 'react';
import { useTimezone } from '../hooks/useTimezone';

export const TimeZoneSelector: React.FC = () => {
  const { currentTimeZone, timeZones, setTimeZone } = useTimezone();

  return (
    <div style={{ padding: '8px 0' }}>
      <label htmlFor="tz-select" className="cal-tz-label">
        Time Zone
      </label>
      <select
        id="tz-select"
        className="cal-tz-select"
        value={currentTimeZone}
        onChange={(e) => {
          setTimeZone(e.target.value);
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
