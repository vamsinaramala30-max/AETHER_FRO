import React from 'react';
import { StudySession } from './studyPlannerService';

interface StudyProgressProps {
  sessions: StudySession[];
}

export const StudyProgress: React.FC<StudyProgressProps> = ({ sessions }) => {
  const total = sessions.length;
  const completed = sessions.filter((s) => s.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const totalMinutes = sessions.reduce(
    (acc, curr) => acc + (curr.completed ? curr.durationMinutes : 0),
    0,
  );

  return (
    <div
      style={{
        background: '#111',
        border: '1px solid #222',
        borderRadius: '8px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Sync Progression Telemetry</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div
          style={{
            background: '#161616',
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid #222',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#777', display: 'block' }}>
            Integrated Capacity
          </span>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0066cc' }}>
            {completed}/{total}
          </span>
        </div>
        <div
          style={{
            background: '#161616',
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid #222',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#777', display: 'block' }}>
            Time Under Load
          </span>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffaa00' }}>
            {totalMinutes}m
          </span>
        </div>
      </div>
      <div
        style={{
          width: '100%',
          height: '4px',
          background: '#222',
          borderRadius: '2px',
          overflow: 'hidden',
          marginTop: '0.5rem',
        }}
      >
        <div
          style={{
            width: `${String(percentage)}%`,
            height: '100%',
            background: '#0066cc',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};
