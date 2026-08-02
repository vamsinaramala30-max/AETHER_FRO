import React, { useEffect, useState } from 'react';
import { AIRecommendation, fetchAIRecommendations } from './aiRecommendationsService';
import { RecommendationCard } from './RecommendationCard';

export const AIRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  useEffect(() => {
    fetchAIRecommendations().then(setRecommendations);
  }, []);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold text-white">
          <span>✨</span> Smart Recommendations
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </div>
    </section>
  );
};
