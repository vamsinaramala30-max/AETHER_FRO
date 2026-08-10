import React from 'react';

const features = [
  {
    title: 'Integrated Intelligence',
    text: 'Contextually aware processing mapped directly over your verified data assets, tasks, and notes.',
  },
  {
    title: 'Dynamic Productivity',
    text: 'Task topologies and milestones designed to transform text descriptions into functional object relations.',
  },
  {
    title: 'Semantic Memory',
    text: 'Durable historical tracking capable of resurfacing context without relying on absolute title matches.',
  },
  {
    title: 'Structured Knowledge',
    text: 'Clean markdown-ready documents that interface with programmatic pipelines and automation patterns.',
  },
];

export const AetherIntroduction: React.FC = () => {
  return (
    <section
      className="relative isolate overflow-hidden border-b border-zinc-800/40 dark:border-zinc-800/40 light:border-zinc-200/60 bg-zinc-950/20 dark:bg-zinc-950/20 light:bg-white/30 backdrop-blur-md py-16 sm:py-24 lg:py-28"
      aria-labelledby="intro-heading"
    >
      {/* Floating background ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 animate-pulse rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -right-32 top-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-500/10 blur-3xl [animation-duration:7s]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left */}
          <div className="lg:col-span-5">
            <span className="inline-flex rounded-full border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-300/80 bg-zinc-900/70 dark:bg-zinc-900/70 light:bg-white/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-400 light:text-zinc-600 backdrop-blur-xl">
              Aether Workspace
            </span>

            <h2
              id="intro-heading"
              className="mt-5 max-w-xl text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 light:text-zinc-900 sm:text-4xl"
            >
              A Connected
              <span className="block bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-500 light:from-zinc-900 light:via-indigo-900 light:to-violet-700 bg-clip-text text-transparent">
                Workspace Paradigm
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-xs leading-6 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 sm:text-base sm:leading-7">
              Modern professional output requires more than discrete applications.
              Point solutions create communication boundaries, high contextual
              penalties, and fragmented memory.
            </p>

            <p className="mt-3 max-w-lg text-xs leading-6 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 sm:text-base sm:leading-7">
              Aether natively unifies core primitives within a singular workspace
              layer. It operates locally, connects explicitly, and remains predictable.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800/70 dark:border-zinc-800/70 light:border-zinc-200/80 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white/70 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-zinc-900/60 dark:hover:bg-zinc-900/60 light:hover:bg-white/90 shadow-sm"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/5 blur-2xl transition-all duration-500 group-hover:bg-violet-500/15" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 light:text-zinc-500">
                      0{index + 1}
                    </span>

                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-700 transition-colors group-hover:bg-violet-400" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-zinc-100 dark:text-zinc-100 light:text-zinc-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 sm:text-sm sm:leading-6">
                    {feature.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};