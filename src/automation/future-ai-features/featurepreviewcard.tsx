// frontend/src/automation/future-ai-features/FeaturePreviewCard.tsx
import React from 'react';
import { PreviewFeature } from './featureAIservice';

interface FeaturePreviewCardProps {
  feature: PreviewFeature;
}

export const FeaturePreviewCard: React.FC<FeaturePreviewCardProps> = ({ feature }) => {
  return (
    <div className="relative bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-indigo-950/60 rounded-xl p-5 overflow-hidden shadow-md">
      <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-2 rotate-45 bg-indigo-600/10 text-indigo-400 font-mono text-[9px] uppercase tracking-widest py-1 px-8 border-b border-indigo-500/20">
        Preview Blueprint
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40 font-mono">
            {feature.estimatedArrival}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
            {feature.tierRequirement}
          </span>
        </div>

        <h3 className="text-base font-semibold text-slate-200 tracking-tight">
          {feature.title}
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed">
          {feature.description}
        </p>

        <div className="pt-3 border-t border-slate-900/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Operational Footprint:</span>
          <span className="text-indigo-400/80">{feature.systemImpactScore}</span>
        </div>
      </div>
    </div>
  );
};