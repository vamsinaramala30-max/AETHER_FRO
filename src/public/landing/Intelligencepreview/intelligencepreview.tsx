import React from 'react';

interface PromptExample {
  input: string;
  category: string;
}

const PREVIEW_EXAMPLES: PromptExample[] = [
  { input: 'Create a task for tomorrow', category: 'Task Management' },
  { input: 'Show my incomplete work', category: 'Planning Filter' },
  { input: 'Plan my study week', category: 'Schedules' },
  { input: 'Find my notes about IoT', category: 'Semantic Knowledge' },
  { input: 'What should I focus on today?', category: 'Daily Strategy' },
];

export const IntelligencePreview: React.FC = () => {
  return (
    <section className="border-b border-zinc-900 py-20" aria-labelledby="intelligence-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2
            id="intelligence-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl"
          >
            Intent-Driven Interaction Architecture
          </h2>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            Aether is structurally designed to process explicit conversational commands into
            executable records once authenticated. Here is an overview of the planned interaction
            interface model.
          </p>
        </div>

        <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/40 px-4 py-3">
            <span className="font-mono text-xs font-medium text-zinc-400">
              Platform Preview // Simulated Console
            </span>
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
              Read Only
            </span>
          </div>

          <div className="space-y-4 p-6">
            {PREVIEW_EXAMPLES.map((example, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between gap-2 rounded border border-zinc-900 bg-[#0B0D12] p-3 transition-colors hover:border-zinc-800/80 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="select-none font-mono text-xs text-zinc-600">0{idx + 1}</span>
                  <span className="font-mono text-sm text-zinc-300">"{example.input}"</span>
                </div>
                <span className="self-start rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-sans text-[11px] text-zinc-400 sm:self-auto">
                  {example.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
