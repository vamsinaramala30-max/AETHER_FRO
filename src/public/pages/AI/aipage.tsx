import React, { useState } from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';

const AI_CAPABILITIES = [
  {
    title: 'Context-Aware Conversation Engine',
    desc: 'Maintains trajectory across multi-turn chats, dynamically retrieving document chunks and workspace metadata to eliminate hallucinations.',
  },
  {
    title: 'Cognitive Vector Memory',
    desc: 'Indexes user preferences, architectural rules, and project jargon into persistent high-density vector representations.',
  },
  {
    title: 'Multi-Format File Intelligence',
    desc: 'Analyzes PDFs, code repositories, CSV data, and raw text to synthesize entity maps and actionable summaries.',
  },
  {
    title: 'Automated Tool Execution',
    desc: 'Executes approved actions such as triggering background jobs, updating project milestones, or formatting reports.',
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
    }, 1200);
  };

  return (
    <PublicPageLayout>
      <div className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
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
              Cognitive Engine
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Next-Gen AI Platform for{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Complex Workspaces.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              AETHER combines large language model reasoning, vector retrieval, and background
              execution tools into a secure, context-aware AI architecture.
            </p>
          </div>

          {/* Interactive AI Visualization Showcase */}
          <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-indigo-400">
                  Interactive Intelligence Blueprint
                </span>
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  AI Activity & Context Pipeline
                </h2>
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
                        ? 'Vector Memory'
                        : 'Context Retrieval'}
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
                  Sample Intent Input
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
                      Synthesizing Nodes...
                    </>
                  ) : (
                    'Run Simulation'
                  )}
                </button>
              </div>

              {/* Visualization Canvas */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/60 p-6 lg:col-span-2">
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 font-mono text-xs text-zinc-400">
                    <span>PIPELINE STATUS: {isProcessing ? 'COMPUTING' : 'IDLE'}</span>
                    <span className="text-emerald-400">LATENCY: 42ms</span>
                  </div>

                  {activeTab === 'prompt' && (
                    <div className="mt-4 space-y-3 font-mono text-xs">
                      <div className="flex items-center gap-3 text-indigo-300">
                        <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px]">
                          STEP 1
                        </span>
                        <span>[USER_INTENT] → &quot;{demoPrompt}&quot;</span>
                      </div>
                      <div className="flex items-center gap-3 text-violet-300">
                        <span className="rounded bg-violet-500/20 px-2 py-0.5 text-[10px]">
                          STEP 2
                        </span>
                        <span>
                          [SCHEMA_LOOKUP] Querying active workspace projects & document
                          embeddings...
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-cyan-300">
                        <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px]">
                          STEP 3
                        </span>
                        <span>
                          [PROMPT_INJECTION] Assembling system constraints & safety boundaries...
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'memory' && (
                    <div className="mt-4 space-y-3 font-mono text-xs">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <span className="mb-1 block text-zinc-500">
                          PERSISTED MEMORY ENTRY #84:
                        </span>
                        <span className="text-emerald-300">
                          &quot;Workspace uses TypeScript strict mode and Tailwind visual
                          styling.&quot;
                        </span>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <span className="mb-1 block text-zinc-500">
                          PERSISTED MEMORY ENTRY #85:
                        </span>
                        <span className="text-cyan-300">
                          &quot;Primary API authentication utilizes Bearer JWT header tokens.&quot;
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'retrieval' && (
                    <div className="mt-4 space-y-3 font-mono text-xs text-zinc-300">
                      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5">
                        <span>doc_architecture_spec.pdf (Chunk #12)</span>
                        <span className="font-bold text-emerald-400">Match: 94.2%</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2.5">
                        <span>project_milestones_q3.md (Chunk #4)</span>
                        <span className="font-bold text-indigo-400">Match: 89.7%</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-[10px] text-zinc-500">
                  <span>MODEL ROUTER: Auto-selected high-performance reasoning model</span>
                  <span>SECURITY GUARD: Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Core Capabilities Grid */}
          <div className="mt-20">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Deep Dive
              </span>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                Responsible & Privacy-First AI
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {AI_CAPABILITIES.map((cap) => (
                <div
                  key={cap.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl transition-all hover:border-indigo-500/30"
                >
                  <h3 className="text-lg font-bold text-white">{cap.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-400">{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-20 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Build with AETHER AI today
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-300">
              Experience zero-friction AI assistant workflows backed by your workspace context.
            </p>
            <div className="mt-6">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-opacity hover:opacity-90"
              >
                Launch AI Platform →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default AIPage;
