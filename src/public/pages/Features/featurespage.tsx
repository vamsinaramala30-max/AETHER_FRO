import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';

interface FeatureItem {
  id: string;
  name: string;
  category: string;
  status: 'Available' | 'Coming soon';
  whatItDoes: string;
  whyItMatters: string;
  howItHelps: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    category: 'Intelligence',
    status: 'Available',
    whatItDoes: 'Context-aware LLM copilot that directly inspects active workspace documents, code files, and conversation memory.',
    whyItMatters: 'General AI tools lack access to your specific workspace context, leading to generic and hallucinated outputs.',
    howItHelps: 'Generates instant accurate responses, drafts code, summarizes project milestones, and writes documentation based on your real data.',
  },
  {
    id: 'intelligent-conversations',
    name: 'Intelligent Conversations',
    category: 'Intelligence',
    status: 'Available',
    whatItDoes: 'Multi-turn chat threads with memory compaction, system prompt customization, and thread pinning.',
    whyItMatters: 'Long conversations degrade in quality when context limits expire without intelligent memory tracking.',
    howItHelps: 'Preserves critical decisions and code context across days of discussion without losing past references.',
  },
  {
    id: 'projects',
    name: 'Projects & Milestones',
    category: 'Workspace',
    status: 'Available',
    whatItDoes: 'Structured project board combining task items, deadlines, AI threads, and document attachments.',
    whyItMatters: 'Tasks disconnected from documentation and AI tools cause misaligned project tracking.',
    howItHelps: 'Keeps goals, code requirements, and automated task execution grouped in one organized dashboard.',
  },
  {
    id: 'knowledge-management',
    name: 'Knowledge Base',
    category: 'Knowledge',
    status: 'Available',
    whatItDoes: 'High-density vector indexing and hybrid search across uploaded PDF, Markdown, text, and code files.',
    whyItMatters: 'Finding technical documentation across multiple folders waste hours of engineering time every week.',
    howItHelps: 'Allows semantic natural language queries like "How do we handle OAuth token refreshes?" and returns exact document references.',
  },
  {
    id: 'file-understanding',
    name: 'File Understanding',
    category: 'Knowledge',
    status: 'Available',
    whatItDoes: 'Multi-format file parser that extracts entity relationships, code schemas, and key data fields automatically.',
    whyItMatters: 'Manual document review is slow and error-prone when onboarding new developers or reviewing contracts.',
    howItHelps: 'Summarizes complex 100-page specs into structured key takeaways within seconds.',
  },
  {
    id: 'memory',
    name: 'Cognitive Memory',
    category: 'Intelligence',
    status: 'Available',
    whatItDoes: 'Persists user preferences, coding patterns, and workspace terminology across all chat sessions.',
    whyItMatters: 'Having to re-explain project constraints every time you open a new chat is tedious.',
    howItHelps: 'Adapts to your coding style and domain vocabulary automatically over time.',
  },
  {
    id: 'workspace',
    name: 'Workspace Ecosystem',
    category: 'Workspace',
    status: 'Available',
    whatItDoes: 'Multi-tenant organization container with custom roles, member management, and workspace settings.',
    whyItMatters: 'Teams need clear boundary isolation to prevent unauthorized data exposure between projects.',
    howItHelps: 'Ensures admins, developers, and guests have appropriate read/write privileges.',
  },
  {
    id: 'automation',
    name: 'Workflow Automation',
    category: 'Automation',
    status: 'Available',
    whatItDoes: 'Background queue engine for scheduled cron jobs, webhook events, and multi-step AI tool chains.',
    whyItMatters: 'Repetitive daily tasks like status reports and data synching consume valuable focus time.',
    howItHelps: 'Executes automated routines automatically on schedule without requiring manual intervention.',
  },
  {
    id: 'productivity',
    name: 'Productivity Tools',
    category: 'Productivity',
    status: 'Available',
    whatItDoes: 'Integrated calendar events, task timers, prompt libraries, and quick action palettes.',
    whyItMatters: 'Switching between 5 different productivity apps destroys workflow momentum.',
    howItHelps: 'Consolidates everyday work tools inside one responsive interface.',
  },
  {
    id: 'search',
    name: 'Global Unified Search',
    category: 'Knowledge',
    status: 'Available',
    whatItDoes: 'Instant search bar (Cmd+K) indexing tasks, chats, knowledge documents, and automations.',
    whyItMatters: 'Navigating deeply nested folder hierarchies delays action execution.',
    howItHelps: 'Locates any item across your entire workspace in under 50 milliseconds.',
  },
  {
    id: 'notifications',
    name: 'Notification Center',
    category: 'Workspace',
    status: 'Available',
    whatItDoes: 'Real-time alert dispatch for task mentions, automation completions, and system events.',
    whyItMatters: 'Missing critical task updates or failed background jobs leads to project delays.',
    howItHelps: 'Delivers actionable in-app and push notifications to keep team members aligned.',
  },
  {
    id: 'collaboration',
    name: 'Team Collaboration',
    category: 'Workspace',
    status: 'Coming soon',
    whatItDoes: 'Real-time multi-cursor document editing, shared AI chat threads, and live comments.',
    whyItMatters: 'Asynchronous discussion often lacks the speed of real-time co-authoring.',
    howItHelps: 'Enables developers and product leads to pair-program and edit documents simultaneously.',
  },
  {
    id: 'personalization',
    name: 'AI Agent Personalization',
    category: 'Intelligence',
    status: 'Coming soon',
    whatItDoes: 'Custom AI agent persona builder with specialized system prompts and restricted tool permissions.',
    whyItMatters: 'Different workflows (e.g. security audits vs marketing copy) require different reasoning modes.',
    howItHelps: 'Creates specialized AI agents tailored to specific departmental workflows.',
  },
  {
    id: 'security',
    name: 'Enterprise Security Controls',
    category: 'Security',
    status: 'Available',
    whatItDoes: 'TLS in-transit encryption, salted password hashing, JWT session security, and rate limiting.',
    whyItMatters: 'Unsecured SaaS tools expose enterprise intellectual property to credentials leaks.',
    howItHelps: 'Protects user data with battle-tested cryptographic security standards.',
  },
  {
    id: 'privacy',
    name: 'Privacy Protection',
    category: 'Security',
    status: 'Available',
    whatItDoes: 'Zero public training policy, data minimization, local storage options, and full data deletion rights.',
    whyItMatters: 'Sending proprietary business data to external LLM trainers violates compliance.',
    howItHelps: 'Guarantees your confidential documents remain 100% private to your team.',
  },
];

