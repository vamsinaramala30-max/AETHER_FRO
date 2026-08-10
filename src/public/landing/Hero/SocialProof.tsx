import React from 'react';
import { ShieldCheck, Lock, Cpu, Sparkles } from 'lucide-react';

export const SocialProof: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800/40 dark:border-zinc-800/40 light:border-zinc-200/60 bg-zinc-950/30 dark:bg-zinc-950/30 light:bg-white/40 backdrop-blur-md py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Trust Statement */}
          <div className="shrink-0 space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 dark:text-indigo-400 light:text-indigo-600 md:justify-start">
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by Architecture Teams
            </div>
            <p className="max-w-sm text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
              Engineered for high-performing engineers, cognitive researchers, and modern SaaS
              teams.
            </p>
          </div>

          {/* Social Proof Badges & Metrics Grid */}
          <div className="grid w-full grid-cols-2 gap-4 text-center sm:grid-cols-4 sm:gap-8 md:w-auto md:text-left">
            <div className="space-y-0.5 rounded-xl border border-zinc-800/50 dark:border-zinc-800/50 light:border-zinc-200/60 bg-zinc-900/30 dark:bg-zinc-900/30 light:bg-white/50 p-3 sm:p-0 sm:border-none sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
              <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 dark:text-zinc-100 light:text-zinc-900">99.9%</div>
              <div className="flex items-center justify-center gap-1 text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 md:justify-start">
                <Cpu className="h-3 w-3 text-emerald-400 shrink-0" />
                Local Uptime
              </div>
            </div>
            <div className="space-y-0.5 rounded-xl border border-zinc-800/50 dark:border-zinc-800/50 light:border-zinc-200/60 bg-zinc-900/30 dark:bg-zinc-900/30 light:bg-white/50 p-3 sm:p-0 sm:border-none sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
              <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 dark:text-zinc-100 light:text-zinc-900">
                &lt; 12ms
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 md:justify-start">
                <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />
                Context Retrieval
              </div>
            </div>
            <div className="space-y-0.5 rounded-xl border border-zinc-800/50 dark:border-zinc-800/50 light:border-zinc-200/60 bg-zinc-900/30 dark:bg-zinc-900/30 light:bg-white/50 p-3 sm:p-0 sm:border-none sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
              <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 dark:text-zinc-100 light:text-zinc-900">100%</div>
              <div className="flex items-center justify-center gap-1 text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 md:justify-start">
                <Lock className="h-3 w-3 text-cyan-400 shrink-0" />
                Local Privacy
              </div>
            </div>
            <div className="space-y-0.5 rounded-xl border border-zinc-800/50 dark:border-zinc-800/50 light:border-zinc-200/60 bg-zinc-900/30 dark:bg-zinc-900/30 light:bg-white/50 p-3 sm:p-0 sm:border-none sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
              <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 dark:text-zinc-100 light:text-zinc-900">SOC2</div>
              <div className="flex items-center justify-center gap-1 text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 md:justify-start">
                <ShieldCheck className="h-3 w-3 text-indigo-400 shrink-0" />
                Type II Ready
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Logos Bar */}
        <div className="mt-8 flex select-none flex-wrap items-center justify-center gap-4 sm:gap-8 border-t border-zinc-900/60 dark:border-zinc-900/60 light:border-zinc-200/60 pt-6 font-mono text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 lg:justify-between">
          <span className="transition-colors hover:text-zinc-200 dark:hover:text-zinc-200 light:hover:text-zinc-900">ACME CORP</span>
          <span className="transition-colors hover:text-zinc-200 dark:hover:text-zinc-200 light:hover:text-zinc-900">VERTEX INTELLIGENCE</span>
          <span className="transition-colors hover:text-zinc-200 dark:hover:text-zinc-200 light:hover:text-zinc-900">SYNAPSE AI</span>
          <span className="transition-colors hover:text-zinc-200 dark:hover:text-zinc-200 light:hover:text-zinc-900">HYPERION LABS</span>
          <span className="transition-colors hover:text-zinc-200 dark:hover:text-zinc-200 light:hover:text-zinc-900">NEURALGRID</span>
          <span className="transition-colors hover:text-zinc-200 dark:hover:text-zinc-200 light:hover:text-zinc-900">QUANTUM SYSTEMS</span>
        </div>
      </div>
    </section>
  );
};
