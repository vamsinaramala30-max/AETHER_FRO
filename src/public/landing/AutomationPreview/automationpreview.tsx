import React from 'react';

export const AutomationPreview: React.FC = () => {
  return (
    <section
      className="light:border-zinc-200/60 light:bg-white/30 border-b border-zinc-800/40 bg-zinc-950/20 py-16 backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-950/20 sm:py-20 lg:py-24"
      aria-labelledby="automation-heading"
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2
            id="automation-heading"
            className="light:text-zinc-900 text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 sm:text-3xl"
          >
            Advanced Workflows & Custom Automation Vision
          </h2>
          <p className="light:text-zinc-600 mt-4 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 sm:text-base">
            Our platform framework outlines a pipeline roadmap where recurring tasks, script
            executions, and API data polling flow smoothly across private endpoints.
          </p>

          <div className="light:text-amber-800 mt-6 inline-block max-w-xl rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-left font-mono text-[11px] text-amber-300 backdrop-blur-md dark:text-amber-300 sm:text-xs">
            <strong className="font-semibold">Product Specification Clarification:</strong> Full
            cross-application background triggers are part of our future architecture roadmap.
            Currently, active processes remain entirely explicitly triggered by the user to ensure
            deterministic safety.
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3 sm:gap-6">
            <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-5">
              <span className="light:text-indigo-600 mb-2 block font-mono text-[10px] text-indigo-400 dark:text-indigo-400 sm:text-xs">
                PHASE I // NOW
              </span>
              <p className="light:text-zinc-900 text-xs font-semibold text-zinc-100 dark:text-zinc-100 sm:text-sm">
                Explicit Execution
              </p>
              <p className="light:text-zinc-600 mt-1 text-xs text-zinc-400 dark:text-zinc-400">
                Actions operate purely via clear user execution commands.
              </p>
            </div>
            <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-5">
              <span className="light:text-cyan-600 mb-2 block font-mono text-[10px] text-cyan-400 dark:text-cyan-400 sm:text-xs">
                PHASE II // DEVELOPMENT
              </span>
              <p className="light:text-zinc-900 text-xs font-semibold text-zinc-100 dark:text-zinc-100 sm:text-sm">
                Local API Polling
              </p>
              <p className="light:text-zinc-600 mt-1 text-xs text-zinc-400 dark:text-zinc-400">
                Connectivity hooks optimized for local application integration loops.
              </p>
            </div>
            <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-5">
              <span className="light:text-purple-600 mb-2 block font-mono text-[10px] text-purple-400 dark:text-purple-400 sm:text-xs">
                PHASE III // VISION
              </span>
              <p className="light:text-zinc-900 text-xs font-semibold text-zinc-100 dark:text-zinc-100 sm:text-sm">
                Autonomous Triggers
              </p>
              <p className="light:text-zinc-600 mt-1 text-xs text-zinc-400 dark:text-zinc-400">
                Safe event-driven architectures running securely within isolated tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
