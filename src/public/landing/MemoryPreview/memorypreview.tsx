import React from 'react';

export const MemoryPreview: React.FC = () => {
  return (
    <section className="py-20 border-b border-zinc-900" aria-labelledby="memory-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="memory-heading" className="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
            Cognitive Memory Anchoring
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Aether memory structures are explicitly designed to maintain durable context vectors over time. Rather than asking a standard LLM to remember information through chat histories, Aether isolates persistent contextual parameters defined entirely by you.
          </p>
          
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div className="p-5 bg-zinc-900/30 border border-zinc-800 rounded-lg">
              <h3 className="text-sm font-semibold text-zinc-200">Granular Privacy Control</h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                You explicitly control which memories are committed, modified, or permanently deleted. No broad automation handles sensitive attributes without explicit confirmation.
              </p>
            </div>

            <div className="p-5 bg-zinc-900/30 border border-zinc-800 rounded-lg">
              <h3 className="text-sm font-semibold text-zinc-200">Contextual Re-injection</h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Relevant historical attributes are selectively surfaced during active prompt sessions to ensure output matches your actual tech stacks or constraints.
              </p>
            </div>
          </div>

          <blockquote className="mt-10 border-l-2 border-zinc-700 pl-4 text-xs font-mono text-zinc-500 text-left max-w-xl mx-auto italic">
            Architectural Note: Absolute context isolation is enforced at the core database schema level. Memory parameters do not leak outside authenticated workspace user parameters.
          </blockquote>
        </div>
      </div>
    </section>
  );
};