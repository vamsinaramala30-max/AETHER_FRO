import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';

export const AboutPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <section className="py-20 lg:py-32" aria-labelledby="about-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1
            id="about-heading"
            className="mx-auto max-w-4xl text-center text-4xl font-semibold leading-[1.15] tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl"
          >
            About AETHER
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-zinc-400 sm:text-lg lg:text-xl">
            AETHER is a next-generation autonomous AI orchestration and SaaS platform designed for
            high-scale enterprise operations.
          </p>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="mb-3 text-lg font-semibold text-zinc-100">Our Mission</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                To empower organizations with intelligent automation that transforms complex
                workflows into seamless, efficient processes.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="mb-3 text-lg font-semibold text-zinc-100">Our Vision</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                A world where AI augments human potential, enabling teams to focus on what matters
                most.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="mb-3 text-lg font-semibold text-zinc-100">Our Values</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Privacy-first, enterprise-grade security, and continuous innovation drive everything
                we build.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
};
