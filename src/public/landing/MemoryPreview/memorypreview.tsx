import React from 'react';

export const MemoryPreview: React.FC = () => {
  return (
    <section
      className="border-b border-zinc-800/40 dark:border-zinc-800/40 light:border-zinc-200/60 bg-zinc-950/20 dark:bg-zinc-950/20 light:bg-white/30 backdrop-blur-md py-16 sm:py-20 lg:py-24"
      aria-labelledby="memory-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="memory-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 light:text-zinc-900 sm:text-3xl"
          >
            Cognitive Memory Anchoring
          </h2>
          <p className="mt-4 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 light:text-zinc-600 sm:text-base">
            Aether memory structures are explicitly designed to maintain durable context vectors
            over time. Rather than asking a standard LLM to remember information through chat
            histories, Aether isolates persistent contextual parameters defined entirely by you.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 text-left sm:mt-10 sm:grid-cols-2 sm:gap-6">
            <div className="rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200/80 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white/70 p-4 sm:p-5 backdrop-blur-xl shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-100 dark:text-zinc-100 light:text-zinc-900">Granular Privacy Control</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 light:text-zinc-600 sm:text-sm">
                You explicitly control which memories are committed, modified, or permanently
                deleted. No broad automation handles sensitive attributes without explicit
                confirmation.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200/80 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white/70 p-4 sm:p-5 backdrop-blur-xl shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-100 dark:text-zinc-100 light:text-zinc-900">Contextual Re-injection</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 light:text-zinc-600 sm:text-sm">
                Relevant historical attributes are selectively surfaced during active prompt
                sessions to ensure output matches your actual tech stacks or constraints.
              </p>
            </div>
          </div>

          <blockquote className="mx-auto mt-8 max-w-xl border-l-2 border-indigo-500/50 pl-4 text-left font-mono text-[11px] sm:text-xs italic text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
            Architectural Note: Absolute context isolation is enforced at the core database schema
            level. Memory parameters do not leak outside authenticated workspace user parameters.
          </blockquote>
        </div>
      </div>
    </section>
  );
};
