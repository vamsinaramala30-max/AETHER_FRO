import React from 'react';

export const AetherIntroduction: React.FC = () => {
  return (
    <section
      className="border-b border-zinc-900 bg-[#0D0F16] py-20"
      aria-labelledby="intro-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2
              id="intro-heading"
              className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl"
            >
              A Connected Workspace Paradigm
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Modern professional output requires more than discrete applications. Point solutions
              create communication boundaries, high contextual penalties, and fragmented memory.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Aether natively unifies core primitives within a singular workspace layer. It operates
              locally, connects explicitly, and remains predictable.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-5">
              <h3 className="text-sm font-semibold text-zinc-200">Integrated Intelligence</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                Contextually aware processing mapped directly over your verified data assets, tasks,
                and notes.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-5">
              <h3 className="text-sm font-semibold text-zinc-200">Dynamic Productivity</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                Task topologies and milestones designed to transform text descriptions into
                functional object relations.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-5">
              <h3 className="text-sm font-semibold text-zinc-200">Semantic Memory</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                Durable historical tracking capable of resurfacing context without relying on
                absolute title matches.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-5">
              <h3 className="text-sm font-semibold text-zinc-200">Structured Knowledge</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                Clean markdown-ready documents that interface with programmatic pipelines and
                automation patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
