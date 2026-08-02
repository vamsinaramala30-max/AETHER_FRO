import React from 'react';
import { AIRecommendation } from './aiAnalyticsService';
import { RecommendationCard } from './RecommendationCard';

interface SectionProps {
  items: AIRecommendation[];
  onApply?: (id: string) => void;
}

export const Direction: React.FC<SectionProps> = ({ items, onApply }) => {
  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <span>🧭</span> Strategic Direction
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item) => (
          <RecommendationCard key={item.id} recommendation={item} onApply={onApply} />
        ))}
      </div>
    </div>
  );
};
