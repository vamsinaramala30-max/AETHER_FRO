import React, { useState } from 'react';
import { Goal } from './goalService';
import { GoalProgress } from './GoalProgress';

interface GoalCardProps {
  goal: Goal;
  onUpdateProgress: (id: string, nextProgress: number) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdateProgress }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(goal.progress);

  const saveProgress = () => {
    onUpdateProgress(goal.id, inputValue);
    setEditing(false);
  };

  return (
    <div style={{ background: '#141414', border: '1px solid #232323', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', background: '#222', color: '#999', fontWeight: 'bold', border: '1px solid #333' }}>
            {goal.category}
          </span>
          <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem', fontWeight: 600, color: '#f0f0f0' }}>{goal.title}</h3>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: '0.85rem', color: '#aaa', lineHeight: 1.4 }}>{goal.description}</p>
      
      <div style={{ background: '#0a0a0a', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid #1f1f1f', fontSize: '0.8rem', color: '#888' }}>
        <strong style={{ color: '#ccc' }}>Success Criteria:</strong> {goal.metrics}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
        <GoalProgress progress={goal.progress} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
        {editing ? (
          <>
            <input
              type="number"
              min="0"
              max="100"
              value={inputValue}
              onChange={(e) => { setInputValue(parseInt(e.target.value) || 0); }}
              style={{ background: '#000', border: '1px solid #444', color: '#fff', padding: '2px 6px', borderRadius: '4px', width: '60px', fontSize: '0.8rem' }}
            />
            <button onClick={saveProgress} style={{ background: '#00cc66', border: 'none', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Save</button>
            <button onClick={() => { setEditing(false); }} style={{ background: 'transparent', border: '1px solid #444', color: '#aaa', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Cancel</button>
          </>
        ) : (
          <button onClick={() => { setEditing(true); }} style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>
            Adjust Progression Metrics
          </button>
        )}
        <span style={{ fontSize: '0.75rem', color: '#555', marginLeft: 'auto' }}>Target: {goal.targetDate}</span>
      </div>
    </div>
  );
};