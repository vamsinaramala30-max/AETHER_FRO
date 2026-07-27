import React from 'react';

export const TrustCenterPreview: React.FC = () => {
  return (
    <section className="border-b border-zinc-900 py-20" aria-labelledby="trust-heading">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="trust-heading"
          className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl"
        >
          Engineering Transparancy Commitments
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          We prioritize honest positioning. Aether does not display third-party audit marketing
          banners or standard pre-packaged compliance seals unless actively validated on production
          infrastructure.
        </p>

        <div className="mx-auto mt-8 max-w-xl rounded border border-zinc-900 bg-zinc-950 p-4 text-left font-mono text-xs text-zinc-500">
          <p className="mb-2 text-zinc-400">// Active Status Log:</p>
          <p>
            • SOC2 / GDPR / HIPAA Compliance Status: Not evaluated. Architected for future
            regulatory alignment.
          </p>
          <p className="mt-1">
            • Cryptographic Architecture: TLS for transit operations; database encryption keys held
            at host layer.
          </p>
          <p className="mt-1">• Third Party Telemetry: None injected into application pipelines.</p>
        </div>
      </div>
    </section>
  );
};
