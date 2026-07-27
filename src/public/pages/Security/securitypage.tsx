import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';

export const SecurityPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <article className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <header className="mb-10 border-b border-zinc-900 pb-8">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-zinc-500">
            System Infrastructure
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            Security Architecture
          </h1>
          <p className="mt-3 max-w-2xl text-base text-zinc-400 sm:text-lg">
            A transparent overview of system borders, credential management protocols, and host
            network designs.
          </p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-zinc-400 sm:text-base">
          <section aria-labelledby="sec-transit">
            <h2 id="sec-transit" className="mb-2 text-base font-semibold text-zinc-200">
              Data Transmission & Session State
            </h2>
            <p>
              All traffic moving between the public client app and our internal API layer utilizes
              Transport Layer Security (TLS) configuration models to block standard packet
              interception. Session tokens are securely managed at the browser layer using explicit
              modern web standards.
            </p>
          </section>

          <section aria-labelledby="sec-limits">
            <h2 id="sec-limits" className="mb-2 text-base font-semibold text-zinc-200">
              Transparent Infrastructure Scope
            </h2>
            <p>
              We prioritize accurate technical definitions over hype: Aether does not assert
              third-party compliance validation standards like SOC 2, HIPAA, or ISO/IEC 27001 at
              this development stage. System security is continuously optimized internally through
              strict database field isolation, parameterized backend routines, and minimal
              dependencies.
            </p>
          </section>
        </div>
      </article>
    </PublicPageLayout>
  );
};
