import React from 'react';

export const AetherIntroduction: React.FC = () => {
  return (
    <section className="py-20 bg-[#0D0F16] border-b border-zinc-900" aria-labelledby="intro-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <h2 id="intro-heading" className="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
              A Connected Workspace Paradigm
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
              Modern professional output requires more than discrete applications. Point solutions create communication boundaries, high contextual penalties, and fragmented memory. 
            </p>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
              Aether natively unifies core primitives within a singular workspace layer. It operates locally, connects explicitly, and remains predictable.
            </p>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
              <h3 className="text-sm font-semibold text-zinc-200">Integrated Intelligence</h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Contextually aware processing mapped directly over your verified data assets, tasks, and notes.
              </p>
            </div>
            
            <div className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
              <h3 className="text-sm font-semibold text-zinc-200">Dynamic Productivity</h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Task topologies and milestones designed to transform text descriptions into functional object relations.
              </p>
            </div>
            
            <div className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
              <h3 className="text-sm font-semibold text-zinc-200">Semantic Memory</h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Durable historical tracking capable of resurfacing context without relying on absolute title matches.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
              <h3 className="text-sm font-semibold text-zinc-200">Structured Knowledge</h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Clean markdown-ready documents that interface with programmatic pipelines and automation patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};