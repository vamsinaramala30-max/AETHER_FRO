import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';

const PRIVACY_PILLARS = [
  {
    title: 'Absolute User Ownership',
    desc: 'You retain 100% ownership over all uploaded documents, chat conversations, and project context. We never claim IP rights over user content.',
  },
  {
    title: 'Data Minimization',
    desc: 'We collect only the minimal telemetry and user attributes strictly required to deliver workspace functionality and maintain system reliability.',
  },
  {
    title: 'Zero Public Model Training',
    desc: 'Your private workspace interactions are never used to train public foundation models or third-party AI systems.',
  },
  {
    title: 'Granular Account Controls',
    desc: 'Users can review active sessions, export complete workspace archives, or trigger full account deletion directly from Settings.',
  },
  {
    title: 'Transparent Data Handling',
    desc: 'Clear, readable documentation detailing exactly where data is stored, how vector embeddings are generated, and how third-party integrations operate.',
  },
  {
    title: 'Permanent Data Eradication',
    desc: 'When an account or workspace is deleted, relational records and associated vector embeddings are purged permanently from database storage.',
  },
];

export const PrivacyPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <div className="relative py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Product Philosophy
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Privacy-Conscious{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Artificial Intelligence.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              At AETHER, data privacy is not a compliance checkbox—it is a core design constraint embedded directly into our system architecture.
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PRIVACY_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8 backdrop-blur-xl transition-colors hover:border-indigo-500/30"
              >
                <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-zinc-400">{pillar.desc}</p>
              </div>
            ))}
          </div>

          {/* Privacy Policy Link Callout */}
          <div className="mt-16 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Looking for our formal legal privacy policy?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-300">
              Read our comprehensive Privacy Policy document covering data collection categories, user rights, cookies, third-party sub-processors, and legal disclosures.
            </p>
            <div className="mt-6">
              <Link
                to="/privacy-policy"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg"
              >
                View Full Privacy Policy →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default PrivacyPage;
