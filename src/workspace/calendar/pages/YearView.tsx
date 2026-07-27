import React from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { MONTH_NAMES } from '../utils/constants';

export const YearView: React.FC = () => {
  const { viewState, setCurrentDate, setCurrentView } = useCalendar();
  const year = new Date(viewState.currentDate).getFullYear();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      {MONTH_NAMES.map((monthName, idx) => (
        <div
          key={monthName}
          onClick={() => {
            const m = idx + 1;
            const monthStr = m < 10 ? `0${String(m)}` : String(m);
            setCurrentDate(`${String(year)}-${monthStr}-01`);
            setCurrentView('month');
          }}
          style={{
            border: '1px solid #dadce0',
            borderRadius: '8px',
            padding: '12px',
            cursor: 'pointer',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', textAlign: 'center' }}>{monthName}</h4>
        </div>
      ))}
    </div>
  );
};
