import React from 'react';

export const KnowledgePreview: React.FC = () => {
  return (
    <section className="py-20 bg-[#0D0F16] border-b border-zinc-900" aria-labelledby="knowledge-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800/80 p-6 rounded-lg">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
              <span className="text-xs text-zinc-400 font-mono">semantic-index-map.md</span>
              <span className="text-[10px] text-zinc-600 font-mono">Markdown Standard</span>
            </div>
            <div className="space-y-2 font-mono text-xs text-zinc-400">
              <p className="text-zinc-500"># IoT Architecture Systems</p>
              <p>- Node reference: Edge nodes running local broker instances.</p>
              <p>- Data parameters: Structured binary packet transfers over transport layers.</p>
              <p className="text-zinc-600 mt-4">// Future semantic embedding links will parse this markdown graph map automatically.</p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 id="knowledge-heading" className="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
              Markdown Knowledge Hubs
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
              Notes and technical documents should be structured for machine readability and human clarity alike. Aether treats internal knowledge bases as hierarchical text nodes prepared for future deep semantic search indexing.
            </p>
            <p className="mt-3 text-sm sm:text-base text-zinc-500 leading-relaxed">
              We employ plain text portability, ensuring that if you ever choose to export your data ecosystem, your intelligence maps remain clean and completely unproprietary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};