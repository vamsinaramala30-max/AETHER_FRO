import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../app/providers/authprovider';

export const CTA: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <section
      className="relative overflow-hidden border-b border-zinc-800/40 dark:border-zinc-800/40 light:border-zinc-200/60 bg-zinc-950/20 dark:bg-zinc-950/20 light:bg-white/30 backdrop-blur-md py-20 sm:py-24"
      aria-labelledby="cta-heading"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2 id="cta-heading" className="text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 light:text-zinc-900 sm:text-3xl">
          Begin your deployment configuration.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 sm:text-base">
          Initialize your profile structure, manage custom knowledge items, and interface with deep
          developer task management tools.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {isAuthenticated ? (
            <Link
              to="/app"
              className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-center font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12] sm:w-auto min-h-[44px] flex items-center justify-center"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-100 light:bg-indigo-600 px-6 py-3.5 text-center font-semibold text-zinc-950 dark:text-zinc-950 light:text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-white dark:hover:bg-white light:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12] sm:w-auto min-h-[44px] flex items-center justify-center"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="w-full rounded-xl border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white/90 px-6 py-3.5 text-center font-semibold text-zinc-300 dark:text-zinc-300 light:text-zinc-800 transition-all hover:bg-zinc-800/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 sm:w-auto min-h-[44px] flex items-center justify-center"
              >
                Enter Aether
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
