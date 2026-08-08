import React from 'react';

export const ProductivityPreview: React.FC = () => {
  return (
    <section
      className="border-b border-zinc-800/50 bg-zinc-950/40 py-16 sm:py-20 lg:py-24"
      aria-labelledby="productivity-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2
              id="productivity-heading"
              className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl"
            >
              Unified Task Topologies & Goals
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Productivity tracking should not rely on flat checklists. Aether defines milestones as
              nodes linked dynamically to active documents, research papers, and technical targets.
            </p>
            <ul
              className="mt-6 space-y-3 text-sm text-zinc-400"
              aria-label="Productivity ecosystem focus points"
            >
              <li className="flex items-start gap-3">
                <span className="select-• mt-0.5 font-mono text-xs text-zinc-500">[o]</span>
                <span>
                  Structured planning horizons (Daily Focus, Weekly Epics, Monthly Frameworks).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="select-• mt-0.5 font-mono text-xs text-zinc-500">[o]</span>
                <span>Explicit relational connections between metrics and target tasks.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="select-• mt-0.5 font-mono text-xs text-zinc-500">[o]</span>
                <span>
                  Zero pre-populated mock user accounts: custom data structures belong only to you.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950 p-6 font-mono text-xs text-zinc-400">
            <div className="flex justify-between border-b border-zinc-900 pb-2 text-[11px] text-zinc-500">
              <span>WORKSPACE SCHEMA // OBJECTS</span>
              <span>v5.0</span>
            </div>
            <div className="space-y-2">
              <p className="text-zinc-300">{'{'}</p>
              <p className="pl-4">"object": "milestone_epic",</p>
              <p className="pl-4">"parameters": ["tasks", "goals", "planning"],</p>
              <p className="pl-4">"isolation_level": "strict_local",</p>
              <p className="pl-4">"metrics_tracking": true</p>
              <p className="text-zinc-300">{'}'}</p>
            </div>
            <div className="my-2 h-px bg-zinc-900" />
            <p className="font-sans text-[11px] leading-normal text-zinc-500">
              * The architecture isolates productivity logic from external telemetry layers to
              guarantee performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
