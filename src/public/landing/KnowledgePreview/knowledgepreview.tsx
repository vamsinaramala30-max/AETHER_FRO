import React from 'react';

export const KnowledgePreview: React.FC = () => {
  return (
    <section
      className="light:border-zinc-200/60 light:bg-white/30 border-b border-zinc-800/40 bg-zinc-950/20 py-16 backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-950/20 sm:py-20 lg:py-24"
      aria-labelledby="knowledge-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="light:border-zinc-200/80 light:bg-white/80 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-3.5 shadow-xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/80 sm:p-6 lg:col-span-7">
            <div className="light:border-zinc-200/60 mb-4 flex items-center justify-between border-b border-zinc-800/60 pb-3 dark:border-zinc-800/60">
              <span className="light:text-zinc-700 truncate font-mono text-xs font-medium text-zinc-300 dark:text-zinc-300">
                semantic-index-map.md
              </span>
              <span className="light:text-zinc-500 shrink-0 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                Markdown Standard
              </span>
            </div>
            <div className="light:border-zinc-200 light:bg-slate-900 overflow-x-auto rounded-lg border border-zinc-900 bg-[#0B0D12]/90 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-900 dark:bg-[#0B0D12]/90">
              <p className="light:text-indigo-300 font-semibold text-indigo-400 dark:text-indigo-400">
                # IoT Architecture Systems
              </p>
              <p className="mt-2">- Node reference: Edge nodes running local broker instances.</p>
              <p className="mt-1">
                - Data parameters: Structured binary packet transfers over transport layers.
              </p>
              <p className="mt-4 text-zinc-500">
                // Future semantic embedding links will parse this markdown graph map automatically.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2
              id="knowledge-heading"
              className="light:text-zinc-900 text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 sm:text-3xl"
            >
              Markdown Knowledge Hubs
            </h2>
            <p className="light:text-zinc-600 mt-4 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 sm:text-base">
              Notes and technical documents should be structured for machine readability and human
              clarity alike. Aether treats internal knowledge bases as hierarchical text nodes
              prepared for future deep semantic search indexing.
            </p>
            <p className="light:text-zinc-600 mt-3 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 sm:text-base">
              We employ plain text portability, ensuring that if you ever choose to export your data
              ecosystem, your intelligence maps remain clean and completely unproprietary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
