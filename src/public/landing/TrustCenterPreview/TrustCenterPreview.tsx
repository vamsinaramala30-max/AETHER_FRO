import React from 'react';

export const TrustCenterPreview: React.FC = () => {
  return (
    <section
      className="border-b border-zinc-800/40 dark:border-zinc-800/40 light:border-zinc-200/60 bg-zinc-950/20 dark:bg-zinc-950/20 light:bg-white/30 backdrop-blur-md py-16 sm:py-20 lg:py-24"
      aria-labelledby="trust-heading"
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="trust-heading"
          className="text-2xl font-semibold tracking-tight text-zinc-100 dark:text-zinc-100 light:text-zinc-900 sm:text-3xl"
        >
          Engineering Transparency Commitments
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-zinc-400 dark:text-zinc-400 light:text-zinc-600 sm:text-base">
          We prioritize honest positioning. Aether does not display third-party audit marketing
          banners or standard pre-packaged compliance seals unless actively validated on production
          infrastructure.
        </p>

        <div className="mx-auto mt-8 max-w-xl rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200/80 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-slate-900 p-4 text-left font-mono text-[11px] sm:text-xs text-zinc-300 backdrop-blur-xl shadow-lg">
          <p className="mb-2 text-indigo-400 dark:text-indigo-400 light:text-indigo-300 font-semibold">// Active Status Log:</p>
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
