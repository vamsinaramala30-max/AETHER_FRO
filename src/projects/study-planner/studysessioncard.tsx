import React from 'react';
import { StudySession } from './studyplannerservice';

interface StudySessionCardProps {
  session: StudySession;
  onToggle: (id: string) => void;
}

export const StudySessionCard: React.FC<StudySessionCardProps> = ({ session, onToggle }) => {
  const formattedTime = new Date(session.scheduledTime).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        background: '#141414',
        border: '1px solid #222',
        borderRadius: '6px',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: session.completed ? 0.6 : 1,
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxWidth: '75%' }}>
        <span
          style={{
            fontSize: '0.7rem',
            color: '#0066cc',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          {session.moduleName}
        </span>
        <h4
          style={{
            margin: 0,
            fontSize: '0.95rem',
            color: '#f0f0f0',
            textDecoration: session.completed ? 'line-through' : 'none',
          }}
        >
          {session.topic}
        </h4>
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#666' }}>
          <span>{formattedTime}</span>
          <span>•</span>
          <span>{session.durationMinutes} Engine Mins</span>
        </div>
      </div>
      <button
        onClick={() => {
          onToggle(session.id);
        }}
        style={{
          background: session.completed ? '#1f1f1f' : '#0066cc',
          border: `1px solid ${session.completed ? '#333' : 'transparent'}`,
          color: session.completed ? '#888' : '#fff',
          padding: '0.4rem 0.8rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {session.completed ? 'Resolved' : 'Execute Block'}
      </button>
    </div>
  );
};
