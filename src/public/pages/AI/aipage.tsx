import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';

export const AIPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <article className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <header className="mb-10 border-b border-zinc-900 pb-8">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-zinc-500">
            Intelligence Architecture
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            Integrated Intelligence Model
          </h1>
          <p className="mt-3 max-w-2xl text-base text-zinc-400 sm:text-lg">
            Understanding how Aether handles large language model pipelines without leaking tenant
            boundaries or tracking user metadata.
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-zinc-400 sm:text-base">
          <section aria-labelledby="ai-intent">
            <h2 id="ai-intent" className="mb-3 text-lg font-semibold text-zinc-200">
              Context Parsing & Prompt Assembly
            </h2>
            <p>
              Aether acts as a specialized preprocessing abstraction layer. When an authenticated
              user submits an intent request, Aether automatically queries internal relational
              tables—like active milestones or markdown files—to build a comprehensive context
              snapshot before interacting with configured processing endpoints.
            </p>
          </section>

          <section
            className="rounded border border-zinc-900 bg-zinc-950 p-4 font-mono text-xs text-zinc-500"
            aria-label="System Pipeline Blueprint"
          >
            <p className="mb-1 text-zinc-400">PROMPT STRUCT PIPELINE:</p>
            <p>
              [User Intent Command] → [Query Internal Schema Context] → [Secure Payload Assembly] →
              [Target Execution]
            </p>
          </section>

          <section aria-labelledby="ai-transparency">
            <h2 id="ai-transparency" className="mb-3 text-lg font-semibold text-zinc-200">
              Honest Boundaries
            </h2>
            <p>
              We do not execute automated neural calculations in the browser window for
              unauthenticated users. This page represents a structural preview of our core
              integration design framework. Full execution parameters are only activated behind
              secure, verified authentication tokens.
            </p>
          </section>
        </div>
      </article>
    </PublicPageLayout>
  );
};
