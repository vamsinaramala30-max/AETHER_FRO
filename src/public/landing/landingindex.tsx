import React from 'react';
import { PublicPageLayout } from '../components/publicpagelayout';
import { Landing3DBackground } from './Landing3DBackground';
import { Hero } from './Hero/hero';
import { FeatureBlocks } from './FeatureBlocks';
import { HowItWorks } from './HowItWorks';
import { BetaBanner } from './BetaBanner';

export const LandingIndex: React.FC = () => {
  return (
    <PublicPageLayout>
      <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-[#0B0D12] text-zinc-100 transition-colors duration-300 dark:bg-[#0B0D12] dark:text-zinc-100">
        {/* Continuous Interactive 3D / Floating Background Environment */}
        <Landing3DBackground />

        {/* Foreground Content Container */}
        <div className="relative z-10 w-full max-w-full overflow-x-hidden">
          {/* 1. Hero Section */}
          <Hero />

          {/* 2. Three Feature Blocks */}
          <FeatureBlocks />

          {/* 3. How It Works (3 short steps) */}
          <HowItWorks />

          {/* 4. Free during beta */}
          <BetaBanner />
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default LandingIndex;
