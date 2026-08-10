import React from 'react';

export const AutomationPreview: React.FC = () => {
  return (
    <section
      className="border-b border-zinc-800/40 dark:border-zinc-800/40 light:border-zinc-200/60 bg-zinc-950/20 dark:bg-zinc-950/20 light:bg-white/30 backdrop-blur-md py-16 sm:py-20 lg:py-24"
      aria-labelledby="automation-heading"
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2
            id="automation-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 light:text-zinc-900 sm:text-3xl"
          >
            Advanced Workflows & Custom Automation Vision
          </h2>
          <p className="mt-4 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 light:text-zinc-600 sm:text-base">
            Our platform framework outlines a pipeline roadmap where recurring tasks, script
            executions, and API data polling flow smoothly across private endpoints.
          </p>

          <div className="mt-6 inline-block max-w-xl rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-left font-mono text-[11px] sm:text-xs text-amber-300 dark:text-amber-300 light:text-amber-800 backdrop-blur-md">
            <strong className="font-semibold">Product Specification Clarification:</strong> Full cross-application background
            triggers are part of our future architecture roadmap. Currently, active processes remain
            entirely explicitly triggered by the user to ensure deterministic safety.
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3 sm:gap-6">
            <div className="rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200/80 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white/70 p-4 sm:p-5 backdrop-blur-xl shadow-sm">
              <span className="mb-2 block font-mono text-[10px] sm:text-xs text-indigo-400 dark:text-indigo-400 light:text-indigo-600">PHASE I // NOW</span>
              <p className="text-xs font-semibold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 sm:text-sm">Explicit Execution</p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                Actions operate purely via clear user execution commands.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200/80 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white/70 p-4 sm:p-5 backdrop-blur-xl shadow-sm">
              <span className="mb-2 block font-mono text-[10px] sm:text-xs text-cyan-400 dark:text-cyan-400 light:text-cyan-600">
                PHASE II // DEVELOPMENT
              </span>
              <p className="text-xs font-semibold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 sm:text-sm">Local API Polling</p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                Connectivity hooks optimized for local application integration loops.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200/80 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white/70 p-4 sm:p-5 backdrop-blur-xl shadow-sm">
              <span className="mb-2 block font-mono text-[10px] sm:text-xs text-purple-400 dark:text-purple-400 light:text-purple-600">
                PHASE III // VISION
              </span>
              <p className="text-xs font-semibold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 sm:text-sm">Autonomous Triggers</p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                Safe event-driven architectures running securely within isolated tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
