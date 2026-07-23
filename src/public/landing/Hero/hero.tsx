import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32 border-b border-zinc-900" aria-labelledby="hero-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Subtle, High-End Platform Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
          <span className="text-xs text-zinc-400 tracking-wider uppercase font-medium">Aether Architecture Ecosystem</span>
        </div>

        {/* High-Impact Heading Hierarchy */}
        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-100 tracking-tight max-w-4xl mx-auto leading-[1.15]"
        >
          A unified layer for personal intelligence, structure, and focus.
        </h1>

        <p className="mt-6 text-base sm:text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Aether orchestrates tasks, durable knowledge, cognitive memory support, and custom contextual automation. A professional productivity paradigm engineered for local precision.
        </p>

        {/* Actions Segment */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/signup"
            className="w-full sm:w-auto text-center px-6 py-3 text-sm font-medium bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-colors rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12]"
          >
            Create account
          </a>
          <a
            href="/signin"
            className="w-full sm:w-auto text-center px-6 py-3 text-sm font-medium bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800/60 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            Sign in
          </a>
        </div>

        {/* Premium Structural UI Preview Placeholder */}
        <div className="mt-16 max-w-5xl mx-auto bg-zinc-950 border border-zinc-800/80 rounded-xl p-3 shadow-2xl relative">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-900 bg-zinc-950 text-xs text-zinc-500 rounded-t-lg">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            </div>
            <span className="ml-4 font-mono select-none">aether://workspace/core</span>
          </div>
          <div className="bg-[#0B0D12] h-64 sm:h-96 rounded-b-lg flex flex-col items-center justify-center p-6 text-left border border-zinc-900">
            <div className="w-full max-w-xl space-y-4 font-mono text-xs sm:text-sm text-zinc-500">
              <p className="text-zinc-400">// Platform Identity Simulation</p>
              <p className="text-zinc-300">Initialized Aether environment. Ready for state synchronization.</p>
              <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-md space-y-2">
                <div className="h-2 w-1/3 bg-zinc-800 rounded" />
                <div className="h-2 w-2/3 bg-zinc-800 rounded" />
                <div className="h-2 w-1/2 bg-zinc-980 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};