import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';

export const FeaturesPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <article className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <header className="mb-10 border-b border-zinc-900 pb-8">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-zinc-500">
            Platform Features
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            Enterprise-Grade Features
          </h1>
          <p className="mt-3 max-w-2xl text-base text-zinc-400 sm:text-lg">
            Comprehensive suite of productivity and AI-powered tools.
          </p>
        </header>
        <div className="space-y-8 text-sm leading-relaxed text-zinc-400 sm:text-base">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">Core Capabilities</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>AI-powered assistant with context awareness</li>
              <li>Knowledge management with vector search</li>
              <li>Project and task management</li>
              <li>Workflow automation</li>
              <li>Workspace productivity tools</li>
            </ul>
          </section>
        </div>
      </article>
    </PublicPageLayout>
  );
};

export default FeaturesPage;
