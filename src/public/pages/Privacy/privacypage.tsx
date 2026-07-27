import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';

export const PrivacyPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <article className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <header className="mb-10 border-b border-zinc-900 pb-8">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-zinc-500">
            Strategic Direction
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            Privacy Principles
          </h1>
          <p className="mt-3 max-w-2xl text-base text-zinc-400 sm:text-lg">
            Our architectural blueprints prioritize granular control, visible access boundaries, and
            total data isolation.
          </p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-zinc-400 sm:text-base">
          <p>
            Aether treats individual data privacy as an unyielding core feature requirement, not a
            secondary checkbox. Our engineering principles ensure that your digital records are
            entirely your own.
          </p>

          <h2 className="mt-6 text-base font-semibold text-zinc-200">Our Core Privacy Targets:</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-400">
            <li>
              <strong>Complete Data Isolation:</strong> Every workspace element references absolute
              user id constraints to prevent cross-tenant data visible states.
            </li>
            <li>
              <strong>No Hidden Telemetry:</strong> We do not track keystroke patterns, text entry
              histories, or personal usage dynamics for monetization or marketing.
            </li>
            <li>
              <strong>Granular Control Hooks:</strong> Manage individual memory parameters easily
              through explicit database deletion operations.
            </li>
          </ul>

          <div className="mt-8 rounded border border-zinc-900 bg-zinc-950 p-4 text-xs italic text-zinc-500">
            Disclaimer Note: This document outlines Aether's fundamental technical design
            philosophy. For regulatory or legal policies, please refer explicitly to our active
            Privacy Policy page.
          </div>
        </div>
      </article>
    </PublicPageLayout>
  );
};
