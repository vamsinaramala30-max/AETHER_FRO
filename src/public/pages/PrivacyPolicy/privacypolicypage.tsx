import React from 'react';
import { PublicPageLayout } from '../../components/PublicPageLayout';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <article className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <header className="border-b border-zinc-900 pb-8 mb-10">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">Legal Blueprint</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-100 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            Last Updated: July 20, 2026
          </p>
        </header>

        <div className="space-y-6 text-sm text-zinc-400 leading-relaxed">
          <p className="text-amber-200/80 bg-zinc-950 p-3 border border-amber-950/40 rounded text-xs">
            Notice: This document provides an honest technical declaration regarding data treatment, structured for subsequent evaluation by a legal professional.
          </p>

          <section aria-labelledby="policy-1">
            <h2 id="policy-1" className="text-zinc-200 font-semibold text-sm uppercase tracking-wider">1. Information We Collect</h2>
            <p>
              We only retain fields explicitly generated through authenticated application workflows. This includes markdown text nodes, relational task arrays, and voluntary user settings. We do not process tracker elements or profile user habits across external browser pages.
            </p>
          </section>

          <section aria-labelledby="policy-2">
            <h2 id="policy-2" className="text-zinc-200 font-semibold text-sm uppercase tracking-wider">2. How Data is Processed</h2>
            <p>
              User data is exclusively loaded to coordinate features within your personal workspace window. If you direct the platform to connect with third-party prompt targets, only the necessary parameters required to calculate the response are transmitted.
            </p>
          </section>

          <section aria-labelledby="policy-3">
            <h2 id="policy-3" className="text-zinc-200 font-semibold text-sm uppercase tracking-wider">3. Account Deletion Rights</h2>
            <p>
              You have the right to completely wipe your operational database records at any chosen index point. Initiating account deletion systematically purges all associated text segments and personal markers from active production storage drives.
            </p>
          </section>
        </div>
      </article>
    </PublicPageLayout>
  );
};