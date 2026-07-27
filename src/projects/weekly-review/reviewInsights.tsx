import React from 'react';

interface ReviewInsightsProps {
  insights: string[];
  blockers: string[];
}

export const ReviewInsights: React.FC<ReviewInsightsProps> = ({ insights, blockers }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}
    >
      <div
        style={{
          background: '#141414',
          border: '1px solid #222',
          padding: '1.25rem',
          borderRadius: '8px',
        }}
      >
        <h4
          style={{
            margin: '0 0 1rem 0',
            fontSize: '0.9rem',
            color: '#00cc66',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Retrospective Synthetics
        </h4>
        <ul
          style={{
            margin: 0,
            paddingLeft: '1.2rem',
            color: '#ccc',
            fontSize: '0.85rem',
            lineHeight: '1.6',
          }}
        >
          {insights.map((insight, idx) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>
              {insight}
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          background: '#141414',
          border: '1px solid #222',
          padding: '1.25rem',
          borderRadius: '8px',
        }}
      >
        <h4
          style={{
            margin: '0 0 1rem 0',
            fontSize: '0.9rem',
            color: '#ff4d4d',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Active Core Blockers
        </h4>
        {blockers.length === 0 ? (
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', fontStyle: 'italic' }}>
            Zero structural friction vectors registered.
          </p>
        ) : (
          <ul
            style={{
              margin: 0,
              paddingLeft: '1.2rem',
              color: '#ccc',
              fontSize: '0.85rem',
              lineHeight: '1.6',
            }}
          >
            {blockers.map((blocker, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>
                {blocker}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
