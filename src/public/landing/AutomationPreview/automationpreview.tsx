import React from 'react';

export const AutomationPreview: React.FC = () => {
  return (
    <section className="border-b border-zinc-900 py-20" aria-labelledby="automation-heading">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2
            id="automation-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl"
          >
            Advanced Workflows & Custom Automation Vision
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Our platform framework outlines a pipeline roadmap where recurring tasks, script
            executions, and API data polling flow smoothly across private endpoints.
          </p>

          <div className="mt-8 inline-block max-w-xl rounded border border-amber-950/40 bg-zinc-950 px-4 py-2 text-left font-mono text-xs text-amber-200/90">
            <strong>Product Specification Clarification:</strong> Full cross-application background
            triggers are part of our future architecture roadmap. Currently, active processes remain
            entirely explicitly triggered by the user to ensure deterministic safety.
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
            <div className="rounded border border-zinc-800 bg-zinc-900/20 p-4">
              <span className="mb-2 block font-mono text-xs text-zinc-500">PHASE I // NOW</span>
              <p className="text-xs font-medium text-zinc-300 sm:text-sm">Explicit Execution</p>
              <p className="mt-1 text-xs text-zinc-500">
                Actions operate purely via clear user execution commands.
              </p>
            </div>
            <div className="rounded border border-zinc-900 bg-zinc-950 p-4">
              <span className="mb-2 block font-mono text-xs text-zinc-600">
                PHASE II // DEVELOPMENT
              </span>
              <p className="text-xs font-medium text-zinc-400 sm:text-sm">Local API Polling</p>
              <p className="mt-1 text-xs text-zinc-600">
                Connectivity hooks optimized for local application integration loops.
              </p>
            </div>
            <div className="rounded border border-zinc-900 bg-zinc-950 p-4">
              <span className="mb-2 block font-mono text-xs text-zinc-600">
                PHASE III // VISION
              </span>
              <p className="text-xs font-medium text-zinc-400 sm:text-sm">Autonomous Triggers</p>
              <p className="mt-1 text-xs text-zinc-600">
                Safe event-driven architectures running securely within isolated tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
