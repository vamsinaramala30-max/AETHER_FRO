import React from 'react';
import { PublicPageLayout } from '../components/publicpagelayout';
import { Hero } from './Hero/hero';
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
      <Hero />
      <AetherIntroduction />
      <IntelligencePreview />
      <ProductivityPreview />
      <MemoryPreview />
      <KnowledgePreview />
      <AutomationPreview />
      <PrivacyPreview />
      <TrustCenterPreview />
      <PlatformPreview />
      <CTA />
    </PublicPageLayout>
  );
};