import React from 'react';
import { ShieldCheck, Lock, Cpu, Sparkles } from 'lucide-react';

export const SocialProof: React.FC = () => {
  return (
    <section className="light:border-zinc-200/60 light:bg-white/40 relative overflow-hidden border-b border-zinc-800/40 bg-zinc-950/30 py-10 backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-950/30 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Trust Statement */}
          <div className="shrink-0 space-y-1.5 text-center md:text-left">
            <div className="light:text-indigo-600 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 dark:text-indigo-400 md:justify-start">
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by Architecture Teams
            </div>
            <p className="light:text-zinc-600 max-w-sm text-xs text-zinc-400 dark:text-zinc-400">
              Engineered for high-performing engineers, cognitive researchers, and modern SaaS
              teams.
            </p>
          </div>

          {/* Social Proof Badges & Metrics Grid */}
          <div className="grid w-full grid-cols-2 gap-4 text-center sm:grid-cols-4 sm:gap-8 md:w-auto md:text-left">
            <div className="light:border-zinc-200/60 light:bg-white/50 space-y-0.5 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/30 sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
              <div className="light:text-zinc-900 font-mono text-xl font-bold tracking-tight text-zinc-100 dark:text-zinc-100 sm:text-2xl">
                99.9%
              </div>
              <div className="light:text-zinc-600 flex items-center justify-center gap-1 text-xs text-zinc-400 dark:text-zinc-400 md:justify-start">
                <Cpu className="h-3 w-3 shrink-0 text-emerald-400" />
                Local Uptime
              </div>
            </div>
            <div className="light:border-zinc-200/60 light:bg-white/50 space-y-0.5 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/30 sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
              <div className="light:text-zinc-900 font-mono text-xl font-bold tracking-tight text-zinc-100 dark:text-zinc-100 sm:text-2xl">
                &lt; 12ms
              </div>
              <div className="light:text-zinc-600 flex items-center justify-center gap-1 text-xs text-zinc-400 dark:text-zinc-400 md:justify-start">
                <Sparkles className="h-3 w-3 shrink-0 text-indigo-400" />
                Context Retrieval
              </div>
            </div>
            <div className="light:border-zinc-200/60 light:bg-white/50 space-y-0.5 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/30 sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
              <div className="light:text-zinc-900 font-mono text-xl font-bold tracking-tight text-zinc-100 dark:text-zinc-100 sm:text-2xl">
                100%
              </div>
              <div className="light:text-zinc-600 flex items-center justify-center gap-1 text-xs text-zinc-400 dark:text-zinc-400 md:justify-start">
                <Lock className="h-3 w-3 shrink-0 text-cyan-400" />
                Local Privacy
              </div>
            </div>
            <div className="light:border-zinc-200/60 light:bg-white/50 space-y-0.5 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/30 sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
              <div className="light:text-zinc-900 font-mono text-xl font-bold tracking-tight text-zinc-100 dark:text-zinc-100 sm:text-2xl">
                SOC2
              </div>
              <div className="light:text-zinc-600 flex items-center justify-center gap-1 text-xs text-zinc-400 dark:text-zinc-400 md:justify-start">
                <ShieldCheck className="h-3 w-3 shrink-0 text-indigo-400" />
                Type II Ready
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Logos Bar */}
        <div className="light:border-zinc-200/60 light:text-zinc-600 mt-8 flex select-none flex-wrap items-center justify-center gap-4 border-t border-zinc-900/60 pt-6 font-mono text-[11px] text-zinc-400 dark:border-zinc-900/60 dark:text-zinc-400 sm:gap-8 sm:text-xs lg:justify-between">
          <span className="light:hover:text-zinc-900 transition-colors hover:text-zinc-200 dark:hover:text-zinc-200">
            ACME CORP
          </span>
          <span className="light:hover:text-zinc-900 transition-colors hover:text-zinc-200 dark:hover:text-zinc-200">
            VERTEX INTELLIGENCE
          </span>
          <span className="light:hover:text-zinc-900 transition-colors hover:text-zinc-200 dark:hover:text-zinc-200">
            SYNAPSE AI
          </span>
          <span className="light:hover:text-zinc-900 transition-colors hover:text-zinc-200 dark:hover:text-zinc-200">
            HYPERION LABS
          </span>
          <span className="light:hover:text-zinc-900 transition-colors hover:text-zinc-200 dark:hover:text-zinc-200">
            NEURALGRID
          </span>
          <span className="light:hover:text-zinc-900 transition-colors hover:text-zinc-200 dark:hover:text-zinc-200">
            QUANTUM SYSTEMS
          </span>
        </div>
      </div>
    </section>
  );
};
