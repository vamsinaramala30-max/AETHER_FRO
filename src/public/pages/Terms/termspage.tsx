import React from 'react';
import { PublicPageLayout } from '../../components/PublicPageLayout';

export const TermsPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <article className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <header className="mb-10 border-b border-zinc-900 pb-8">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-zinc-500">
            Operational Guidelines
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-zinc-500">Effective Date: July 20, 2026</p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-zinc-400">
          <p className="rounded border border-amber-950/40 bg-zinc-950 p-3 text-xs text-amber-200/80">
            Notice: This document contains structural terms framework text optimized for future
            legal counsel assessment. It should not be used as final binding legal protection.
          </p>

          <section aria-labelledby="terms-1">
            <h2
              id="terms-1"
              className="text-sm font-semibold uppercase tracking-wider text-zinc-200"
            >
              1. Account Creation & API Usage
            </h2>
            <p>
              Users must authenticate securely to access individual workspace modules. You remain
              uniquely responsible for protecting active credentials and session tokens against
              exposure to third parties.
            </p>
          </section>

          <section aria-labelledby="terms-2">
            <h2
              id="terms-2"
              className="text-sm font-semibold uppercase tracking-wider text-zinc-200"
            >
              2. System Boundaries & Availability
            </h2>
            <p>
              Aether provides local developer testing support and personal workspace structuring.
              The platform is offered on an "as-is" configuration matrix. We explicitly disclaim
              responsibility for individual state losses caused by custom endpoint misconfigurations
              (e.g., unexpected local API server crashes).
            </p>
          </section>

          <section aria-labelledby="terms-3">
            <h2
              id="terms-3"
              className="text-sm font-semibold uppercase tracking-wider text-zinc-200"
            >
              3. Data Ownership Rights
            </h2>
            <p>
              You maintain absolute proprietary ownership over all uploaded markdown notes, text
              schemas, tasks, and memory descriptions. Aether claims no ownership stake or
              monetization rights regarding your records.
            </p>
          </section>
        </div>
      </article>
    </PublicPageLayout>
  );
};
