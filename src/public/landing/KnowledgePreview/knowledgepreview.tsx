import React from 'react';

export const KnowledgePreview: React.FC = () => {
  return (
    <section
      className="border-b border-zinc-900 bg-[#0D0F16] py-20"
      aria-labelledby="knowledge-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-950 p-6 lg:col-span-7">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-900 pb-3">
              <span className="font-mono text-xs text-zinc-400">semantic-index-map.md</span>
              <span className="font-mono text-[10px] text-zinc-600">Markdown Standard</span>
            </div>
            <div className="space-y-2 font-mono text-xs text-zinc-400">
              <p className="text-zinc-500"># IoT Architecture Systems</p>
              <p>- Node reference: Edge nodes running local broker instances.</p>
              <p>- Data parameters: Structured binary packet transfers over transport layers.</p>
              <p className="mt-4 text-zinc-600">
                // Future semantic embedding links will parse this markdown graph map automatically.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2
              id="knowledge-heading"
              className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl"
            >
              Markdown Knowledge Hubs
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Notes and technical documents should be structured for machine readability and human
              clarity alike. Aether treats internal knowledge bases as hierarchical text nodes
              prepared for future deep semantic search indexing.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500 sm:text-base">
              We employ plain text portability, ensuring that if you ever choose to export your data
              ecosystem, your intelligence maps remain clean and completely unproprietary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
