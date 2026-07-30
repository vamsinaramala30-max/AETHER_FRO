import React from 'react';
import { AIRecommendation } from './aiAnalyticsService';
import { RecommendationCard } from './RecommendationCard';

interface SectionProps {
  items: AIRecommendation[];
  onApply?: (id: string) => void;
}

export const Optimize: React.FC<SectionProps> = ({ items, onApply }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <span>⚡</span> Performance Optimization
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <RecommendationCard key={item.id} recommendation={item} onApply={onApply} />
        ))}
      </div>
    </div>
  );
};Optimize.tsx