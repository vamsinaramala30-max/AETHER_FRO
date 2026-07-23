import React from 'react';
import { WeeklyReviewData } from './weeklyReviewService';
import { ReviewStats } from './ReviewStats';
import { ReviewInsights } from './ReviewInsights';

interface ReviewSummaryProps {
  review: WeeklyReviewData;
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({ review }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #222', borderRadius: '8px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.9rem', color: '#aaa' }}>Velocity Review Sync Window</span>
        <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#ffaa00', background: '#222', padding: '2px 8px', borderRadius: '4px' }}>W/E {review.weekEnding}</span>
      </div>
      <ReviewStats data={review} />
      <ReviewInsights insights={review.insights} blockers={review.blockers} />
    </div>
  );
};