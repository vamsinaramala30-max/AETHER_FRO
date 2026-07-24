import React, { useState, useEffect } from 'react';
import { goalService, Goal } from './goalService';
import { GoalCard } from './GoalCard';
import { GoalForm } from './golaform';

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    goalService.getGoals().then(data => { setGoals(data); setLoading(false); });
  }, []);

  const handleUpdateProgress = async (id: string, nextProgress: number) => {
    try {
      const updated = await goalService.updateGoalProgress(id, nextProgress);
      setGoals(prev => prev.map(g => g.id === id ? updated : g));
    } catch {
      alert('Error updating progress matrix.');
    }
  };

  const handleCreateGoal = async (rawGoal: Omit<Goal, 'id' | 'progress'>) => {
    try {
      const created = await goalService.createGoal({ ...rawGoal, progress: 0 });
      setGoals(prev => [...prev, created]);
    } catch {
      alert('Error mapping new macro vector target.');
    }
  };

  if (loading) return <div style={{ color: '#00cc66', padding: '2rem', textAlign: 'center' }}>Syncing telemetry goals...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', color: '#fff' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>Macro Architecture Milestones</h1>
        <p style={{ margin: '0.25rem 0 0 0', color: '#888' }}>High-level structural engineering objectives.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <GoalForm onSubmit={handleCreateGoal} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} onUpdateProgress={handleUpdateProgress} />
          ))}
        </div>
      </div>
    </div>
  );
};