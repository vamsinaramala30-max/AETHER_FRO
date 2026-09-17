import React from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';

const PRINCIPLES = [
  {
    title: 'AI-First Intelligence Layer',
    badge: 'Core Architecture',
    description:
      'Artificial intelligence isn’t an afterthought tacked onto legacy software; it is the fundamental cognitive kernel driving context extraction, automation, and decision synthesis.',
  },
  {
    title: 'Strict Privacy Boundaries',
    badge: 'Security & Ethics',
    description:
      'Your organization’s proprietary knowledge belongs exclusively to you. We design pipelines with strict field-level isolation and zero public model training.',
  },
  {
    title: 'Uncompromising Productivity',
    badge: 'User Experience',
    description:
      'Software should eliminate friction, reduce context-switching overhead, and turn multi-step manual workflows into streamlined, automated routines.',
  },
  {
    title: 'Enterprise Security by Design',
    badge: 'Infrastructure',
    description:
      'From TLS in-transit encryption to structured token authentication and strict RBAC controls, security is embedded into every execution path.',
  },
];

export const AboutPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <div className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
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
              AETHER connects artificial intelligence, project orchestration, knowledge graphs, and
              workflow automation into a unified digital environment.
            </p>
          </div>

          {/* Section: What AETHER Is & Why It Exists */}
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 shadow-xl backdrop-blur-xl sm:p-10">
              <h2 className="text-2xl font-bold text-white">What AETHER Is</h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
                AETHER is an autonomous AI orchestration and productivity platform designed to
                bridge the gap between fragmented software tools and intelligent execution. It
                synthesizes tasks, document repositories, memory stores, and event triggers into one
                reactive system.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
                Rather than treating AI as a isolated chat window, AETHER integrates LLM
                intelligence across your entire workspace context—enabling real-time document
                analysis, multi-agent automated tasks, and semantic knowledge retrieval.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 shadow-xl backdrop-blur-xl sm:p-10">
              <h2 className="text-2xl font-bold text-white">Why AETHER Exists</h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
                Modern software teams suffer from extreme context fragmentations—jumping between
                task trackers, documentation wikis, messaging apps, and external AI tools. Important
                knowledge is buried in silos, and high-value team members spend hours on manual
                status updates.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
                AETHER was created to solve this friction: giving individuals and enterprises a
                single cognitive operating system where context is continuous, intelligence is
                inherent, and operational tasks execute autonomously.
              </p>
            </div>
          </div>

          {/* Vision & Mission Banner */}
          <div className="mt-12 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-black/40 p-8 shadow-2xl sm:p-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">
                  Our Mission
                </span>
                <h3 className="mt-2 text-2xl font-bold text-white">
                  Empower Organizations with Autonomous Intelligence
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  To eliminate repetitive manual friction and enable individuals and enterprise
                  teams to achieve unprecedented leverage through intelligent automation and unified
                  workspace context.
                </p>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                  Our Vision
                </span>
                <h3 className="mt-2 text-2xl font-bold text-white">
                  A Continuous Digital Environment
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  A future where digital workspaces reason dynamically, anticipate user needs,
                  maintain pristine security boundaries, and serve as an active partner in technical
                  execution.
                </p>
              </div>
            </div>
          </div>

          {/* Core Principles Grid */}
          <div className="mt-20">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Architectural DNA
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

          {/* Future Vision Section */}
          <div className="mt-20 rounded-3xl border border-white/10 bg-black/40 p-8 text-center sm:p-12">
            <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">
              Looking Forward
            </span>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Building the Future of Knowledge Work
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              As artificial intelligence continues to evolve, AETHER is constantly advancing its
              vector indexing, tool execution, and local-first edge processing capabilities to
              ensure your workspace remains fast, private, and state-of-the-art.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/contact"
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:opacity-90"
              >
                Connect with AETHER Team →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default AboutPage;
