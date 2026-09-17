import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../app/providers/authprovider';

export const CTA: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <section
      className="light:border-zinc-200/60 light:bg-white/30 relative overflow-hidden border-b border-zinc-800/40 bg-zinc-950/20 py-20 backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-950/20 sm:py-24"
      aria-labelledby="cta-heading"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="cta-heading"
          className="light:text-zinc-900 text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 sm:text-3xl"
        >
          Begin your deployment configuration.
        </h2>
        <p className="light:text-zinc-600 mx-auto mt-4 max-w-lg text-xs text-zinc-400 dark:text-zinc-400 sm:text-base">
          Initialize your profile structure, manage custom knowledge items, and interface with deep
          developer task management tools.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {isAuthenticated ? (
            <Link
              to="/app"
              className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 text-center font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12] sm:w-auto"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="light:bg-indigo-600 light:text-white light:hover:bg-indigo-500 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-zinc-100 px-6 py-3.5 text-center font-semibold text-zinc-950 shadow-lg shadow-indigo-600/20 transition-all hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12] dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white sm:w-auto"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="light:border-zinc-300 light:bg-white/90 light:text-zinc-800 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/90 px-6 py-3.5 text-center font-semibold text-zinc-300 transition-all hover:bg-zinc-800/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-300 sm:w-auto"
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
