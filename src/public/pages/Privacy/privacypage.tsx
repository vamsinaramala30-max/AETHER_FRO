import React from 'react';
import { PublicPageLayout } from '../../components/PublicPageLayout';

export const PrivacyPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <article className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <header className="border-b border-zinc-900 pb-8 mb-10">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">Strategic Direction</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-100 tracking-tight">
            Privacy Principles
          </h1>
          <p className="mt-3 text-base sm:text-lg text-zinc-400 max-w-2xl">
            Our architectural blueprints prioritize granular control, visible access boundaries, and total data isolation.
          </p>
        </header>

        <div className="space-y-6 text-sm sm:text-base text-zinc-400 leading-relaxed">
          <p>
            Aether treats individual data privacy as an unyielding core feature requirement, not a secondary checkbox. Our engineering principles ensure that your digital records are entirely your own.
          </p>
          
          <h2 className="text-base font-semibold text-zinc-200 mt-6">Our Core Privacy Targets:</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-400">
            <li><strong>Complete Data Isolation:</strong> Every workspace element references absolute user id constraints to prevent cross-tenant data visible states.</li>
            <li><strong>No Hidden Telemetry:</strong> We do not track keystroke patterns, text entry histories, or personal usage dynamics for monetization or marketing.</li>
            <li><strong>Granular Control Hooks:</strong> Manage individual memory parameters easily through explicit database deletion operations.</li>
          </ul>

          <div className="mt-8 p-4 bg-zinc-950 border border-zinc-900 rounded text-xs text-zinc-500 italic">
            Disclaimer Note: This document outlines Aether's fundamental technical design philosophy. For regulatory or legal policies, please refer explicitly to our active Privacy Policy page.
          </div>
        </div>
      </article>
    </PublicPageLayout>
  );
};