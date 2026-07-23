import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';

export const FeaturesPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <article className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <header className="border-b border-zinc-900 pb-8 mb-10">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">Platform Features</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-100 tracking-tight">
            Enterprise-Grade Features
          </h1>
          <p className="mt-3 text-base sm:text-lg text-zinc-400 max-w-2xl">
            Comprehensive suite of productivity and AI-powered tools.
          </p>
        </header>
        <div className="space-y-8 text-sm sm:text-base text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-zinc-200 mb-3">Core Capabilities</h2>
            <ul className="list-disc pl-6 space-y-2">
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

