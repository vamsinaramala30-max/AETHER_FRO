// frontend/src/automation/future-ai-features/FutureAIFeaturesPage.tsx
import React, { useEffect, useState } from 'react';
import { featureService, PreviewFeature } from './featureAIservice';
import { FeaturePreviewCard } from './featurepreviewcard';

export const FutureAIFeaturesPage: React.FC = () => {
  const [features, setFeatures] = useState<PreviewFeature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    featureService.getPreviews().then((data) => {
      setFeatures(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100">
          Next-Gen Autonomous R&D Labs
        </h1>
        <p className="text-xs text-slate-400">
          Immersive pipeline architectural previews currently being trained on AETHER-Core
          infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {features.map((feat) => (
          <FeaturePreviewCard key={feat.id} feature={feat} />
        ))}
      </div>
    </div>
  );
};
