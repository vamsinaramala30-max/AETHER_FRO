import React from 'react';
import { StudySession } from './studyPlannerService';
import { StudySessionCard } from './StudySessionCard';

interface StudyScheduleProps {
  sessions: StudySession[];
  onToggleSession: (id: string) => void;
}

export const StudySchedule: React.FC<StudyScheduleProps> = ({ sessions, onToggleSession }) => {
  const incoming = sessions.filter(s => !s.completed);
  const historic = sessions.filter(s => s.completed);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Queue Focus Buffers ({incoming.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {incoming.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#555', fontStyle: 'italic' }}>No pending architectural deep-dives in stack.</p>
          ) : (
            incoming.map(s => <StudySessionCard key={s.id} session={s} onToggle={onToggleSession} />)
          )}
        </div>
      </div>

      {historic.length > 0 && (
        <div>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Committed Blocks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {historic.map(s => <StudySessionCard key={s.id} session={s} onToggle={onToggleSession} />)}
          </div>
        </div>
      )}
    </div>
  );
};