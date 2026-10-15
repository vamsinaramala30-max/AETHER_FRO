import React, { useState } from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';
import { HelpCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Getting Started',
    question: 'What is AETHER and how do I get started?',
    answer:
      'AETHER is a personal AI workspace platform combining daily planning, project tracking, knowledge documents, and cognitive problem-solving practice. You can get started by creating a free account at /signup and selecting your workspace experience on the /welcome page.',
  },
  {
    category: 'Getting Started',
    question: 'Is there a desktop app or mobile version?',
    answer:
      'AETHER is fully accessible through modern desktop and mobile web browsers. Native desktop and mobile applications are planned roadmap milestones.',
  },
  {
    category: 'Pricing & Plans',
    question: 'How much does AETHER cost?',
    answer:
      'AETHER is currently completely free during our Public Beta / self-hosted open workspace preview. No credit card, subscription fees, or automated renewal charges are required.',
  },
  {
    category: 'Account & Login',
    question: 'How do I change my account credentials?',
    answer:
      'You can update your display name, bio, and account information directly inside your authenticated workspace under Settings → Profile. If you lose access to your account credentials, contact our support team at vkgroups127@gmail.com.',
  },
  {
    category: 'Account & Login',
    question: 'Is Two-Factor Authentication (2FA) supported?',
    answer:
      'Two-Factor Authentication (TOTP / 2FA) is currently on our architectural roadmap for a future release and is not yet available in the beta application.',
  },
  {
    category: 'AI Assistant',
    question: 'Are AI assistant responses always accurate?',
    answer:
      'No. AI assistant responses are generated algorithmically using large language models and can occasionally contain factual errors, omissions, or hallucinations. Always independently verify critical information, code, and decisions.',
  },
  {
    category: 'AI Assistant',
    question: 'Are my private documents used to train public AI models?',
    answer:
      'No. AETHER operates under strict tenant data isolation boundaries. Your private workspace conversations, notes, and documents are never used to train public third-party foundation models.',
  },
  {
    category: 'Projects & Tasks',
    question: 'How do project boards and milestones work?',
    answer:
      'Projects group related tasks, deadlines, milestones, and status tags together. You can update priorities, move tasks between workflow columns, and monitor completion progress in real-time.',
  },
  {
    category: 'Knowledge Base',
    question: 'What file formats can I upload for AI search?',
    answer:
      'AETHER supports PDF, Markdown (.md), Plain Text (.txt), CSV, and common source code files up to 50MB per file with semantic vector indexing powered by PostgreSQL pgvector.',
  },
  {
    category: 'Workspace & Tools',
    question: 'What quick productivity tools are included?',
    answer:
      'AETHER includes a Daily Smart Planner, a Pomodoro Focus Timer, a Weekly Overview Planner, an interactive Cognitive Hub with logic exercises, and a customizable Web Resource Directory.',
  },
  {
    category: 'Privacy & Security',
    question: 'How is data encrypted and secured?',
    answer:
      'All traffic is protected with TLS 1.3 encryption in transit. Passwords are cryptographically salted and hashed before database persistence, and all queries enforce workspace tenant scoping.',
  },
  {
    category: 'Troubleshooting & Complaints',
    question: 'How do I report a broken feature or inaccurate claim?',
    answer:
      'If you encounter a feature that does not work as advertised or notice any misleading representation, you can formally log it in our resolution queue via our User Complaint System at /complaint or email vkgroups127@gmail.com.',
  },
];

const CATEGORIES = [
  'All',
  'Getting Started',
  'Pricing & Plans',
  'Account & Login',
  'AI Assistant',
  'Projects & Tasks',
  'Knowledge Base',
  'Workspace & Tools',
  'Privacy & Security',
  'Troubleshooting & Complaints',
];

export const HelpPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const toggleFAQ = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const filteredFAQs = FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PublicPageLayout>
      <div className="relative py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              <HelpCircle className="h-3.5 w-3.5" />
              Accurate Knowledge & FAQ
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Help Center & FAQs
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400">
              Clear, verified answers about how AETHER works, current beta capabilities, privacy
              protections, and troubleshooting steps.
            </p>

            {/* Interactive Search Bar */}
            <div className="relative mx-auto mt-8 max-w-2xl">
              <input
                type="text"
                placeholder="Search help topics (e.g. planner, vector search, privacy, pricing)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 pl-12 text-sm text-white placeholder-zinc-500 shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <svg
                className="absolute left-4 top-4 h-5 w-5 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'border border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="mt-12 space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
                <p className="text-base text-zinc-400">No matching help articles found.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4 text-xs font-semibold text-indigo-400 hover:underline"
                >
                  Clear filters and search query
                </button>
              </div>
            ) : (
              filteredFAQs.map((faq, idx) => {
                const isOpen = openIndexes.includes(idx);
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-colors hover:border-white/20"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFAQ(idx)}
                      className="flex w-full items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-expanded={isOpen}
                    >
                      <div className="flex flex-col gap-1 pr-4">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">
                          {faq.category}
                        </span>
                        <h3 className="text-base font-semibold text-white sm:text-lg">
                          {faq.question}
                        </h3>
                      </div>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-zinc-400">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-white/5 px-6 pb-6 pt-4 text-sm leading-relaxed text-zinc-400">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Contact Support & Complaint Banner */}
          <div className="mt-16 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Still Have Questions or Issues?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-300">
              Reach out directly to our engineering team or submit a formal report if any feature
              does not work as described.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Contact Support Team
              </Link>
              <Link
                to="/complaint"
                className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-6 py-3 text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/20"
              >
                <ShieldAlert className="h-4 w-4" />
                Report Problem / Complaint
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default HelpPage;
