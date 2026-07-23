import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';

export const AIPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <article className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <header className="border-b border-zinc-900 pb-8 mb-10">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">Intelligence Architecture</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-100 tracking-tight">
            Integrated Intelligence Model
          </h1>
          <p className="mt-3 text-base sm:text-lg text-zinc-400 max-w-2xl">
            Understanding how Aether handles large language model pipelines without leaking tenant boundaries or tracking user metadata.
          </p>
        </header>

        <div className="space-y-8 text-sm sm:text-base text-zinc-400 leading-relaxed">
          <section aria-labelledby="ai-intent">
            <h2 id="ai-intent" className="text-lg font-semibold text-zinc-200 mb-3">Context Parsing & Prompt Assembly</h2>
            <p>
              Aether acts as a specialized preprocessing abstraction layer. When an authenticated user submits an intent request, Aether automatically queries internal relational tables—like active milestones or markdown files—to build a comprehensive context snapshot before interacting with configured processing endpoints.
            </p>
          </section>

          <section className="p-4 bg-zinc-950 border border-zinc-900 rounded font-mono text-xs text-zinc-500" aria-label="System Pipeline Blueprint">
            <p className="text-zinc-400 mb-1">PROMPT STRUCT PIPELINE:</p>
            <p>[User Intent Command] → [Query Internal Schema Context] → [Secure Payload Assembly] → [Target Execution]</p>
          </section>

          <section aria-labelledby="ai-transparency">
            <h2 id="ai-transparency" className="text-lg font-semibold text-zinc-200 mb-3">Honest Boundaries</h2>
            <p>
              We do not execute automated neural calculations in the browser window for unauthenticated users. This page represents a structural preview of our core integration design framework. Full execution parameters are only activated behind secure, verified authentication tokens.
            </p>
          </section>
        </div>
      </article>
    </PublicPageLayout>
  );
};