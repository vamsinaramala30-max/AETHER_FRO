import React from 'react';

export const KnowledgePreview: React.FC = () => {
  return (
    <section
      className="border-b border-zinc-800/40 dark:border-zinc-800/40 light:border-zinc-200/60 bg-zinc-950/20 dark:bg-zinc-950/20 light:bg-white/30 backdrop-blur-md py-16 sm:py-20 lg:py-24"
      aria-labelledby="knowledge-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="overflow-hidden rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200/80 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-white/80 p-3.5 sm:p-6 backdrop-blur-xl shadow-xl lg:col-span-7">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-800/60 dark:border-zinc-800/60 light:border-zinc-200/60 pb-3">
              <span className="font-mono text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-zinc-700 truncate">semantic-index-map.md</span>
              <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 light:text-zinc-500 shrink-0">Markdown Standard</span>
            </div>
            <div className="overflow-x-auto rounded-lg border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 bg-[#0B0D12]/90 dark:bg-[#0B0D12]/90 light:bg-slate-900 p-3.5 font-mono text-xs text-zinc-300">
              <p className="text-indigo-400 dark:text-indigo-400 light:text-indigo-300 font-semibold"># IoT Architecture Systems</p>
              <p className="mt-2">- Node reference: Edge nodes running local broker instances.</p>
              <p className="mt-1">- Data parameters: Structured binary packet transfers over transport layers.</p>
              <p className="mt-4 text-zinc-500">
                // Future semantic embedding links will parse this markdown graph map automatically.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2
              id="knowledge-heading"
              className="text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 light:text-zinc-900 sm:text-3xl"
            >
              Markdown Knowledge Hubs
            </h2>
            <p className="mt-4 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 light:text-zinc-600 sm:text-base">
              Notes and technical documents should be structured for machine readability and human
              clarity alike. Aether treats internal knowledge bases as hierarchical text nodes
              prepared for future deep semantic search indexing.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 light:text-zinc-600 sm:text-base">
              We employ plain text portability, ensuring that if you ever choose to export your data
              ecosystem, your intelligence maps remain clean and completely unproprietary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
