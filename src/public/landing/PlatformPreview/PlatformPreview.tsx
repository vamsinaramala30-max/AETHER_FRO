import React from 'react';

export const PlatformPreview: React.FC = () => {
  return (
    <section className="py-20 bg-[#0D0F16] border-b border-zinc-900" aria-labelledby="platform-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 id="platform-heading" className="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
            A Multi-Dimensional Strategy Engine
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400">
            Aether transitions your daily operational flow from basic prompt text windows into a deep interconnected graph network.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded text-center">
            <span className="text-xs font-mono text-zinc-500 block mb-1">MODULE 01</span>
            <span className="text-sm font-semibold text-zinc-200">AI Framework</span>
          </div>
          <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded text-center">
            <span className="text-xs font-mono text-zinc-500 block mb-1">MODULE 02</span>
            <span className="text-sm font-semibold text-zinc-200">Projects Layer</span>
          </div>
          <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded text-center">
            <span className="text-xs font-mono text-zinc-500 block mb-1">MODULE 03</span>
            <span className="text-sm font-semibold text-zinc-200">Knowledge Trees</span>
          </div>
          <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded text-center">
            <span className="text-xs font-mono text-zinc-500 block mb-1">MODULE 04</span>
            <span className="text-sm font-semibold text-zinc-200">Automation Loops</span>
          </div>
          <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded text-center">
            <span className="text-xs font-mono text-zinc-500 block mb-1">MODULE 05</span>
            <span className="text-sm font-semibold text-zinc-200">Workspace Hub</span>
          </div>
        </div>
      </div>
    </section>
  );
};