import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <article className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <header className="mb-10 border-b border-zinc-900 pb-8">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-zinc-500">
            Legal Blueprint
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-zinc-500">Last Updated: July 20, 2026</p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-zinc-400">
          <p className="rounded border border-amber-950/40 bg-zinc-950 p-3 text-xs text-amber-200/80">
            Notice: This document provides an honest technical declaration regarding data treatment,
            structured for subsequent evaluation by a legal professional.
          </p>

          <section aria-labelledby="policy-1">
            <h2
              id="policy-1"
              className="text-sm font-semibold uppercase tracking-wider text-zinc-200"
            >
              1. Information We Collect
            </h2>
            <p>
              We only retain fields explicitly generated through authenticated application
              workflows. This includes markdown text nodes, relational task arrays, and voluntary
              user settings. We do not process tracker elements or profile user habits across
              external browser pages.
            </p>
          </section>

          <section aria-labelledby="policy-2">
            <h2
              id="policy-2"
              className="text-sm font-semibold uppercase tracking-wider text-zinc-200"
            >
              2. How Data is Processed
            </h2>
            <p>
              User data is exclusively loaded to coordinate features within your personal workspace
              window. If you direct the platform to connect with third-party prompt targets, only
              the necessary parameters required to calculate the response are transmitted.
            </p>
          </section>

          <section aria-labelledby="policy-3">
            <h2
              id="policy-3"
              className="text-sm font-semibold uppercase tracking-wider text-zinc-200"
            >
              3. Account Deletion Rights
            </h2>
            <p>
              You have the right to completely wipe your operational database records at any chosen
              index point. Initiating account deletion systematically purges all associated text
              segments and personal markers from active production storage drives.
            </p>
          </section>
        </div>
      </article>
    </PublicPageLayout>
  );
};
