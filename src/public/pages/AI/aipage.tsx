import React, { useState } from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';
import { Sparkles, AlertCircle, ShieldAlert, Cpu, FileText, CheckCircle2 } from 'lucide-react';

const AI_CAPABILITIES = [
  {
    title: 'Workspace Context Retrieval',
    desc: 'Retrieves relevant excerpts from your uploaded notes, project boards, and documents to provide grounded answers.',
    limitations: 'Context quality depends on indexed document content; may omit details not present in the workspace.',
  },
  {
    title: 'Persistent Conversation History',
    desc: 'Maintains past messages across conversation turns so you can build on previous discussions without repeating context.',
    limitations: 'Large threads are periodically compacted to fit model context window constraints.',
  },
  {
    title: 'Multi-Format File Reading',
    desc: 'Inspects PDF, text, Markdown, CSV, and code files to summarize sections and locate reference answers.',
    limitations: 'Complex nested tables or scanned non-OCR PDFs may yield partial or degraded extraction.',
  },
  {
    title: 'Reasoning & Brainstorming Partner',
    desc: 'Assists with breaking down difficult architectural decisions, formulating project milestones, and structuring plans.',
    limitations: 'AI outputs are suggestions. They are not professional legal, financial, or security advice.',
  },
];

export const AIPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'memory' | 'retrieval'>('prompt');
  const [demoPrompt, setDemoPrompt] = useState(
    'Analyze workspace documents and summarize key milestone blockers.',
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulateAI = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 900);
  };

  return (
    <PublicPageLayout>
      <div className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
        {/* Floating particles background decoration */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-10 h-72 w-72 animate-pulse rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute right-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              <Cpu className="h-3.5 w-3.5 text-indigo-400" />
              Intelligence Architecture
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Context-Aware AI for{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Your Workspace.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              AETHER incorporates large language models, document retrieval, and session history to
              provide grounded assistance across your daily projects, tasks, and notes.
            </p>
          </div>

          {/* Mandatory AI Accuracy & Hallucination Disclosure */}
          <div className="mt-10 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-xl sm:p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div className="text-xs leading-relaxed text-zinc-300 sm:text-sm">
                <p className="font-semibold text-white">Important AI Accuracy & Verification Disclosure</p>
                <p className="mt-1 text-zinc-300">
                  Like all generative AI systems, AETHER assistant responses are generated algorithmically
                  and can occasionally be inaccurate, incomplete, or outdated. Never treat AI outputs as
                  infallible truth. Always independently verify critical technical configurations, code,
                  and business decisions. Private workspace data is not used to train public foundation
                  models.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive AI Visualization Showcase */}
          <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">
                  Conceptual Architecture
                </span>
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  Simulated Context Assembly Pipeline
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Interactive blueprint demonstrating how workspace prompts combine with document chunks.
                </p>
              </div>
              <div className="flex rounded-xl border border-white/10 bg-black/40 p-1">
                {(['prompt', 'memory', 'retrieval'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                      activeTab === tab
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab === 'prompt'
                      ? 'Prompt Assembly'
                      : tab === 'memory'
                        ? 'Session Memory'
                        : 'Vector Context'}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated AI Interface Box */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Controls & Input */}
              <div className="space-y-4 lg:col-span-1">
                <label
                  htmlFor="demo-prompt-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-400"
                >
                  Interactive Query Simulation
                </label>
                <textarea
                  id="demo-prompt-input"
                  rows={4}
                  value={demoPrompt}
                  onChange={(e) => setDemoPrompt(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-xs text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleSimulateAI}
                  disabled={isProcessing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-3 text-xs font-semibold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="h-3 w-3 animate-ping rounded-full bg-white" />
                      Simulating Pipeline...
                    </>
                  ) : (
                    'Run Simulation'
                  )}
                </button>
                <span className="block text-[11px] text-zinc-500">
                  * Note: Visual demonstration of internal processing topology.
                </span>
              </div>

              {/* Visualization Canvas */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/60 p-6 lg:col-span-2">
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 font-mono text-xs text-zinc-400">
                    <span>PIPELINE: {isProcessing ? 'COMPUTING' : 'READY'}</span>
                    <span className="text-zinc-400">STAGE: CONCEPTUAL PREVIEW</span>
                  </div>

                  {activeTab === 'prompt' && (
                    <div className="mt-4 space-y-3 font-mono text-xs">
                      <div className="flex items-center gap-3 text-indigo-300">
                        <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px]">
                          STEP 1
                        </span>
                        <span>[USER_INPUT] → &quot;{demoPrompt}&quot;</span>
                      </div>
                      <div className="flex items-center gap-3 text-violet-300">
                        <span className="rounded bg-violet-500/20 px-2 py-0.5 text-[10px]">
                          STEP 2
                        </span>
                        <span>[VECTOR_SEARCH] Matching against workspace notes & documents...</span>
                      </div>
                      <div className="flex items-center gap-3 text-cyan-300">
                        <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px]">
                          STEP 3
                        </span>
                        <span>[SYSTEM_PROMPT] Applying user instructions & safety guidelines...</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'memory' && (
                    <div className="mt-4 space-y-3 font-mono text-xs">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <span className="mb-1 block text-zinc-500">
                          CONVERSATION MEMORY ENTRY:
                        </span>
                        <span className="text-emerald-300">
                          &quot;Project involves TypeScript strict mode and modular microservices.&quot;
                        </span>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <span className="mb-1 block text-zinc-500">
                          USER PREFERENCE ENTRY:
                        </span>
                        <span className="text-cyan-300">
                          &quot;Prefers concise code blocks with unit tests included.&quot;
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'retrieval' && (
                    <div className="mt-4 space-y-3 font-mono text-xs text-zinc-300">
                      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5">
                        <span>architecture_spec.md (Section #3)</span>
                        <span className="font-bold text-emerald-400">Relevance Match</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5">
                        <span>weekly_plan.txt (Milestone item)</span>
                        <span className="font-bold text-indigo-400">Context Chunk</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-[10px] text-zinc-500">
                  <span>MODEL DISPATCH: Cloud LLM / Local Runtime</span>
                  <span>ISOLATION: Tenant Scoped</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Core Capabilities Grid */}
          <div className="mt-20">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Core Modules
              </span>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                What AETHER AI Can and Cannot Do
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {AI_CAPABILITIES.map((cap) => (
                <div
                  key={cap.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl transition-all hover:border-indigo-500/30"
                >
                  <h3 className="text-lg font-bold text-white">{cap.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-300">{cap.desc}</p>
                  <div className="mt-4 rounded-xl border border-white/5 bg-black/40 p-3 text-[11px] leading-relaxed text-zinc-400">
                    <span className="font-semibold text-amber-400">Limitation: </span>
                    {cap.limitations}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Inaccurate AI Response Callout */}
          <div className="mt-16 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 sm:p-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Experience an Inaccurate or Misleading AI Output?</h3>
                  <p className="mt-1 text-xs text-zinc-300 sm:text-sm">
                    If an AI assistant output produced incorrect facts, harmful statements, or failed
                    to adhere to workspace data, you can report it to our review queue.
                  </p>
                </div>
              </div>
              <Link
                to="/complaint"
                className="shrink-0 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-rose-500 sm:text-sm"
              >
                Report AI Discrepancy
              </Link>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Experience AETHER AI in Public Beta
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-300">
              Create a free account to test contextual assistance grounded in your actual workspace documents.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-lg transition-opacity hover:opacity-90"
              >
                Get Started Free
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default AIPage;
