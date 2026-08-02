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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityColor}`}>
          {recommendation.priority.toUpperCase()} PRIORITY
        </span>
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
          Impact: +{recommendation.impactScore}%
        </span>
      </div>
      <h4 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
        {recommendation.title}
      </h4>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        {recommendation.description}
      </p>
      <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-700/50 dark:bg-slate-900/50">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Action Step:</p>
        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
          {recommendation.actionableStep}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onApply?.(recommendation.id)}
        className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-center text-xs font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
      >
        Apply AI Recommendation
      </button>
    </div>
  );
};
