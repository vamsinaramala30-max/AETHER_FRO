import React from 'react';
import { AIRecommendation } from './aiRecommendationsService';
import { SuggestedAction } from './SuggestedAction';

interface RecommendationCardProps {
  recommendation: AIRecommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  return (
    <div className="p-4 bg-indigo-950/20 border border-indigo-800/40 rounded-xl space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <h4 className="text-sm font-bold text-white">{recommendation.title}</h4>
        </div>
        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-900/50 px-2 py-0.5 rounded border border-indigo-700/50">
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