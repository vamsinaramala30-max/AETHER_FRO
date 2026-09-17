import React from 'react';

export const MemoryPreview: React.FC = () => {
  return (
    <section
      className="light:border-zinc-200/60 light:bg-white/30 border-b border-zinc-800/40 bg-zinc-950/20 py-16 backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-950/20 sm:py-20 lg:py-24"
      aria-labelledby="memory-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="memory-heading"
            className="light:text-zinc-900 text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 sm:text-3xl"
          >
            Cognitive Memory Anchoring
          </h2>
          <p className="light:text-zinc-600 mt-4 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 sm:text-base">
            Aether memory structures are explicitly designed to maintain durable context vectors
            over time. Rather than asking a standard LLM to remember information through chat
            histories, Aether isolates persistent contextual parameters defined entirely by you.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 text-left sm:mt-10 sm:grid-cols-2 sm:gap-6">
            <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-5">
              <h3 className="light:text-zinc-900 text-sm font-semibold text-zinc-100 dark:text-zinc-100">
                Granular Privacy Control
              </h3>
              <p className="light:text-zinc-600 mt-2 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 sm:text-sm">
                You explicitly control which memories are committed, modified, or permanently
                deleted. No broad automation handles sensitive attributes without explicit
                confirmation.
              </p>
            </div>

            <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-5">
              <h3 className="light:text-zinc-900 text-sm font-semibold text-zinc-100 dark:text-zinc-100">
                Contextual Re-injection
              </h3>
              <p className="light:text-zinc-600 mt-2 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 sm:text-sm">
                Relevant historical attributes are selectively surfaced during active prompt
                sessions to ensure output matches your actual tech stacks or constraints.
              </p>
            </div>
          </div>

          <blockquote className="light:text-zinc-600 mx-auto mt-8 max-w-xl border-l-2 border-indigo-500/50 pl-4 text-left font-mono text-[11px] italic text-zinc-400 dark:text-zinc-400 sm:text-xs">
            Architectural Note: Absolute context isolation is enforced at the core database schema
            level. Memory parameters do not leak outside authenticated workspace user parameters.
          </blockquote>
        </div>
      </div>
    </section>
  );
};
