import React from 'react';

interface GoalProgressProps {
  progress: number;
}

export const GoalProgress: React.FC<GoalProgressProps> = ({ progress }) => {
  const progressPercent = Math.min(100, Math.max(0, progress));
  
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem', color: '#aaa' }}>
        <span>Execution Depth</span>
        <span style={{ fontWeight: 'bold', color: '#00cc66' }}>{progressPercent}%</span>
      </div>
      <div style={{ width: '100%', height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #0066cc, #00cc66)', borderRadius: '3px', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      </div>
    </div>
  );
};