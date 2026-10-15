import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';
import { AlertCircle, ShieldAlert } from 'lucide-react';

interface FeatureItem {
  id: string;
  name: string;
  category: string;
  status: 'Available' | 'Coming soon';
  whatItDoes: string;
  whyItMatters: string;
  howItHelps: string;
  limitations?: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'smart-planner',
    name: 'Daily Smart Planner & Reminders',
    category: 'Productivity',
    status: 'Available',
    whatItDoes:
      'Organizes your daily tasks into an adaptive schedule with timely reminders and priority tracking.',
    whyItMatters:
      'Scattered to-do lists without structured scheduling lead to forgotten tasks and lost daily momentum.',
    howItHelps:
      'Keeps your daily priorities front-and-center so you execute your most important goals consistently.',
    limitations: 'Requires user to set realistic time allotments; does not auto-complete offline tasks.',
  },
  {
    id: 'cognitive-hub',
    name: 'Cognitive Hub & Reasoning Drills',
    category: 'Productivity',
    status: 'Available',
    whatItDoes:
      'Interactive problem-solving exercises and logic drills that train structured thinking habits.',
    whyItMatters:
      'Routine task execution without active cognitive practice can lead to reactive rather than analytical decision making.',
    howItHelps:
      'Sharpens analytical focus and problem breakdown techniques before tackling complex daily work.',
    limitations: 'Exercises are structured practice drills; they do not replace formal domain training.',
  },
  {
    id: 'projects',
    name: 'Projects & Milestones',
    category: 'Workspace',
    status: 'Available',
    whatItDoes:
      'Structured project boards combining tasks, priorities, milestone deadlines, and status tracking.',
    whyItMatters:
      'Projects disconnected from documentation and daily agendas cause missed deadlines and alignment gaps.',
    howItHelps:
      'Keeps goals, deliverables, and execution statuses organized in one transparent dashboard.',
  },
  {
    id: 'ai-assistant',
    name: 'AI Context Assistant',
    category: 'Intelligence',
    status: 'Available',
    whatItDoes:
      'Conversational copilot that retrieves relevant workspace notes, task context, and document excerpts.',
    whyItMatters:
      'Generic AI models lack awareness of your specific project data, leading to generic outputs.',
    howItHelps:
      'Assists with drafting, summarizing notes, brainstorming, and explaining complex documentation.',
    limitations:
      'AI responses are probabilistic and may contain inaccuracies or hallucinations. Always verify critical code, facts, and figures independently.',
  },
  {
    id: 'intelligent-conversations',
    name: 'Conversation Threads & Memory',
    category: 'Intelligence',
    status: 'Available',
    whatItDoes:
      'Multi-turn chat threads with stored message history, system prompt customization, and thread naming.',
    whyItMatters:
      'Starting fresh chats every session forces repetitive re-explanation of project background.',
    howItHelps:
      'Preserves your discussion trajectory across sessions within your authenticated workspace.',
  },
  {
    id: 'knowledge-management',
    name: 'Knowledge Base & Document Viewing',
    category: 'Knowledge',
    status: 'Available',
    whatItDoes:
      'Upload, view, and organize PDF, Markdown, text, CSV, and code files with semantic vector indexing.',
    whyItMatters:
      'Searching across fragmented folders delays execution and scatters critical reference specs.',
    howItHelps:
      'Allows natural language queries across uploaded documentation with direct citation references.',
    limitations: 'Supported file formats up to 50MB per upload; processing time varies with document length.',
  },
  {
    id: 'focus-tools',
    name: 'Focus Timer & Web Directory',
    category: 'Productivity',
    status: 'Available',
    whatItDoes:
      'Built-in Pomodoro focus timer, weekly overview planner, and customizable web bookmark directory.',
    whyItMatters:
      'Opening multiple external tool tabs creates visual clutter and increases context switching.',
    howItHelps:
      'Consolidates everyday focus and planning utilities directly inside your workspace.',
  },
  {
    id: 'workspace-rbac',
    name: 'Workspace Roles & Settings',
    category: 'Workspace',
    status: 'Available',
    whatItDoes:
      'Workspace container with scoped member roles (Owner, Admin, Member, Viewer) and preferences.',
    whyItMatters:
      'Teams require clear boundary isolation to manage access to sensitive project repositories.',
    howItHelps:
      'Ensures users have appropriate read and write access scoped to their organization role.',
  },
  {
    id: 'global-search',
    name: 'Unified Workspace Search',
    category: 'Knowledge',
    status: 'Available',
    whatItDoes:
      'Keyboard-accessible search bar (Cmd+K) indexing tasks, notes, documents, and workspace tools.',
    whyItMatters:
      'Navigating deep hierarchical trees slows down everyday navigation.',
    howItHelps:
      'Quickly locates tasks, documents, and tools without leaving your current view.',
  },
  {
    id: 'security-controls',
    name: 'Authentication & Technical Security',
    category: 'Security',
    status: 'Available',
    whatItDoes:
      'TLS 1.3 in-transit encryption, salted password hashing, JWT session authentication, and rate limiting.',
    whyItMatters:
      'Unsecured web applications expose account credentials and sensitive workspace data.',
    howItHelps:
      'Protects user sessions and accounts with industry-standard web security practices.',
  },
  {
    id: 'privacy-protection',
    name: 'Tenant Privacy & Deletion Rights',
    category: 'Security',
    status: 'Available',
    whatItDoes:
      'Database tenant isolation by workspace ID, zero public model training on private data, and data deletion options.',
    whyItMatters:
      'Sending private business data to public LLM training datasets violates confidentiality.',
    howItHelps:
      'Ensures your private data remains within your tenant boundary and can be purged upon request.',
  },
  {
    id: 'collaboration',
    name: 'Real-Time Co-Authoring',
    category: 'Workspace',
    status: 'Coming soon',
    whatItDoes:
      'Simultaneous multi-cursor document editing, shared AI chat threads, and live presence indicators.',
    whyItMatters:
      'Asynchronous document updates often create editing conflicts and slow down pair-work.',
    howItHelps:
      'Will enable distributed team members to draft documents and review tasks simultaneously.',
  },
  {
    id: 'persona-builder',
    name: 'Custom AI Agent Personas',
    category: 'Intelligence',
    status: 'Coming soon',
    whatItDoes:
      'Configurable agent personas with specialized guidelines, system constraints, and tool permissions.',
    whyItMatters:
      'Different departments (e.g., engineering vs legal) require specialized reasoning boundaries.',
    howItHelps:
      'Will allow organizations to tailor assistant instructions to specific workflows.',
  },
];

