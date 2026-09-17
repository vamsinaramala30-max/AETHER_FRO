import React from 'react';

export const PlatformPreview: React.FC = () => {
  return (
    <section
      className="light:border-zinc-200/60 light:bg-white/30 border-b border-zinc-800/40 bg-zinc-950/20 py-16 backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-950/20 sm:py-20 lg:py-24"
      aria-labelledby="platform-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <h2
            id="platform-heading"
            className="light:text-zinc-900 text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 sm:text-3xl"
          >
            A Multi-Dimensional Strategy Engine
          </h2>
          <p className="light:text-zinc-600 mt-3 text-xs text-zinc-400 dark:text-zinc-400 sm:text-base">
            Aether transitions your daily operational flow from basic prompt text windows into a
            deep interconnected graph network.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 text-center shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-indigo-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-4">
            <span className="light:text-zinc-500 mb-1 block font-mono text-[10px] text-zinc-400 dark:text-zinc-500 sm:text-xs">
              MODULE 01
            </span>
            <span className="light:text-zinc-900 text-xs font-semibold text-zinc-100 dark:text-zinc-100 sm:text-sm">
              AI Framework
            </span>
          </div>
          <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 text-center shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-cyan-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-4">
            <span className="light:text-zinc-500 mb-1 block font-mono text-[10px] text-zinc-400 dark:text-zinc-500 sm:text-xs">
              MODULE 02
            </span>
            <span className="light:text-zinc-900 text-xs font-semibold text-zinc-100 dark:text-zinc-100 sm:text-sm">
              Projects Layer
            </span>
          </div>
          <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 text-center shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-purple-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-4">
            <span className="light:text-zinc-500 mb-1 block font-mono text-[10px] text-zinc-400 dark:text-zinc-500 sm:text-xs">
              MODULE 03
            </span>
            <span className="light:text-zinc-900 text-xs font-semibold text-zinc-100 dark:text-zinc-100 sm:text-sm">
              Knowledge Trees
            </span>
          </div>
          <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 text-center shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-emerald-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-4">
            <span className="light:text-zinc-500 mb-1 block font-mono text-[10px] text-zinc-400 dark:text-zinc-500 sm:text-xs">
              MODULE 04
            </span>
            <span className="light:text-zinc-900 text-xs font-semibold text-zinc-100 dark:text-zinc-100 sm:text-sm">
              Automation Loops
            </span>
          </div>
          <div className="light:border-zinc-200/80 light:bg-white/70 col-span-2 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 text-center shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-amber-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:col-span-1 sm:p-4">
            <span className="light:text-zinc-500 mb-1 block font-mono text-[10px] text-zinc-400 dark:text-zinc-500 sm:text-xs">
              MODULE 05
            </span>
            <span className="light:text-zinc-900 text-xs font-semibold text-zinc-100 dark:text-zinc-100 sm:text-sm">
              Workspace Hub
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
