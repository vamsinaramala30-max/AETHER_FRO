import React from 'react';
import { PublicPageLayout } from '../components/publicpagelayout';
import { Hero } from './Hero/hero';
import { SocialProof } from './Hero/SocialProof';
import { AetherIntroduction } from './AetherIntroduction/aetherintroduction';
import { IntelligencePreview } from './IntelligencePreview/intelligencepreview';
import { ProductivityPreview } from './ProductivityPreview/ProductivityPreview';
import { MemoryPreview } from './MemoryPreview/memorypreview';
import { KnowledgePreview } from './KnowledgePreview/knowledgepreview';
import { AutomationPreview } from './AutomationPreview/automationpreview';
import { PrivacyPreview } from './PrivacyPreview/privacypreview';
import { TrustCenterPreview } from './TrustCenterPreview/TrustCenterPreview';
import { PlatformPreview } from './PlatformPreview/PlatformPreview';
import { CTA } from './CTA/CTA';

export const LandingIndex: React.FC = () => {
  return (
    <PublicPageLayout>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trusted By / Social Proof */}
      <SocialProof />

      {/* 3. Product Overview */}
      <AetherIntroduction />

      {/* 4. Core Features */}
      <ProductivityPreview />

      {/* 5. AI Capabilities */}
      <IntelligencePreview />

      {/* 6. Memory & Workspace Preview */}
      <MemoryPreview />

      {/* 7. Knowledge Base & Automation */}
      <KnowledgePreview />
      <AutomationPreview />

      {/* 8. Security & Privacy */}
      <PrivacyPreview />
      <TrustCenterPreview />

      {/* 9. Platform Preview & Ecosystem */}
      <PlatformPreview />

      {/* 10. Final CTA */}
      <CTA />
    </PublicPageLayout>
  );
};
