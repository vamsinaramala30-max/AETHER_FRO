import React, { useState } from 'react';
import { Goal } from './goalService';

interface GoalFormProps {
  onSubmit: (goal: Omit<Goal, 'id' | 'progress'>) => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState<Goal['category']>('technical');
  const [metrics, setMetrics] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;
    onSubmit({ title, description, targetDate, category, metrics });
    setTitle(''); setDescription(''); setTargetDate(''); setMetrics('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#141414', border: '1px solid #222', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#fff', fontWeight: 600 }}>Establish Vector Horizon (Goal)</h3>
      <input type="text" placeholder="Objective Anchor" value={title} onChange={(e) => { setTitle(e.target.value); }} required style={{ background: '#000', border: '1px solid #333', color: '#fff', padding: '0.5rem', borderRadius: '4px' }} />
      <textarea placeholder="Strategic Path Description..." value={description} onChange={(e) => { setDescription(e.target.value); }} style={{ background: '#000', border: '1px solid #333', color: '#fff', padding: '0.5rem', borderRadius: '4px', minHeight: '60px' }} />
      <input type="text" placeholder="Quantifiable Success Criteria / Key Metrics" value={metrics} onChange={(e) => { setMetrics(e.target.value); }} style={{ background: '#000', border: '1px solid #333', color: '#fff', padding: '0.5rem', borderRadius: '4px' }} />
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <select value={category} onChange={(e) => { setCategory(e.target.value as any); }} style={{ flex: 1, background: '#000', border: '1px solid #333', color: '#fff', padding: '0.5rem', borderRadius: '4px' }}>
          <option value="technical">Technical Depth</option>
          <option value="career">Strategic Career</option>
          <option value="personal">Personal Baseline</option>
        </select>
        <input type="date" value={targetDate} onChange={(e) => { setTargetDate(e.target.value); }} required style={{ flex: 1, background: '#000', border: '1px solid #333', color: '#fff', padding: '0.45rem', borderRadius: '4px' }} />
      </div>

      <button type="submit" style={{ background: '#00cc66', color: '#000', border: 'none', padding: '0.5rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
        Deploy Matrix Target
      </button>
    </form>
  );
};