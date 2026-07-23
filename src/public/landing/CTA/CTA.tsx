import React from 'react';

export const CTA: React.FC = () => {
  return (
    <section className="py-20 border-b border-zinc-900 relative" aria-labelledby="cta-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 id="cta-heading" className="text-3xl font-semibold text-zinc-100 tracking-tight">
          Begin your deployment configuration.
        </h2>
        <p className="mt-4 text-zinc-400 max-w-lg mx-auto text-sm sm:text-base">
          Initialize your profile structure, manage custom knowledge items, and interface with deep developer task management tools.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/signup"
            className="w-full sm:w-auto text-center bg-zinc-100 text-zinc-950 font-medium px-6 py-3 rounded-md hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12]"
          >
            Create account
          </a>
          <a
            href="/signin"
            className="w-full sm:w-auto text-center bg-zinc-900 text-zinc-300 border border-zinc-800 font-medium px-6 py-3 rounded-md hover:bg-zinc-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            Enter Aether
          </a>
        </div>
      </div>
    </section>
  );
};