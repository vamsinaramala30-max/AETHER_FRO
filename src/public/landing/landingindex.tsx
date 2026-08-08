import React from 'react';
import { PublicPageLayout } from '../components/publicpagelayout';
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

export const LandingIndex: React.FC = () => {
  return (
    <PublicPageLayout>
      <div className="relative w-full bg-[#0B0D12]">
        {/* Subtle persistent background glow gradients for a unified seamless page transition */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]" />
        <div className="pointer-events-none absolute inset-x-0 top-1/3 h-[800px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(79,70,229,0.06),rgba(0,0,0,0))]" />
        <div className="pointer-events-none absolute inset-x-0 top-2/3 h-[800px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(6,182,212,0.05),rgba(0,0,0,0))]" />

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
      </div>
    </PublicPageLayout>
  );
};