export const FeaturesPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <div className="relative py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Capability Showcase
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Powerful Features for the{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Modern Stack.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
              Explore every capability built into AETHER. Every feature is designed with zero fluff and maximum utility.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div>
                  {/* Card Badge Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">
                      {feature.category}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        feature.status === 'Available'
                          ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                          : 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {feature.status}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {feature.name}
                  </h3>

                  {/* Section Breakdown */}
                  <div className="mt-6 space-y-4 text-xs leading-relaxed">
                    <div>
                      <span className="font-semibold uppercase tracking-wider text-zinc-300 block mb-1">
                        What It Does
                      </span>
                      <p className="text-zinc-400">{feature.whatItDoes}</p>
                    </div>

                    <div>
                      <span className="font-semibold uppercase tracking-wider text-zinc-300 block mb-1">
                        Why It Matters
                      </span>
                      <p className="text-zinc-400">{feature.whyItMatters}</p>
                    </div>

                    <div>
                      <span className="font-semibold uppercase tracking-wider text-zinc-300 block mb-1">
                        How It Helps You
                      </span>
                      <p className="text-zinc-300 font-medium">{feature.howItHelps}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Callout */}
          <div className="mt-20 rounded-3xl border border-white/10 bg-black/40 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to experience AETHER in action?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
              Create an account or get in touch with our product support team for custom enterprise workflow demos.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/signup"
                className="rounded-xl bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-lg hover:bg-zinc-200 transition-colors"
              >
                Create Free Account
              </Link>
              <Link
                to="/contact"
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default FeaturesPage;
