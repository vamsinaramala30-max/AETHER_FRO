import React from 'react';

export const PrivacyPreview: React.FC = () => {
  return (
    <section className="py-20 bg-[#0D0F16] border-b border-zinc-900" aria-labelledby="privacy-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 id="privacy-heading" className="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
            Architectural Data Boundaries
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400">
            Aether is engineered around strict boundaries. Data control isn't a legal policy layer here; it is an foundational engineering priority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-lg">
            <h3 className="text-sm font-semibold text-zinc-200">User Data Isolation</h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">
              Your tables, records, and text assets are partitioned tightly at the server database layer. Cross-tenant leakage is systematically blocked via secure foreign key constraints.
            </p>
          </div>

          <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-lg">
            <h3 className="text-sm font-semibold text-zinc-200">AI Access Boundaries</h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">
              External language models only receive explicitly passed context packages during processing. No generic perpetual background context scrapping takes place.
            </p>
          </div>

          <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-lg">
            <h3 className="text-sm font-semibold text-zinc-200">Durable Memory Controls</h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">
              Inspect everything the system retains about your workflow via a direct control interface. Modify or strip out records down to the individual vector reference block.
            </p>
          </div>

          <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-lg">
            <h3 className="text-sm font-semibold text-zinc-200">Privacy Transparency</h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">
              We state clearly what fields are parsed during use. No obfuscated data capture, hidden tracking cookies, or tracking telemetries exist behind our routes.
            </p>
          </div>

          <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-lg">
            <h3 className="text-sm font-semibold text-zinc-200">Full Data Export</h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">
              Download your complete operational file library, active schemas, notes, and task lists in raw JSON/Markdown configuration structures instantly at any point.
            </p>
          </div>

          <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-lg">
            <h3 className="text-sm font-semibold text-zinc-200">Permanent Deletion</h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">
              When you choose to delete your account record, our system runs explicit database cascades to purge all stored relational data from operational disks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};