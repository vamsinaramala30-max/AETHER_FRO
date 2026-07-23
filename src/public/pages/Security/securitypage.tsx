import React from 'react';
import { PublicPageLayout } from '../../components/PublicPageLayout';

export const SecurityPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <article className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <header className="border-b border-zinc-900 pb-8 mb-10">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">System Infrastructure</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-100 tracking-tight">
            Security Architecture
          </h1>
          <p className="mt-3 text-base sm:text-lg text-zinc-400 max-w-2xl">
            A transparent overview of system borders, credential management protocols, and host network designs.
          </p>
        </header>

        <div className="space-y-6 text-sm sm:text-base text-zinc-400 leading-relaxed">
          <section aria-labelledby="sec-transit">
            <h2 id="sec-transit" className="text-base font-semibold text-zinc-200 mb-2">Data Transmission & Session State</h2>
            <p>
              All traffic moving between the public client app and our internal API layer utilizes Transport Layer Security (TLS) configuration models to block standard packet interception. Session tokens are securely managed at the browser layer using explicit modern web standards.
            </p>
          </section>

          <section aria-labelledby="sec-limits">
            <h2 id="sec-limits" className="text-base font-semibold text-zinc-200 mb-2">Transparent Infrastructure Scope</h2>
            <p>
              We prioritize accurate technical definitions over hype: Aether does not assert third-party compliance validation standards like SOC 2, HIPAA, or ISO/IEC 27001 at this development stage. System security is continuously optimized internally through strict database field isolation, parameterized backend routines, and minimal dependencies.
            </p>
          </section>
        </div>
      </article>
    </PublicPageLayout>
  );
};