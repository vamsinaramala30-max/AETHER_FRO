import React from 'react';
import { WeeklyReviewData } from './weeklyReviewService';

interface ReviewStatsProps {
  data: WeeklyReviewData;
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({ data }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      <div
        style={{
          background: '#141414',
          border: '1px solid #222',
          padding: '1.25rem',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: '0.8rem',
            color: '#777',
            textTransform: 'uppercase',
            marginBottom: '0.25rem',
          }}
        >
          Tasks Dropped to Prod
        </span>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#00cc66' }}>
          {data.tasksCompleted}
        </span>
      </div>
      <div
        style={{
          background: '#141414',
          border: '1px solid #222',
          padding: '1.25rem',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: '0.8rem',
            color: '#777',
            textTransform: 'uppercase',
            marginBottom: '0.25rem',
          }}
        >
          Deep Execution Hours
        </span>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0066cc' }}>
          {data.hoursFocused}h
        </span>
      </div>
      <div
        style={{
          background: '#141414',
          border: '1px solid #222',
          padding: '1.25rem',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: '0.8rem',
            color: '#777',
            textTransform: 'uppercase',
            marginBottom: '0.25rem',
          }}
        >
          Vector Horizons Advanced
        </span>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#ffaa00' }}>
          {data.goalsAdvanced}
        </span>
      </div>
    </div>
  );
};
