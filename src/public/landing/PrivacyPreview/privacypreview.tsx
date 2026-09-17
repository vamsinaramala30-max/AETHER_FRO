import React from 'react';

export const PrivacyPreview: React.FC = () => {
  return (
    <section
      className="light:border-zinc-200/60 light:bg-white/30 border-b border-zinc-800/40 bg-zinc-950/20 py-16 backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-950/20 sm:py-20 lg:py-24"
      aria-labelledby="privacy-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <h2
            id="privacy-heading"
            className="light:text-zinc-900 text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 sm:text-3xl"
          >
            Architectural Data Boundaries
          </h2>
          <p className="light:text-zinc-600 mt-3 text-xs text-zinc-400 dark:text-zinc-400 sm:text-base">
            Aether is engineered around strict boundaries. Data control isn't a legal policy layer
            here; it is an foundational engineering priority.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-indigo-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-5">
            <h3 className="light:text-zinc-900 text-sm font-semibold text-zinc-100 dark:text-zinc-100">
              User Data Isolation
            </h3>
            <p className="light:text-zinc-600 mt-2 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 sm:text-sm">
              Your tables, records, and text assets are partitioned tightly at the server database
              layer. Cross-tenant leakage is systematically blocked via secure foreign key
              constraints.
            </p>
          </div>

          <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-cyan-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-5">
            <h3 className="light:text-zinc-900 text-sm font-semibold text-zinc-100 dark:text-zinc-100">
              AI Access Boundaries
            </h3>
            <p className="light:text-zinc-600 mt-2 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 sm:text-sm">
              External language models only receive explicitly passed context packages during
              processing. No generic perpetual background context scrapping takes place.
            </p>
          </div>

          <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-purple-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-5">
            <h3 className="light:text-zinc-900 text-sm font-semibold text-zinc-100 dark:text-zinc-100">
              Durable Memory Controls
            </h3>
            <p className="light:text-zinc-600 mt-2 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 sm:text-sm">
              Inspect everything the system retains about your workflow via a direct control
              interface. Modify or strip out records down to the individual vector reference block.
            </p>
          </div>

          <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-emerald-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-5">
            <h3 className="light:text-zinc-900 text-sm font-semibold text-zinc-100 dark:text-zinc-100">
              Privacy Transparency
            </h3>
            <p className="light:text-zinc-600 mt-2 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 sm:text-sm">
              We state clearly what fields are parsed during use. No obfuscated data capture, hidden
              tracking cookies, or tracking telemetries exist behind our routes.
            </p>
          </div>

          <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-amber-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-5">
            <h3 className="light:text-zinc-900 text-sm font-semibold text-zinc-100 dark:text-zinc-100">
              Full Data Export
            </h3>
            <p className="light:text-zinc-600 mt-2 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 sm:text-sm">
              Download your complete operational file library, active schemas, notes, and task lists
              in raw JSON/Markdown configuration structures instantly at any point.
            </p>
          </div>

          <div className="light:border-zinc-200/80 light:bg-white/70 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-rose-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-5">
            <h3 className="light:text-zinc-900 text-sm font-semibold text-zinc-100 dark:text-zinc-100">
              Permanent Deletion
            </h3>
            <p className="light:text-zinc-600 mt-2 text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 sm:text-sm">
              When you choose to delete your account record, our system runs explicit database
              cascades to purge all stored relational data from operational disks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
