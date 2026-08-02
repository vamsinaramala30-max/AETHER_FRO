import React from 'react';
import { AIRecommendation } from './aiRecommendationsService';
import { SuggestedAction } from './SuggestedAction';

interface RecommendationCardProps {
  recommendation: AIRecommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  return (
    <div className="space-y-3 rounded-xl border border-indigo-800/40 bg-indigo-950/20 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
          <h4 className="text-sm font-bold text-white">{recommendation.title}</h4>
        </div>
        <span className="rounded border border-indigo-700/50 bg-indigo-900/50 px-2 py-0.5 font-mono text-[10px] text-indigo-300">
          {(recommendation.confidenceScore * 100).toFixed(0)}% match
        </span>
      </div>

      <p className="text-xs text-slate-300">{recommendation.reason}</p>

      <div className="flex flex-wrap gap-2 pt-1">
        {recommendation.suggestedActions.map((sa) => (
          <SuggestedAction
            key={sa.id}
            label={sa.label}
            onExecute={() => alert(`Executed action payload: ${sa.actionPayload}`)}
          />
        ))}
      </div>
    </div>
  );
};
