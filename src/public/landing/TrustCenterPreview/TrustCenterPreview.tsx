import React from 'react';

export const TrustCenterPreview: React.FC = () => {
  return (
    <section className="py-20 border-b border-zinc-900" aria-labelledby="trust-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 id="trust-heading" className="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
          Engineering Transparancy Commitments
        </h2>
        <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          We prioritize honest positioning. Aether does not display third-party audit marketing banners or standard pre-packaged compliance seals unless actively validated on production infrastructure.
        </p>
        
        <div className="mt-8 max-w-xl mx-auto p-4 bg-zinc-950 border border-zinc-900 rounded text-left font-mono text-xs text-zinc-500">
          <p className="text-zinc-400 mb-2">// Active Status Log:</p>
          <p>• SOC2 / GDPR / HIPAA Compliance Status: Not evaluated. Architected for future regulatory alignment.</p>
          <p className="mt-1">• Cryptographic Architecture: TLS for transit operations; database encryption keys held at host layer.</p>
          <p className="mt-1">• Third Party Telemetry: None injected into application pipelines.</p>
        </div>
      </div>
    </section>
  );
};