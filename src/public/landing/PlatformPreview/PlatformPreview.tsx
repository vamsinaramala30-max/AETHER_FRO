import React from 'react';

export const PlatformPreview: React.FC = () => {
  return (
    <section
      className="border-b border-zinc-800/40 dark:border-zinc-800/40 light:border-zinc-200/60 bg-zinc-950/20 dark:bg-zinc-950/20 light:bg-white/30 backdrop-blur-md py-16 sm:py-20 lg:py-24"
      aria-labelledby="platform-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <h2
            id="platform-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 light:text-zinc-900 sm:text-3xl"
          >
            A Multi-Dimensional Strategy Engine
          </h2>
          <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 sm:text-base">
            Aether transitions your daily operational flow from basic prompt text windows into a
            deep interconnected graph network.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          <div className="rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200/80 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white/70 p-3.5 sm:p-4 text-center backdrop-blur-xl shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-500/30">
            <span className="mb-1 block font-mono text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 light:text-zinc-500">MODULE 01</span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-100 dark:text-zinc-100 light:text-zinc-900">AI Framework</span>
          </div>
          <div className="rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200/80 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white/70 p-3.5 sm:p-4 text-center backdrop-blur-xl shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-500/30">
            <span className="mb-1 block font-mono text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 light:text-zinc-500">MODULE 02</span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-100 dark:text-zinc-100 light:text-zinc-900">Projects Layer</span>
          </div>
          <div className="rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200/80 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white/70 p-3.5 sm:p-4 text-center backdrop-blur-xl shadow-sm transition-all hover:-translate-y-1 hover:border-purple-500/30">
            <span className="mb-1 block font-mono text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 light:text-zinc-500">MODULE 03</span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-100 dark:text-zinc-100 light:text-zinc-900">Knowledge Trees</span>
          </div>
          <div className="rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200/80 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white/70 p-3.5 sm:p-4 text-center backdrop-blur-xl shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-500/30">
            <span className="mb-1 block font-mono text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 light:text-zinc-500">MODULE 04</span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-100 dark:text-zinc-100 light:text-zinc-900">Automation Loops</span>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200/80 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white/70 p-3.5 sm:p-4 text-center backdrop-blur-xl shadow-sm transition-all hover:-translate-y-1 hover:border-amber-500/30">
            <span className="mb-1 block font-mono text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 light:text-zinc-500">MODULE 05</span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-100 dark:text-zinc-100 light:text-zinc-900">Workspace Hub</span>
          </div>
        </div>
      </div>
    </section>
  );
};
