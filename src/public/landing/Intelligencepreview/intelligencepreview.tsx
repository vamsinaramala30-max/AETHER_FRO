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
    <section
      className="light:border-zinc-200/60 light:bg-white/30 border-b border-zinc-800/40 bg-zinc-950/20 py-16 backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-950/20 sm:py-20 lg:py-24"
      aria-labelledby="intelligence-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <h2
            id="intelligence-heading"
            className="light:text-zinc-900 text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 sm:text-3xl"
          >
            Intent-Driven Interaction Architecture
          </h2>
          <p className="light:text-zinc-600 mt-3 text-xs text-zinc-400 dark:text-zinc-400 sm:text-base">
            Aether is structurally designed to process explicit conversational commands into
            executable records once authenticated. Here is an overview of the planned interaction
            interface model.
          </p>
        </div>

        <div className="light:border-zinc-200/80 light:bg-white/80 mx-auto max-w-2xl overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/80 shadow-xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/80">
          <div className="light:border-zinc-200/60 light:bg-slate-100/60 flex items-center justify-between border-b border-zinc-800/60 bg-zinc-900/40 px-4 py-3 dark:border-zinc-800/60 dark:bg-zinc-900/40">
            <span className="light:text-zinc-600 font-mono text-[11px] font-medium text-zinc-400 dark:text-zinc-400 sm:text-xs">
              Platform Preview // Simulated Console
            </span>
            <span className="light:border-zinc-300 light:bg-slate-200/80 light:text-zinc-700 rounded border border-zinc-800 bg-zinc-800/60 px-2 py-0.5 text-[10px] text-zinc-400 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400">
              Read Only
            </span>
          </div>

          <div className="space-y-3 p-3.5 sm:space-y-4 sm:p-6">
            {PREVIEW_EXAMPLES.map((example, idx) => (
              <div
                key={idx}
                className="light:border-zinc-200 light:bg-slate-50 flex flex-col justify-between gap-2 rounded-lg border border-zinc-900/80 bg-[#0B0D12]/90 p-3 transition-colors hover:border-indigo-500/30 dark:border-zinc-900/80 dark:bg-[#0B0D12]/90 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="shrink-0 select-none font-mono text-xs text-zinc-500">
                    0{idx + 1}
                  </span>
                  <span className="light:text-zinc-800 truncate font-mono text-xs text-zinc-300 dark:text-zinc-300 sm:text-sm">
                    &quot;{example.input}&quot;
                  </span>
                </div>
                <span className="light:border-zinc-300 light:bg-slate-200/60 light:text-zinc-600 shrink-0 self-start rounded border border-zinc-800/60 bg-zinc-900/60 px-2 py-0.5 font-sans text-[10px] text-zinc-400 dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:text-zinc-400 sm:self-auto sm:text-[11px]">
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
