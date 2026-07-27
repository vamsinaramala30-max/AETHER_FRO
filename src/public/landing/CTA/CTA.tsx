import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../app/providers/authprovider';

export const CTA: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <section className="relative border-b border-zinc-900 py-20" aria-labelledby="cta-heading">
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2 id="cta-heading" className="text-3xl font-semibold tracking-tight text-zinc-100">
          Begin your deployment configuration.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-zinc-400 sm:text-base">
          Initialize your profile structure, manage custom knowledge items, and interface with deep
          developer task management tools.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {isAuthenticated ? (
            <Link
              to="/app"
              className="w-full rounded-md bg-indigo-600 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12] sm:w-auto"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="w-full rounded-md bg-zinc-100 px-6 py-3 text-center font-medium text-zinc-950 transition-colors hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12] sm:w-auto"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-6 py-3 text-center font-medium text-zinc-300 transition-colors hover:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-zinc-500 sm:w-auto"
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
