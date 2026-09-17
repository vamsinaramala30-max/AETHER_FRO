import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  const lastUpdated = 'August 10, 2026';
  const companyName = 'Aether Systems';

  return (
    <PublicPageLayout>
      <div className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="border-b border-white/10 pb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">
              Terms of Agreement
            </span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-3 font-mono text-xs text-zinc-400">
              Effective Date: {lastUpdated} | Issuer: {companyName}
            </p>
          </header>

          {/* Document Content */}
          <div className="mt-10 space-y-10 text-sm leading-relaxed text-zinc-300">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
              <p>
                By creating an account, accessing, or using the AETHER platform
                (&quot;Service&quot;), you agree to be bound by these Terms of Service
                (&quot;Terms&quot;). If you are agreeing to these Terms on behalf of an
                organization, you represent that you have the legal authority to bind that entity.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">2. Account Responsibilities</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials,
                passwords, and API keys. You accept responsibility for all activities occurring
                under your authenticated session.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">3. Acceptable Use Policy</h2>
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc space-y-1 pl-5 text-zinc-400">
                <li>Violate applicable laws, regulations, or third-party rights.</li>
                <li>
                  Attempt reverse-engineering, scraping, or automated rate-limit circumvention.
                </li>
                <li>Upload malicious code, viruses, or exploit payloads.</li>
                <li>Transmit harmful, harassing, or fraudulent content.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">4. AI Usage & Content Standards</h2>
              <p>
                AETHER includes artificial intelligence features designed to generate completions,
                summarize text, and execute tool actions. You acknowledge that AI outputs are
                generated algorithmically and should be validated for accuracy before critical
                deployment.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">
                5. User Content & Intellectual Property
              </h2>
              <p>
                You retain all ownership and intellectual property rights in your uploaded content
                and data. {companyName} retains all rights, titles, and interests in the AETHER
                platform software, UI designs, code base, and trademarks.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">
                6. Service Availability & Disclaimers
              </h2>
              <p>
                The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis.
                We strive for maximum uptime but do not warrant uninterrupted or error-free
                execution.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, {companyName} shall not be liable
                for indirect, incidental, special, consequential, or punitive damages resulting from
                your use of or inability to use the Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">8. Termination & Changes to Terms</h2>
              <p>
                We reserve the right to suspend or terminate accounts violating these Terms. We may
                update these Terms periodically and will notify users of material changes via
                website notice or email.
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-black/40 p-6">
              <h2 className="text-lg font-bold text-white">9. Questions & Legal Inquiries</h2>
              <p className="mt-1 text-xs text-zinc-400">
                For legal questions or formal notices regarding these Terms, please reach out via
                our{' '}
                <Link to="/contact" className="text-indigo-400 underline hover:text-indigo-300">
                  Contact Page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default TermsPage;