export const FeaturesPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <div className="relative py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Verified Capabilities
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Honest Breakdown of{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                AETHER Features.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              Every feature description below reflects our actual implementation. We clearly label
              what is available today, how it works, and its limitations.
            </p>
          </div>

          {/* AI Accuracy Notice Alert */}
          <div className="mt-10 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 backdrop-blur-xl sm:p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
              <div className="text-xs leading-relaxed text-zinc-300 sm:text-sm">
                <span className="font-semibold text-white">Important AI Accuracy Notice: </span>
                AI assistance features in AETHER rely on large language models. While useful for
                drafting, synthesis, and search, AI outputs can contain factual errors, hallucinations,
                or outdated guidance. Critical code, numbers, and decisions should always be
                independently verified.
              </div>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 sm:p-8"
              >
                <div>
                  {/* Card Badge Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">
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

                  <h3 className="mt-4 text-xl font-bold text-white transition-colors group-hover:text-indigo-300">
                    {feature.name}
                  </h3>

                  {/* Section Breakdown */}
                  <div className="mt-6 space-y-4 text-xs leading-relaxed">
                    <div>
                      <span className="mb-1 block font-semibold uppercase tracking-wider text-zinc-300">
                        What It Does
                      </span>
                      <p className="text-zinc-400">{feature.whatItDoes}</p>
                    </div>

                    <div>
                      <span className="mb-1 block font-semibold uppercase tracking-wider text-zinc-300">
                        Why It Matters
                      </span>
                      <p className="text-zinc-400">{feature.whyItMatters}</p>
                    </div>

                    <div>
                      <span className="mb-1 block font-semibold uppercase tracking-wider text-zinc-300">
                        How It Helps
                      </span>
                      <p className="font-medium text-zinc-300">{feature.howItHelps}</p>
                    </div>

                    {feature.limitations && (
                      <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                        <span className="mb-1 block font-semibold uppercase tracking-wider text-amber-400/90">
                          Current Limitation
                        </span>
                        <p className="text-zinc-400">{feature.limitations}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Report Inaccurate Description Banner */}
          <div className="mt-16 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 sm:p-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Notice a Feature Discrepancy?</h3>
                  <p className="mt-1 text-xs text-zinc-300 sm:text-sm">
                    If any feature does not function as described above, or if any representation
                    appears inaccurate, submit a formal report to our review queue.
                  </p>
                </div>
              </div>
              <Link
                to="/complaint"
                className="shrink-0 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-rose-500 sm:text-sm"
              >
                Report Discrepancy
              </Link>
            </div>
          </div>

          {/* Bottom Callout */}
          <div className="mt-16 rounded-3xl border border-white/10 bg-black/40 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to explore AETHER?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
              Create a free account during our public beta or get in touch with our team for questions.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/signup"
                className="rounded-xl bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-lg transition-colors hover:bg-zinc-200"
              >
                Create Free Account
              </Link>
              <Link
                to="/contact"
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Contact Support Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default FeaturesPage;
