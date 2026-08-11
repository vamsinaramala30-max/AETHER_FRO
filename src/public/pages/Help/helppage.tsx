import React, { useState } from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';

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
      'AETHER is an AI-first workspace platform combining intelligence, tasks, documents, and automation. You can get started by signing up for an account, creating your workspace, and inviting team members.',
  },
  {
    category: 'Getting Started',
    question: 'Is there a desktop app or mobile version?',
    answer:
      'AETHER is fully accessible through modern web browsers across desktop and mobile devices. Dedicated mobile apps and electron desktop clients are scheduled for upcoming release phases.',
  },
  {
    category: 'Account & Login',
    question: 'How do I reset my account password?',
    answer:
      'Click on "Sign In", select "Forgot password?", enter your registered email address, and follow the password reset link delivered to your inbox.',
  },
  {
    category: 'Account & Login',
    question: 'Can I enable Two-Factor Authentication (2FA)?',
    answer:
      'Yes, 2FA can be configured in Account Settings under Security using any standard TOTP authenticator application.',
  },
  {
    category: 'AI Assistant',
    question: 'How does the AI assistant maintain context?',
    answer:
      'The AI assistant queries workspace relational documents, memory snippets, and recent conversation turns to build a relevant prompt context for every query.',
  },
  {
    category: 'AI Assistant',
    question: 'Are my conversations used to train public LLM models?',
    answer:
      'No. AETHER operates under strict tenant data privacy boundaries. Private workspace conversations are never transmitted to train public third-party models.',
  },
  {
    category: 'Projects',
    question: 'How do project task milestones work?',
    answer:
      'Projects group related tasks, documents, and AI prompt threads together. You can assign milestones, set dependencies, and track completion progress in real-time.',
  },
  {
    category: 'Knowledge',
    question: 'What file formats can I upload for AI search?',
    answer:
      'AETHER supports PDF, Markdown (.md), Plain Text (.txt), CSV, JSON, and common source code files up to 50MB per file.',
  },
  {
    category: 'Workspace',
    question: 'How do workspace roles and permissions work?',
    answer:
      'Workspace Owners and Admins can configure granular access roles (Admin, Member, Guest) to control who can edit workspace documents, run automations, or change settings.',
  },
  {
    category: 'Automation',
    question: 'How do scheduled automated workflows execute?',
    answer:
      'Automations run on secure background queues. They can trigger on webhook events, time-based cron schedules, or workspace state changes.',
  },
  {
    category: 'Privacy & Security',
    question: 'How is data encrypted in transit and at rest?',
    answer:
      'All traffic is protected with TLS 1.3 encryption in transit. Data at rest in PostgreSQL databases is protected with hardware-managed volume encryption.',
  },
  {
    category: 'Troubleshooting',
    question: 'What should I do if a search query returns no results?',
    answer:
      'Check that the relevant document has completed vector indexing in Knowledge Base. You can click "Re-index workspace" under Knowledge Settings.',
  },
];

const CATEGORIES = [
  'All',
  'Getting Started',
  'Account & Login',
  'AI Assistant',
  'Projects',
  'Knowledge',
  'Workspace',
  'Automation',
  'Privacy & Security',
  'Troubleshooting',
];

export const HelpPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const toggleFAQ = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFAQs = FAQS.filter((faq) => {
    const matchesCategory =
      selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PublicPageLayout>
      <div className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Support & Knowledge Base
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              How can we help you today?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400">
              Search our help center for instant answers to common questions, platform guides, and troubleshooting steps.
            </p>

            {/* Interactive Search Bar */}
            <div className="mt-8 mx-auto max-w-2xl relative">
              <input
                type="text"
                placeholder="Search help topics (e.g. password, vector search, encryption)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 pl-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xl"
              />
              <svg
                className="absolute left-4 top-4 h-5 w-5 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                    className="rounded-2xl border border-white/10 bg-white/[0.025] overflow-hidden transition-colors hover:border-white/20"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFAQ(idx)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-expanded={isOpen}
                    >
                      <div className="flex flex-col gap-1 pr-4">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">
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

          {/* Contact Support Banner */}
          <div className="mt-16 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Still have questions?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-300">
              Can&apos;t find what you&apos;re looking for? Reach out directly to our dedicated support and technical engineering team.
            </p>
            <div className="mt-6">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-transform hover:-translate-y-0.5 shadow-lg"
              >
                Contact Support Team →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default HelpPage;
