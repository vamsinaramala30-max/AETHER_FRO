import React, { useState, useEffect } from 'react';
import { weeklyReviewService, WeeklyReviewData } from './weeklyreviewservice';
import { ReviewSummary } from './reviewsummary';

export const WeeklyReviewPage: React.FC = () => {
  const [reviewData, setReviewData] = useState<WeeklyReviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    weeklyReviewService
      .getLatestReview()
      .then((data) => {
        setReviewData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div style={{ color: '#00cc66', padding: '2rem', textAlign: 'center' }}>
        Synthesizing ledger velocity models...
      </div>
    );

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>
          Architectural Retrospective
        </h1>
        <p style={{ margin: '0.25rem 0 0 0', color: '#888' }}>
          Evaluate localized engineering metrics and resolve downstream systemic dependencies.
        </p>
      </div>

      {reviewData ? (
        <ReviewSummary review={reviewData} />
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            border: '1px dashed #333',
            borderRadius: '8px',
            color: '#555',
          }}
        >
          No synchronization snapshots found for the active execution iteration block.
        </div>
      )}
    </div>
  );
};
