import React from 'react';

export const MemoryPreview: React.FC = () => {
  return (
    <section
      className="border-b border-zinc-800/50 bg-zinc-950/40 py-16 sm:py-20 lg:py-24"
      aria-labelledby="memory-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="memory-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl"
          >
            Cognitive Memory Anchoring
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Aether memory structures are explicitly designed to maintain durable context vectors
            over time. Rather than asking a standard LLM to remember information through chat
            histories, Aether isolates persistent contextual parameters defined entirely by you.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
              <h3 className="text-sm font-semibold text-zinc-200">Granular Privacy Control</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                You explicitly control which memories are committed, modified, or permanently
                deleted. No broad automation handles sensitive attributes without explicit
                confirmation.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
              <h3 className="text-sm font-semibold text-zinc-200">Contextual Re-injection</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                Relevant historical attributes are selectively surfaced during active prompt
                sessions to ensure output matches your actual tech stacks or constraints.
              </p>
            </div>
          </div>

          <blockquote className="mx-auto mt-10 max-w-xl border-l-2 border-zinc-700 pl-4 text-left font-mono text-xs italic text-zinc-500">
            Architectural Note: Absolute context isolation is enforced at the core database schema
            level. Memory parameters do not leak outside authenticated workspace user parameters.
          </blockquote>
        </div>
      </div>
    </section>
  );
};
