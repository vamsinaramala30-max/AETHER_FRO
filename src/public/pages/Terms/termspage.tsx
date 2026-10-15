import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, Scale, ShieldAlert } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const effectiveDate = 'October 15, 2026';
  const entityPlaceholder = '[AETHER Platform / Operating Legal Entity Name]';
  const addressPlaceholder = '[Registered Business Address / Place of Operation]';
  const jurisdictionPlaceholder = '[Applicable Jurisdiction / Country]';
  const verifiedContactEmail = 'vkgroups127@gmail.com';

  return (
    <PublicPageLayout>
      <div className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="border-b border-white/10 pb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              <Scale className="h-3.5 w-3.5" />
              Terms of Agreement
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-3 font-mono text-xs text-zinc-400">
              Effective Date: {effectiveDate} | Issuer:{' '}
              <span className="font-semibold text-zinc-300">{entityPlaceholder}</span>
            </p>
          </header>

          {/* Legal Notice Disclaimer Banner */}
          <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-xs text-zinc-300 sm:text-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div>
                <span className="font-semibold text-white">Notice Concerning Legal Review: </span>
                These Terms of Service outline fair, transparent terms governing use of the AETHER
                software platform. Prior to commercial production deployment, deploying organizations
                must specify their legal entity parameters and have these terms reviewed by legal counsel
                qualified in the governing jurisdiction.
              </div>
            </div>
          </div>

          {/* Terms Content */}
          <div className="mt-10 space-y-10 text-sm leading-relaxed text-zinc-300">
            {/* 1. Acceptance of Terms */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
              <p>
                By creating an account, accessing, or using the AETHER platform and related software
                services (the &quot;Service&quot;), you enter into an agreement with {entityPlaceholder}{' '}
                (&quot;AETHER,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) and agree to be bound
                by these Terms of Service (&quot;Terms&quot;).
              </p>
              <p>
                If you are using the Service on behalf of a business, company, or other organization, you
                represent that you have the requisite authority to bind that entity to these Terms.
              </p>
            </section>

            {/* 2. Description of the Service */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">2. Description of the Service</h2>
              <p>
                AETHER provides an integrated digital workspace that combines:
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-zinc-400">
                <li>Daily planning agendas, schedule blocks, and reminder tracking.</li>
                <li>Cognitive problem-solving drills and thinking habit exercises.</li>
                <li>Project management boards, task tracking, and milestone statuses.</li>
                <li>Document and file viewing with semantic vector search indexing.</li>
                <li>Context-aware AI conversation assistant tools.</li>
                <li>Focus timers, weekly overview planners, and web directories.</li>
              </ul>
              <p className="text-xs text-zinc-400">
                The Service is currently in active Public Beta. We continuously refine capabilities and may
                update or modify features to enhance stability and performance.
              </p>
            </section>

            {/* 3. Account Responsibilities */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">3. Account Responsibilities</h2>
              <p>
                You are responsible for maintaining the confidentiality of your login credentials and for all
                activities occurring under your account. You agree to:
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-zinc-400">
                <li>Provide accurate and current registration details.</li>
                <li>Use strong passwords and promptly report any suspected unauthorized access.</li>
                <li>Not share account credentials across multiple individuals unless authorized by your organization.</li>
              </ul>
            </section>

            {/* 4. Acceptable Use Policy */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">4. Acceptable Use Policy</h2>
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc space-y-1.5 pl-5 text-zinc-400">
                <li>Violate any applicable local, national, or international law or regulation.</li>
                <li>Attempt to probe, scan, or compromise system vulnerabilities or bypass security controls.</li>
                <li>Upload malicious software, viruses, corrupted files, or exploit payloads.</li>
                <li>Conduct automated scraping, abusive rate-limit circumvention, or denial-of-service attacks.</li>
                <li>Transmit abusive, fraudulent, harassing, or unlawful material.</li>
              </ul>
            </section>

            {/* 5. AI-Generated Content Limitations */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">5. AI-Generated Content Limitations & Disclaimers</h2>
              <p>
                AETHER features generative artificial intelligence capabilities powered by large language
                models. You acknowledge and agree that:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-zinc-400">
                <li>
                  <strong className="text-zinc-200">Probabilistic Nature:</strong> AI outputs are generated
                  statistically based on pattern recognition and may contain factual inaccuracies, omissions,
                  hallucinations, or outdated information.
                </li>
                <li>
                  <strong className="text-zinc-200">Independent Verification:</strong> You are responsible for
                  independently reviewing, testing, and verifying any AI-generated code, calculation, or
                  recommendation before relying upon it for mission-critical, legal, medical, or financial matters.
                </li>
                <li>
                  <strong className="text-zinc-200">No Professional Advice:</strong> AI assistant responses do
                  not constitute professional legal, accounting, tax, medical, or architectural advice.
                </li>
              </ul>
            </section>

            {/* 6. User Content & Intellectual Property */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">6. User Content & Intellectual Property</h2>
              <p>
                <strong className="text-zinc-200">Your Content:</strong> You retain full ownership, title,
                and intellectual property rights in the text, documents, code, notes, and tasks you submit to
                the Service. You grant AETHER only the limited, non-exclusive license strictly necessary to
                host, store, index, and display your content within your authenticated workspace.
              </p>
              <p>
                <strong className="text-zinc-200">AETHER Property:</strong> {entityPlaceholder} and its
                licensors retain all rights, title, and interest in the AETHER platform, user interface designs,
                logos, underlying software, and algorithmic architectures.
              </p>
            </section>

            {/* 7. Subscriptions, Fees & Beta Access */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">7. Fees, Subscriptions, and Beta Access</h2>
              <p>
                The Service is currently accessible as a free Public Beta / self-hosted open workspace. No
                subscription fees or automated renewal charges are incurred.
              </p>
              <p>
                If commercial subscription plans are introduced in the future, prices, billing intervals,
                renewal policies, and cancellation terms will be displayed with complete clarity prior to
                any charge. No user will be billed without explicit, affirmative consent.
              </p>
            </section>

            {/* 8. Service Availability & Limitation of Liability */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">8. Service Availability & Limitation of Liability</h2>
              <p>
                We strive for continuous, reliable operation but do not guarantee 100% uninterrupted,
                error-free execution. To the maximum extent permitted by applicable law, neither party shall be
                liable for indirect, incidental, special, consequential, or punitive damages.
              </p>
              <p className="text-xs text-zinc-400">
                Nothing in these Terms limits liability for gross negligence, willful misconduct, or any liability
                that cannot be lawfully excluded under applicable consumer protection legislation.
              </p>
            </section>

            {/* 9. Dispute Resolution, Consumer Rights & Formal Complaints */}
            <section className="space-y-4 rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-400" />
                <h2 className="text-lg font-bold text-white">
                  9. Dispute Handling, Escalation & Statutory Consumer Rights
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-zinc-300 sm:text-sm">
                If you experience a broken feature, an inaccurate representation, or a service discrepancy, we
                encourage you to utilize our formal resolution system before initiating external disputes:
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/complaint"
                  className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-rose-500 sm:text-sm"
                >
                  File a Formal Complaint
                </Link>
                <a
                  href={`mailto:${verifiedContactEmail}`}
                  className="text-xs font-semibold text-indigo-400 underline hover:text-indigo-300 sm:text-sm"
                >
                  Legal & Escalation Desk: {verifiedContactEmail}
                </a>
              </div>
              <p className="text-xs text-zinc-400">
                <strong className="text-zinc-300">Consumer Rights Protection:</strong> Nothing in these Terms
                deprives users of statutory rights or remedies available under mandatory consumer protection laws
                in their jurisdiction. Submitting a complaint through our internal resolution queue does not
                restrict your legal rights to pursue administrative or judicial remedies where applicable.
              </p>
            </section>

            {/* 10. Governing Law & Contact */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">10. Governing Law & Inquiries</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of{' '}
                <span className="font-semibold text-zinc-200">{jurisdictionPlaceholder}</span>, without
                regard to conflict of law principles.
              </p>
              <p className="text-xs text-zinc-400">
                Formal legal inquiries may be addressed to: {entityPlaceholder}, Attn: Legal Department,{' '}
                {addressPlaceholder}, or via email at {verifiedContactEmail}.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default TermsPage;
