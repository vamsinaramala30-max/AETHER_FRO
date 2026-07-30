import React from 'react';
import { AIRecommendation } from './aiAnalyticsService';

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  onApply?: (id: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onApply,
}) => {
  const priorityColor =
    recommendation.priority === 'high'
      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
      : recommendation.priority === 'medium'
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${priorityColor}`}>
          {recommendation.priority.toUpperCase()} PRIORITY
        </span>
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
          Impact: +{recommendation.impactScore}%
        </span>
      </div>
      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
        {recommendation.title}
      </h4>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        {recommendation.description}
      </p>
      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50 mb-4">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Action Step:</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          {recommendation.actionableStep}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onApply?.(recommendation.id)}
        className="w-full py-2 px-3 text-xs font-medium text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
      >
        Apply AI Recommendation
      </button>
    </div>
  );
};