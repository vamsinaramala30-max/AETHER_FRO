import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/app/providers/authprovider';

export const BetaBanner: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section
      className="relative overflow-hidden border-b border-zinc-800/40 bg-zinc-950/40 py-16 backdrop-blur-md sm:py-20"
      aria-label="Beta access notice"
    >
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Public Preview
        </div>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl lg:text-4xl">
          Free during beta.
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          Sign up now to plan your days, organize your projects, and practice problem-solving in
          your personal cognitive hub.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to={isAuthenticated ? '/app' : '/signup'}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12] sm:w-auto"
          >
            Get started free
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {!isAuthenticated && (
            <Link
              to="/login"
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-6 py-3.5 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-800/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-[#0B0D12] sm:w-auto"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
