import React from 'react';
import { PublicPageLayout } from '../components/publicpagelayout';
import { Landing3DBackground } from './Landing3DBackground';
import { Hero } from './Hero/hero';
import { SocialProof } from './Hero/SocialProof';
import { AetherIntroduction } from './AetherIntroduction/aetherintroduction';
import { ProductivityPreview } from './ProductivityPreview/ProductivityPreview';
import { IntelligencePreview } from './Intelligencepreview/intelligencepreview';
import { MemoryPreview } from './MemoryPreview/memorypreview';
import { KnowledgePreview } from './KnowledgePreview/knowledgepreview';
import { AutomationPreview } from './AutomationPreview/automationpreview';
import { PlatformPreview } from './PlatformPreview/PlatformPreview';
import { PrivacyPreview } from './PrivacyPreview/privacypreview';
import { TrustCenterPreview } from './TrustCenterPreview/TrustCenterPreview';
import { CTA } from './CTA/CTA';
import { Footer } from './Footer/footer';

export const LandingIndex: React.FC = () => {
  return (
    <PublicPageLayout>
      <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-[#0B0D12] text-zinc-100 transition-colors duration-300 dark:bg-[#0B0D12] dark:text-zinc-100 light:bg-slate-50 light:text-zinc-900">
        {/* Continuous Interactive 3D / Floating Background Environment */}
        <Landing3DBackground />

        {/* Foreground Content Container */}
        <div className="relative z-10 w-full max-w-full overflow-x-hidden">
          {/* 1. Hero Section */}
          <Hero />

          {/* 2. Trusted By / Social Proof */}
          <SocialProof />

          {/* 3. Product Overview */}
          <AetherIntroduction />

          {/* 4. Core Features & Productivity */}
          <ProductivityPreview />

          {/* 5. AI Capabilities */}
          <IntelligencePreview />

          {/* 6. Cognitive Memory */}
          <MemoryPreview />

          {/* 7. Knowledge Base & Automation */}
          <KnowledgePreview />
          <AutomationPreview />

          {/* 8. Platform Ecosystem */}
          <PlatformPreview />

          {/* 9. Security & Privacy */}
          <PrivacyPreview />
          <TrustCenterPreview />

          {/* 10. Final CTA */}
          <CTA />

          {/* 11. Footer */}
          <Footer />
        </div>
      </div>
    </PublicPageLayout>
  );
};
