import React from 'react';

const points = [
  'Structured planning horizons (Daily Focus, Weekly Epics, Monthly Frameworks).',
  'Explicit relational connections between metrics and target tasks.',
  'Zero pre-populated mock user accounts: custom data structures belong only to you.',
];

export const ProductivityPreview: React.FC = () => {
  return (
    <section
      className="light:border-zinc-200/60 light:bg-white/30 relative isolate overflow-hidden border-b border-zinc-800/40 bg-zinc-950/20 py-16 backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-950/20 sm:py-24 lg:py-28"
      aria-labelledby="productivity-heading"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-10 h-80 w-80 animate-pulse rounded-full bg-cyan-500/10 blur-3xl [animation-duration:8s]" />
        <div className="absolute -left-24 bottom-[-120px] h-72 w-72 animate-pulse rounded-full bg-violet-600/10 blur-3xl [animation-duration:6s]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left content */}
          <div>
            <span className="light:text-cyan-600 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-500/80 dark:text-cyan-400">
              Productivity Engine
            </span>

            <h2
              id="productivity-heading"
              className="light:text-zinc-900 mt-4 text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 sm:text-4xl"
            >
              Unified Task
              <span className="light:from-zinc-900 light:via-cyan-600 light:to-violet-600 block bg-gradient-to-r from-zinc-100 via-cyan-300 to-violet-400 bg-clip-text text-transparent dark:from-zinc-100 dark:via-cyan-300 dark:to-violet-400">
                Topologies &amp; Goals
              </span>
            </h2>

            <p className="light:text-zinc-600 mt-4 max-w-xl text-xs leading-6 text-zinc-400 dark:text-zinc-400 sm:text-base sm:leading-7">
              Productivity tracking should not rely on flat checklists. Aether defines milestones as
              nodes linked dynamically to active documents, research papers, and technical targets.
            </p>

            <ul className="light:text-zinc-600 mt-6 space-y-3 text-xs text-zinc-400 dark:text-zinc-400 sm:text-sm">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="light:text-cyan-600 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cyan-500/50 text-xs text-cyan-400 dark:text-cyan-400">
                    +
                  </span>
                  <span className="leading-6">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Code preview */}
          <div className="relative w-full max-w-full overflow-hidden">
            <div className="absolute -inset-10 rounded-full bg-violet-500/5 blur-3xl" />

            <div className="light:border-zinc-200/80 light:bg-white/80 relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/50">
              {/* Header */}
              <div className="light:border-zinc-200/70 flex items-center justify-between border-b border-zinc-800/70 px-4 py-3.5 dark:border-zinc-800/70 sm:px-5 sm:py-4">
                <div>
                  <p className="light:text-zinc-500 font-mono text-[10px] tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                    WORKSPACE SCHEMA
                  </p>

                  <p className="light:text-zinc-700 mt-1 text-xs text-zinc-300 dark:text-zinc-400">
                    OBJECT RELATION ENGINE
                  </p>
                </div>

                <span className="light:border-zinc-300 light:bg-slate-100/70 light:text-zinc-600 rounded-md border border-zinc-800 bg-zinc-950/70 px-2 py-1 font-mono text-[10px] text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-400">
                  v5.0
                </span>
              </div>

              {/* Code Container with horizontal scroll for 320px screens */}
              <div className="p-3.5 sm:p-6">
                <div className="light:border-zinc-200/80 light:bg-slate-900 overflow-x-auto rounded-xl border border-zinc-800/70 bg-zinc-950/80 p-3.5 dark:border-zinc-800/70 dark:bg-zinc-950/80">
                  <pre className="font-mono text-[11px] leading-6 text-zinc-300 sm:text-xs sm:leading-7">
                    <code>
                      <span className="text-zinc-500">{'{'}</span>
                      {'\n'}
                      {'  '}
                      <span className="text-violet-400">&quot;object&quot;</span>:{' '}
                      <span className="text-cyan-300">&quot;milestone_epic&quot;</span>,{'\n'}
                      {'  '}
                      <span className="text-violet-400">&quot;parameters&quot;</span>:{' '}
                      <span className="text-cyan-300">
                        [&quot;tasks&quot;, &quot;goals&quot;, &quot;planning&quot;]
                      </span>
                      ,{'\n'}
                      {'  '}
                      <span className="text-violet-400">&quot;isolation_level&quot;</span>:{' '}
                      <span className="text-cyan-300">&quot;strict_local&quot;</span>,{'\n'}
                      {'  '}
                      <span className="text-violet-400">&quot;metrics_tracking&quot;</span>:{' '}
                      <span className="text-rose-400">true</span>
                      {'\n'}
                      <span className="text-zinc-500">{'}'}</span>
                    </code>
                  </pre>
                </div>
              </div>

              {/* Footer */}
              <div className="light:border-zinc-200/70 border-t border-zinc-800/70 p-3.5 dark:border-zinc-800/70 sm:px-6">
                <div className="light:border-zinc-200/70 light:bg-slate-100/50 rounded-xl border border-zinc-800/70 bg-zinc-950/50 p-3 dark:border-zinc-800/70 dark:bg-zinc-950/50 sm:p-4">
                  <div className="flex gap-3">
                    <div className="light:text-cyan-600 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs text-cyan-400 dark:text-cyan-400 sm:h-7 sm:w-7">
                      ✓
                    </div>

                    <p className="light:text-zinc-600 text-[11px] leading-5 text-zinc-400 dark:text-zinc-400">
                      Architecture isolates productivity logic from external telemetry layers to
                      guarantee performance and predictable workspace behavior.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
