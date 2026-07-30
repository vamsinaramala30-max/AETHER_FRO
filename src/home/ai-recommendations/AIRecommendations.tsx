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
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>✨</span> Smart Recommendations
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </div>
    </section>
  );
};