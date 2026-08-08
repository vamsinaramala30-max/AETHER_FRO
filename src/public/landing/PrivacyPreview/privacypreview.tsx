import React from 'react';

export const PrivacyPreview: React.FC = () => {
  return (
    <section
      className="border-b border-zinc-800/50 bg-zinc-950/40 py-16 sm:py-20 lg:py-24"
      aria-labelledby="privacy-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2
            id="privacy-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl"
          >
            Architectural Data Boundaries
          </h2>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            Aether is engineered around strict boundaries. Data control isn't a legal policy layer
            here; it is an foundational engineering priority.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-5">
            <h3 className="text-sm font-semibold text-zinc-200">User Data Isolation</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500 sm:text-sm">
              Your tables, records, and text assets are partitioned tightly at the server database
              layer. Cross-tenant leakage is systematically blocked via secure foreign key
              constraints.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-5">
            <h3 className="text-sm font-semibold text-zinc-200">AI Access Boundaries</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500 sm:text-sm">
              External language models only receive explicitly passed context packages during
              processing. No generic perpetual background context scrapping takes place.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-5">
            <h3 className="text-sm font-semibold text-zinc-200">Durable Memory Controls</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500 sm:text-sm">
              Inspect everything the system retains about your workflow via a direct control
              interface. Modify or strip out records down to the individual vector reference block.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-5">
            <h3 className="text-sm font-semibold text-zinc-200">Privacy Transparency</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500 sm:text-sm">
              We state clearly what fields are parsed during use. No obfuscated data capture, hidden
              tracking cookies, or tracking telemetries exist behind our routes.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-5">
            <h3 className="text-sm font-semibold text-zinc-200">Full Data Export</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500 sm:text-sm">
              Download your complete operational file library, active schemas, notes, and task lists
              in raw JSON/Markdown configuration structures instantly at any point.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-5">
            <h3 className="text-sm font-semibold text-zinc-200">Permanent Deletion</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500 sm:text-sm">
              When you choose to delete your account record, our system runs explicit database
              cascades to purge all stored relational data from operational disks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
