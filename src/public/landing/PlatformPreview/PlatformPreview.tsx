import React from 'react';

export const PlatformPreview: React.FC = () => {
  return (
    <section
      className="border-b border-zinc-900 bg-[#0D0F16] py-20"
      aria-labelledby="platform-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2
            id="platform-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl"
          >
            A Multi-Dimensional Strategy Engine
          </h2>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            Aether transitions your daily operational flow from basic prompt text windows into a
            deep interconnected graph network.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded border border-zinc-800/80 bg-zinc-900/40 p-4 text-center">
            <span className="mb-1 block font-mono text-xs text-zinc-500">MODULE 01</span>
            <span className="text-sm font-semibold text-zinc-200">AI Framework</span>
          </div>
          <div className="rounded border border-zinc-800/80 bg-zinc-900/40 p-4 text-center">
            <span className="mb-1 block font-mono text-xs text-zinc-500">MODULE 02</span>
            <span className="text-sm font-semibold text-zinc-200">Projects Layer</span>
          </div>
          <div className="rounded border border-zinc-800/80 bg-zinc-900/40 p-4 text-center">
            <span className="mb-1 block font-mono text-xs text-zinc-500">MODULE 03</span>
            <span className="text-sm font-semibold text-zinc-200">Knowledge Trees</span>
          </div>
          <div className="rounded border border-zinc-800/80 bg-zinc-900/40 p-4 text-center">
            <span className="mb-1 block font-mono text-xs text-zinc-500">MODULE 04</span>
            <span className="text-sm font-semibold text-zinc-200">Automation Loops</span>
          </div>
          <div className="rounded border border-zinc-800/80 bg-zinc-900/40 p-4 text-center">
            <span className="mb-1 block font-mono text-xs text-zinc-500">MODULE 05</span>
            <span className="text-sm font-semibold text-zinc-200">Workspace Hub</span>
          </div>
        </div>
      </div>
    </section>
  );
};
