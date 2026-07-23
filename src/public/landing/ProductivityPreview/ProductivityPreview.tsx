import React from 'react';

export const ProductivityPreview: React.FC = () => {
  return (
    <section className="py-20 bg-[#0D0F16] border-b border-zinc-900" aria-labelledby="productivity-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 id="productivity-heading" className="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
              Unified Task Topologies & Goals
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
              Productivity tracking should not rely on flat checklists. Aether defines milestones as nodes linked dynamically to active documents, research papers, and technical targets.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-400" aria-label="Productivity ecosystem focus points">
              <li className="flex items-start gap-3">
                <span className="text-zinc-500 font-mono select-• text-xs mt-0.5">[o]</span>
                <span>Structured planning horizons (Daily Focus, Weekly Epics, Monthly Frameworks).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-500 font-mono select-• text-xs mt-0.5">[o]</span>
                <span>Explicit relational connections between metrics and target tasks.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-500 font-mono select-• text-xs mt-0.5">[o]</span>
                <span>Zero pre-populated mock user accounts: custom data structures belong only to you.</span>
              </li>
            </ul>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono text-xs text-zinc-400 space-y-4">
            <div className="border-b border-zinc-900 pb-2 flex justify-between text-[11px] text-zinc-500">
              <span>WORKSPACE SCHEMA // OBJECTS</span>
              <span>v5.0</span>
            </div>
            <div className="space-y-2">
              <p className="text-zinc-300">{"{"}</p>
              <p className="pl-4">"object": "milestone_epic",</p>
              <p className="pl-4">"parameters": ["tasks", "goals", "planning"],</p>
              <p className="pl-4">"isolation_level": "strict_local",</p>
              <p className="pl-4">"metrics_tracking": true</p>
              <p className="text-zinc-300">{"}"}</p>
            </div>
            <div className="h-px bg-zinc-900 my-2" />
            <p className="text-[11px] text-zinc-500 leading-normal font-sans">
              * The architecture isolates productivity logic from external telemetry layers to guarantee performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};