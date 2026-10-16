import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';
import { Shield, Lock, Trash2, Sliders, Database, EyeOff, ShieldAlert } from 'lucide-react';

const PRIVACY_PILLARS = [
  {
    icon: Lock,
    title: 'Full User Content Ownership',
    desc: 'You retain full ownership and intellectual property rights over all uploaded documents, notes, chat conversations, and project items. We never claim IP rights over your content.',
  },
  {
    icon: EyeOff,
    title: 'Zero Public Model Training',
    desc: 'Your private workspace interactions, prompts, documents, and notes are never used to train public foundation models or shared with unauthorized third parties.',
  },
  {
    icon: Database,
    title: 'Tenant Database Boundary Scoping',
    desc: 'All relational tables and vector embeddings in PostgreSQL strictly enforce workspace tenant isolation to prevent unauthorized cross-tenant exposure.',
  },
  {
    icon: Sliders,
    title: 'Data Minimization Principle',
    desc: 'We collect and process only the minimal authentication records and technical telemetry strictly necessary to deliver reliable workspace functionality.',
  },
  {
    icon: Trash2,
    title: 'Account & Data Deletion Controls',
    desc: 'Users have the right to request deletion of their account. Upon verified deletion, associated database rows and uploaded files are purged from active systems.',
  },
  {
    icon: Shield,
    title: 'Transparent Technical Security',
    desc: 'Network traffic is encrypted using TLS 1.3 in transit, and passwords are salted and hashed using modern key derivation functions.',
  },
];

export const PrivacyPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <div className="relative py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              <Shield className="h-3.5 w-3.5" />
              Privacy Principles
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Privacy-Conscious{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                System Design.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              At AETHER, data privacy is a foundational engineering discipline. We build with
              transparent boundaries, strict database scoping, and honest disclosures.
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PRIVACY_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl transition-colors hover:border-indigo-500/30 sm:p-8"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-white">{pillar.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-400 sm:text-sm">{pillar.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Privacy Concern Reporting Banner */}
          <div className="mt-16 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 sm:p-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Have a Privacy or Data Handling Concern?</h3>
                  <p className="mt-1 text-xs text-zinc-300 sm:text-sm">
                    If you have questions about how your information is handled, or wish to report a
                    suspected privacy issue, submit a report directly to our review queue.
                  </p>
                </div>
              </div>
              <Link
                to="/complaint"
                className="shrink-0 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-rose-500 sm:text-sm"
              >
                Report Privacy Concern
              </Link>
            </div>
          </div>

          {/* Formal Legal Policy Callout */}
          <div className="mt-16 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Read Our Full Legal Privacy Policy
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-300">
              Our comprehensive Privacy Policy provides detailed legal notices regarding data categories,
              purposes, AI sub-processors, retention periods, and your rights under applicable law.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/privacy-policy"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                View Full Privacy Policy →
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Contact Privacy Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default PrivacyPage;
