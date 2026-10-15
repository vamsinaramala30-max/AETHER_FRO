import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Sparkles, Shield, Brain, Layers } from 'lucide-react';

const PRINCIPLES = [
  {
    title: 'Context-Aware Intelligence Layer',
    badge: 'Core Architecture',
    description:
      'Artificial intelligence is integrated with your actual workspace context—synthesizing notes, task milestones, and document excerpts to assist your daily workflow.',
  },
  {
    title: 'Strict Privacy Boundaries',
    badge: 'Security & Ethics',
    description:
      'Your workspace data and private documents belong exclusively to you. System architecture enforces database tenant scoping with zero public model training.',
  },
  {
    title: 'Frictionless Daily Execution',
    badge: 'User Experience',
    description:
      'Software should reduce context switching. AETHER consolidates daily planning, task lists, document notes, and reasoning exercises into one responsive hub.',
  },
  {
    title: 'Transparent Technical Security',
    badge: 'Infrastructure',
    description:
      'From TLS 1.3 in-transit encryption and salted password hashing to scoped session tokens and input sanitization, security is engineered directly into our open architecture.',
  },
];

const CURRENT_CAPABILITIES = [
  {
    title: 'Smart Daily Planner & Adaptive Schedule',
    desc: 'Plan daily agendas, organize time blocks, and set priority focus tasks.',
  },
  {
    title: 'Cognitive Hub & Reasoning Practice',
    desc: 'Interactive exercises designed to sharpen structured problem-solving and critical thinking habits.',
  },
  {
    title: 'Projects, Tasks & Milestones',
    desc: 'Organize project deliverables, track progress statuses, and manage personal workflow goals.',
  },
  {
    title: 'Unified Knowledge Base & Document Viewer',
    desc: 'Upload and inspect Markdown, PDF, text, and code files with semantic vector search indexing.',
  },
  {
    title: 'Contextual AI Assistant',
    desc: 'Multi-turn conversation assistant that retrieves relevant workspace excerpts to answer questions.',
  },
  {
    title: 'Focus Timer & Web Directory Tools',
    desc: 'Built-in quick tools including Pomodoro focus timers and customizable web resource bookmarks.',
  },
];

const ROADMAP_GOALS = [
  {
    title: 'Real-Time Multi-Cursor Collaboration',
    desc: 'Simultaneous pair-editing and shared workspace boards for distributed engineering teams.',
    stage: 'In Development',
  },
  {
    title: 'Enterprise SIEM Audit Log Streaming',
    desc: 'Automated streaming of workspace security events to external SIEM platforms (e.g., Datadog, Splunk).',
    stage: 'Planned Architecture',
  },
  {
    title: 'Dedicated Desktop & Mobile Clients',
    desc: 'Native desktop and mobile applications complementing the existing responsive web app.',
    stage: 'Planned Roadmap',
  },
  {
    title: 'Custom AI Agent Persona Builder',
    desc: 'Configurable agent personas with specialized prompt guidelines and restricted tool scopes.',
    stage: 'In Research',
  },
];

export const AboutPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <div className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
        {/* Ambient background blur */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[30rem] w-[45rem] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute right-10 top-1/2 h-[20rem] w-[20rem] rounded-full bg-violet-600/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              The AETHER Platform
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Engineered for the{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Cognitive Workspace.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg lg:text-xl">
              AETHER connects daily planning, structured task tracking, knowledge documents, and
              cognitive problem-solving into a cohesive personal workspace.
            </p>
          </div>

          {/* Section: What AETHER Is & Why It Exists */}
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 shadow-xl backdrop-blur-xl sm:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                  <Layers className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">What AETHER Is</h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                AETHER is an integrated personal and team productivity platform designed to bridge the
                gap between task management, knowledge retention, and intelligent assistance.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
                Rather than forcing you to juggle disconnected calendars, to-do lists, note apps, and
                generic chat windows, AETHER connects your daily agenda with real-task problem-solving
                drills and contextual workspace assistance.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 shadow-xl backdrop-blur-xl sm:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
                  <Brain className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">Why AETHER Exists</h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                Modern knowledge workers often experience high friction jumping between scattered apps.
                Important notes get lost, priorities slip, and generic AI tools lack any context about
                your actual work.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
                AETHER was built to solve this friction: delivering a focused digital environment where
                your tasks, daily plan, documents, and thinking habits reinforce each other every day.
              </p>
            </div>
          </div>

          {/* Core Principles Grid */}
          <div className="mt-20">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Architectural Integrity
              </span>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                Core Engineering Principles
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PRINCIPLES.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-indigo-500/30 hover:bg-white/[0.04]"
                >
                  <div>
                    <span className="inline-block rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 font-mono text-[10px] text-indigo-400">
                      {item.badge}
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-xs leading-relaxed text-zinc-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distinction: Current Capabilities vs Future Development Roadmap */}
          <div className="mt-20">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Transparent Product Breakdown
              </span>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                Current Capabilities vs. Development Roadmap
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400">
                We believe in full transparency: here is an honest distinction between features working
                in the application today and upcoming roadmap milestones.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Active Capabilities */}
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 backdrop-blur-xl sm:p-8">
                <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">Fully Functional Today</h3>
                  <span className="ml-auto rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                    Active & Available
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {CURRENT_CAPABILITIES.map((cap) => (
                    <div key={cap.title} className="rounded-xl border border-white/5 bg-black/30 p-4">
                      <h4 className="text-sm font-semibold text-emerald-300">{cap.title}</h4>
                      <p className="mt-1 text-xs text-zinc-400">{cap.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Future Roadmap */}
              <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-xl sm:p-8">
                <div className="flex items-center gap-2 border-b border-amber-500/20 pb-4">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <h3 className="text-xl font-bold text-white">Upcoming Roadmap Goals</h3>
                  <span className="ml-auto rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                    In Progress
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {ROADMAP_GOALS.map((goal) => (
                    <div key={goal.title} className="rounded-xl border border-white/5 bg-black/30 p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-amber-300">{goal.title}</h4>
                        <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                          {goal.stage}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400">{goal.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Accuracy & Verification Disclosure */}
          <div className="mt-16 rounded-3xl border border-indigo-500/20 bg-indigo-950/20 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white">
                  AI Accuracy Notice & Independence Disclaimer
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-zinc-300 sm:text-sm">
                  AETHER incorporates artificial intelligence models to assist with drafting, search, and
                  synthesis. Generative AI outputs are probabilistic and may occasionally contain
                  inaccurate, incomplete, or outdated information. Users should independently verify
                  important facts, code, and operational plans before relying on them.
                </p>
              </div>
            </div>
          </div>

          {/* Connect & Resolution Callout */}
          <div className="mt-16 rounded-3xl border border-white/10 bg-black/40 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Questions, Feedback, or Concerns?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
              Connect directly with our engineering and support team or report any inaccuracies
              through our formal resolution channel.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90"
              >
                Contact Support Team
              </Link>
              <Link
                to="/complaint"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/10"
              >
                Report a Discrepancy or Complaint
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default AboutPage;
