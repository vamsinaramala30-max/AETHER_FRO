import React, { useState, useEffect } from 'react';
import { studyPlannerService, StudySession } from './studyPlannerService';
import { StudySchedule } from './StudySchedule';
import { StudyProgress } from './StudyProgress';

export const StudyPlannerPage: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states inline for direct compilation safety
  const [topic, setTopic] = useState('');
  const [modName, setModName] = useState('');
  const [time, setTime] = useState('');
  const [dur, setDur] = useState(60);

  useEffect(() => {
    studyPlannerService.getSessions().then(data => { setSessions(data); setLoading(false); });
  }, []);

  const handleToggle = async (id: string) => {
    try {
      const updated = await studyPlannerService.toggleComplete(id);
      setSessions(prev => prev.map(s => s.id === id ? updated : s));
    } catch {
      alert('Failed to resolve execution frame state.');
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !time) return;

    try {
      const created = await studyPlannerService.addSession({
        topic, moduleName: modName || 'General Sandbox', scheduledTime: time, durationMinutes: dur, completed: false
      });
      setSessions(prev => [...prev, created]);
      setTopic(''); setModName(''); setTime('');
    } catch {
      alert('Failed to dispatch target focus block.');
    }
  };

  if (loading) return <div style={{ color: '#0066cc', padding: '2rem', textAlign: 'center' }}>Synchronizing cognitive schedule map...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', color: '#fff' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>Deep-Work Scheduling Matrix</h1>
        <p style={{ margin: '0.25rem 0 0 0', color: '#888' }}>Isolate complex paradigms into scheduled architectural sprints.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <StudyProgress sessions={sessions} />
          
          <form onSubmit={handleCreateSession} style={{ background: '#141414', border: '1px solid #222', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Queue System Block</h3>
            <input type="text" placeholder="Deep-Dive Topic Definition" value={topic} onChange={(e) => { setTopic(e.target.value); }} required style={{ background: '#000', border: '1px solid #333', color: '#fff', padding: '0.5rem', borderRadius: '4px' }} />
            <input type="text" placeholder="Context Module (e.g., Concurrency)" value={modName} onChange={(e) => { setModName(e.target.value); }} style={{ background: '#000', border: '1px solid #333', color: '#fff', padding: '0.5rem', borderRadius: '4px' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="datetime-local" value={time} onChange={(e) => { setTime(e.target.value); }} required style={{ flex: 2, background: '#000', border: '1px solid #333', color: '#fff', padding: '0.45rem', borderRadius: '4px', fontSize: '0.8rem' }} />
              <input type="number" placeholder="Mins" value={dur} onChange={(e) => { setDur(parseInt(e.target.value) || 30); }} min="15" style={{ flex: 1, background: '#000', border: '1px solid #333', color: '#fff', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }} />
            </div>
            <button type="submit" style={{ background: '#0066cc', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Commit Block</button>
          </form>
        </div>

        <div style={{ background: '#1c1c1c', border: '1px solid #282828', padding: '1.5rem', borderRadius: '8px' }}>
          <StudySchedule sessions={sessions} onToggleSession={handleToggle} />
        </div>
      </div>
    </div>
  );
};