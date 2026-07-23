import React from 'react';

interface PromptExample {
  input: string;
  category: string;
}

const PREVIEW_EXAMPLES: PromptExample[] = [
  { input: "Create a task for tomorrow", category: "Task Management" },
  { input: "Show my incomplete work", category: "Planning Filter" },
  { input: "Plan my study week", category: "Schedules" },
  { input: "Find my notes about IoT", category: "Semantic Knowledge" },
  { input: "What should I focus on today?", category: "Daily Strategy" }
];

export const IntelligencePreview: React.FC = () => {
  return (
    <section className="py-20 border-b border-zinc-900" aria-labelledby="intelligence-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 id="intelligence-heading" className="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
            Intent-Driven Interaction Architecture
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400">
            Aether is structurally designed to process explicit conversational commands into executable records once authenticated. Here is an overview of the planned interaction interface model.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-zinc-900/40 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono font-medium">Platform Preview // Simulated Console</span>
            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">Read Only</span>
          </div>

          <div className="p-6 space-y-4">
            {PREVIEW_EXAMPLES.map((example, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded bg-[#0B0D12] border border-zinc-900 hover:border-zinc-800/80 transition-colors gap-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-zinc-600 font-mono text-xs select-none">0{idx + 1}</span>
                  <span className="text-sm font-mono text-zinc-300">"{example.input}"</span>
                </div>
                <span className="text-[11px] self-start sm:self-auto px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 font-sans">
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