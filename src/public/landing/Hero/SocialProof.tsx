import React from 'react';
import { ShieldCheck, Lock, Cpu, Sparkles } from 'lucide-react';

export const SocialProof: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800/40 bg-zinc-950/30 py-10 backdrop-blur-md sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Transparent Statement */}
          <div className="shrink-0 space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 md:justify-start">
              <Sparkles className="h-3.5 w-3.5" />
              Engineered for Focused Execution
            </div>
            <p className="max-w-sm text-xs text-zinc-400">
              Designed for individual knowledge workers, software developers, and teams who value
              structured planning and analytical reasoning.
            </p>
          </div>

          {/* Authentic Core Primitives */}
          <div className="grid w-full grid-cols-2 gap-4 text-center sm:grid-cols-4 sm:gap-8 md:w-auto md:text-left">
            <div className="space-y-0.5 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3 backdrop-blur-sm sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
              <div className="font-mono text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
                Public Beta
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-zinc-400 md:justify-start">
                <Cpu className="h-3 w-3 shrink-0 text-emerald-400" />
                Free Access
              </div>
            </div>
            <div className="space-y-0.5 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3 backdrop-blur-sm sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
              <div className="font-mono text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
                Contextual
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-zinc-400 md:justify-start">
                <Sparkles className="h-3 w-3 shrink-0 text-indigo-400" />
                AI Assistant
              </div>
            </div>
            <div className="space-y-0.5 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3 backdrop-blur-sm sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
              <div className="font-mono text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
                Isolated
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-zinc-400 md:justify-start">
                <Lock className="h-3 w-3 shrink-0 text-cyan-400" />
                Tenant Data
              </div>
            </div>
            <div className="space-y-0.5 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3 backdrop-blur-sm sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
              <div className="font-mono text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
                TLS 1.3
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-zinc-400 md:justify-start">
                <ShieldCheck className="h-3 w-3 shrink-0 text-indigo-400" />
                Secure Transport
              </div>
            </div>
          </div>
        </div>

        {/* Technology Architecture Bar */}
        <div className="mt-8 flex select-none flex-wrap items-center justify-center gap-4 border-t border-zinc-900/60 pt-6 font-mono text-[11px] text-zinc-500 sm:gap-8 sm:text-xs lg:justify-between">
          <span className="transition-colors hover:text-zinc-300">
            POSTGRESQL &bull; PGVECTOR
          </span>
          <span className="transition-colors hover:text-zinc-300">
            TYPESCRIPT &bull; REACT 19
          </span>
          <span className="transition-colors hover:text-zinc-300">
            NODE.JS &bull; EXPRESS
          </span>
          <span className="transition-colors hover:text-zinc-300">
            ZOD RUNTIME VALIDATION
          </span>
          <span className="transition-colors hover:text-zinc-300">
            TAILWIND CSS
          </span>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
