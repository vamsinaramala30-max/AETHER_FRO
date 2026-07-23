import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';

export const AboutPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <section className="py-20 lg:py-32" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 id="about-heading" className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-100 tracking-tight max-w-4xl mx-auto leading-[1.15] text-center">
            About AETHER
          </h1>
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed text-center">
            AETHER is a next-generation autonomous AI orchestration and SaaS platform designed for high-scale enterprise operations.
          </p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-3">Our Mission</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                To empower organizations with intelligent automation that transforms complex workflows into seamless, efficient processes.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-3">Our Vision</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                A world where AI augments human potential, enabling teams to focus on what matters most.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-3">Our Values</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Privacy-first, enterprise-grade security, and continuous innovation drive everything we build.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
};

