import React from 'react';
import { ShieldCheck, Lock, Cpu, Sparkles } from 'lucide-react';

export const SocialProof: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-y border-zinc-800/60 bg-zinc-950/40 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Trust Statement */}
          <div className="shrink-0 space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 md:justify-start">
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by Architecture Teams
            </div>
            <p className="max-w-sm text-xs text-zinc-400">
              Engineered for high-performing engineers, cognitive researchers, and modern SaaS
              teams.
            </p>
          </div>

          {/* Social Proof Badges & Metrics Grid */}
          <div className="grid w-full grid-cols-2 gap-6 text-center sm:grid-cols-4 sm:gap-8 md:w-auto md:text-left">
            <div className="space-y-0.5">
              <div className="font-mono text-2xl font-bold tracking-tight text-zinc-100">99.9%</div>
              <div className="flex items-center justify-center gap-1 text-xs text-zinc-400 md:justify-start">
                <Cpu className="h-3 w-3 text-emerald-400" />
                Local Uptime
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="font-mono text-2xl font-bold tracking-tight text-zinc-100">
                &lt; 12ms
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-zinc-400 md:justify-start">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                Context Retrieval
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="font-mono text-2xl font-bold tracking-tight text-zinc-100">100%</div>
              <div className="flex items-center justify-center gap-1 text-xs text-zinc-400 md:justify-start">
                <Lock className="h-3 w-3 text-cyan-400" />
                Local Privacy
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="font-mono text-2xl font-bold tracking-tight text-zinc-100">SOC2</div>
              <div className="flex items-center justify-center gap-1 text-xs text-zinc-400 md:justify-start">
                <ShieldCheck className="h-3 w-3 text-indigo-400" />
                Type II Ready
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Logos Bar */}
        <div className="mt-8 flex select-none flex-wrap items-center justify-center gap-8 border-t border-zinc-900 pt-6 font-mono text-xs text-zinc-400 lg:justify-between">
          <span className="transition-colors hover:text-zinc-300">ACME CORP</span>
          <span className="transition-colors hover:text-zinc-300">VERTEX INTELLIGENCE</span>
          <span className="transition-colors hover:text-zinc-300">SYNAPSE AI</span>
          <span className="transition-colors hover:text-zinc-300">HYPERION LABS</span>
          <span className="transition-colors hover:text-zinc-300">NEURALGRID</span>
          <span className="transition-colors hover:text-zinc-300">QUANTUM SYSTEMS</span>
        </div>
      </div>
    </section>
  );
};
