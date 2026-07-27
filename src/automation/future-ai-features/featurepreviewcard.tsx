// frontend/src/automation/future-ai-features/FeaturePreviewCard.tsx
import React from 'react';
import { PreviewFeature } from './featureAIservice';

interface FeaturePreviewCardProps {
  feature: PreviewFeature;
}

export const FeaturePreviewCard: React.FC<FeaturePreviewCardProps> = ({ feature }) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-indigo-950/60 bg-gradient-to-br from-slate-900/60 to-slate-950/80 p-5 shadow-md">
      <div className="absolute right-0 top-0 -translate-y-2 translate-x-8 rotate-45 transform border-b border-indigo-500/20 bg-indigo-600/10 px-8 py-1 font-mono text-[9px] uppercase tracking-widest text-indigo-400">
        Preview Blueprint
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded border border-indigo-800/40 bg-indigo-950 px-2 py-0.5 font-mono text-[10px] text-indigo-300">
            {feature.estimatedArrival}
          </span>
          <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-mono text-[10px] text-slate-400">
            {feature.tierRequirement}
          </span>
        </div>

        <h3 className="text-base font-semibold tracking-tight text-slate-200">{feature.title}</h3>

        <p className="text-xs leading-relaxed text-slate-400">{feature.description}</p>

        <div className="flex items-center justify-between border-t border-slate-900/60 pt-3 font-mono text-[11px] text-slate-500">
          <span>Operational Footprint:</span>
          <span className="text-indigo-400/80">{feature.systemImpactScore}</span>
        </div>
      </div>
    </div>
  );
};
