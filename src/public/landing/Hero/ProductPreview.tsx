import React, { useState } from 'react';
import {
  Bot,
  Brain,
  CheckSquare,
  Network,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Send,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export const ProductPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ai' | 'tasks' | 'memory' | 'graph' | 'analytics'>(
    'ai',
  );
  const [chatMessage, setChatMessage] = useState('');
  const [chatLogs, setChatLogs] = useState([
    {
      sender: 'user',
      text: 'Analyze memory nodes and summarize key priorities for Q3 architectural roadmap.',
      time: '10:42 AM',
    },
    {
      sender: 'ai',
      text: 'Found 14 relevant cognitive memory nodes. Key priority: Implement zero-copy local context vector indexing and finalize multi-agent task dispatching.',
      time: '10:42 AM',
      tags: ['Context Sync', 'Vector Memory', 'Local Model'],
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatLogs((prev) => [
      ...prev,
      { sender: 'user', text: chatMessage, time: 'Just now' },
      {
        sender: 'ai',
        text: `Synthesizing task context for "${chatMessage}"... Context synchronized with local memory engine.`,
        time: 'Just now',
        tags: ['Realtime AI'],
      },
    ]);
    setChatMessage('');
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
      {/* Glow Ambient Layer behind Preview */}
      <div className="pointer-events-none absolute -inset-1 animate-pulse rounded-2xl bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-purple-500/20 opacity-70 blur-xl" />

      {/* Floating Card 1: Top Right Metrics */}
      <div className="absolute -right-4 -top-5 z-20 hidden items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-xs text-zinc-200 shadow-xl backdrop-blur-md sm:flex">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-1.5 text-emerald-400">
          <Zap className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-semibold text-zinc-100">
            Local Engine Active
            <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
          </div>
          <p className="text-[11px] text-zinc-400">12ms Latency • Zero Cloud Leak</p>
        </div>
      </div>

      {/* Floating Card 2: Bottom Left Memory Status */}
      <div className="absolute -bottom-5 -left-4 z-20 hidden items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-xs text-zinc-200 shadow-xl backdrop-blur-md sm:flex">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-1.5 text-indigo-400">
          <Brain className="h-4 w-4" />
        </div>
        <div>
          <div className="font-semibold text-zinc-100">Cognitive Memory Sync</div>
          <p className="text-[11px] text-zinc-400">1,284 Nodes • 99.4% Recall</p>
        </div>
      </div>

      {/* Main Glass Container */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/90 shadow-2xl backdrop-blur-sm">
        {/* Window Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-900/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="mr-2 flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-full border border-rose-600/40 bg-rose-500/80" />
              <span className="inline-block h-3 w-3 rounded-full border border-amber-600/40 bg-amber-500/80" />
              <span className="inline-block h-3 w-3 rounded-full border border-emerald-600/40 bg-emerald-500/80" />
            </div>
            <span className="flex items-center gap-1.5 font-mono text-xs font-medium text-zinc-400">
              <Cpu className="h-3.5 w-3.5 text-indigo-400" />
              aether://workspace/v2.4
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-300">
              <ShieldCheck className="h-3 w-3" /> Enterprise Tier
            </span>
          </div>
        </div>

        {/* Tab Navigation Toolbar */}
        <div className="no-scrollbar flex items-center justify-start gap-1 overflow-x-auto border-b border-zinc-800/60 bg-zinc-950/60 px-3 py-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              activeTab === 'ai'
                ? 'border border-indigo-500/30 bg-indigo-600/20 text-indigo-300'
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            AI Assistant
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              activeTab === 'tasks'
                ? 'border border-indigo-500/30 bg-indigo-600/20 text-indigo-300'
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            Tasks & Board
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              activeTab === 'memory'
                ? 'border border-indigo-500/30 bg-indigo-600/20 text-indigo-300'
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
            }`}
          >
            <Brain className="h-3.5 w-3.5" />
            Memory Node
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              activeTab === 'graph'
                ? 'border border-indigo-500/30 bg-indigo-600/20 text-indigo-300'
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            Knowledge Graph
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              activeTab === 'analytics'
                ? 'border border-indigo-500/30 bg-indigo-600/20 text-indigo-300'
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Analytics
          </button>
        </div>

        {/* Dynamic Tab Body */}
        <div className="max-h-[360px] min-h-[300px] overflow-y-auto p-4 font-sans text-sm sm:p-5">
          {activeTab === 'ai' && (
            <div className="flex h-full flex-col justify-between space-y-4">
              <div className="space-y-3.5">
                {chatLogs.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-600/20 text-indigo-400">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'rounded-br-none bg-indigo-600 text-white'
                          : 'rounded-bl-none border border-zinc-800 bg-zinc-900/90 text-zinc-200 shadow-md'
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.tags && (
                        <div className="mt-2 flex flex-wrap gap-1.5 border-t border-zinc-800/80 pt-2">
                          {msg.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="mt-1 block text-right text-[9px] text-zinc-400">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSendMessage} className="relative mt-3">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask AETHER AI or request context search..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 pr-10 text-xs text-zinc-100 placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-indigo-400 transition-colors hover:bg-indigo-500/10 hover:text-indigo-300"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2 text-xs text-zinc-400">
                <span className="font-semibold text-zinc-200">Active Sprint Tasks</span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> 4 of 6 completed
                </span>
              </div>
              <div className="space-y-2">
                {[
                  {
                    title: 'Refactor Vector Database Indexer',
                    tag: 'Core Infra',
                    status: 'Done',
                    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                  },
                  {
                    title: 'Implement Local LLM Context Window Caching',
                    tag: 'AI Engine',
                    status: 'In Progress',
                    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                  },
                  {
                    title: 'Sync Knowledge Graph Node Relations',
                    tag: 'Memory',
                    status: 'Pending',
                    badge: 'bg-zinc-800 text-zinc-400 border-zinc-700',
                  },
                ].map((task, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-900/60 p-2.5 text-xs transition-colors hover:border-zinc-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={task.status === 'Done'}
                        readOnly
                        className="rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-0"
                      />
                      <span
                        className={`font-medium ${
                          task.status === 'Done' ? 'text-zinc-400 line-through' : 'text-zinc-200'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                        {task.tag}
                      </span>
                      <span className={`rounded border px-2 py-0.5 text-[10px] ${task.badge}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'memory' && (
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 rounded-xl border border-indigo-800/40 bg-indigo-950/30 p-3 text-xs text-indigo-200">
                <Brain className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                <div>
                  <div className="font-medium text-indigo-100">Cognitive Memory Engine</div>
                  <p className="mt-0.5 text-[11px] text-indigo-300/80">
                    Aether automatically extracts semantic relationships, developer decisions, and
                    durable facts locally.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
                  <div className="text-[11px] text-zinc-400">Indexed Entities</div>
                  <div className="mt-1 text-lg font-semibold text-zinc-100">14,290</div>
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] text-emerald-400">
                    <ArrowUpRight className="h-3 w-3" /> +142 today
                  </div>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
                  <div className="text-[11px] text-zinc-400">Context Precision</div>
                  <div className="mt-1 text-lg font-semibold text-zinc-100">99.8%</div>
                  <div className="mt-0.5 text-[10px] text-indigo-400">
                    Zero hallucination filter
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'graph' && (
            <div className="flex flex-col items-center justify-center space-y-3 rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-indigo-500/40" />
                <Network className="h-9 w-9 text-indigo-400" />
                <span className="absolute right-2 top-1 h-2.5 w-2.5 animate-ping rounded-full bg-cyan-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-200">
                  Interactive Knowledge Topology
                </div>
                <p className="mt-1 max-w-xs text-[11px] text-zinc-400">
                  Bi-directional node linking connects projects, tasks, code bases, and notes into
                  an active neural graph.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-2.5 text-center">
                  <div className="text-[10px] text-zinc-400">Tokens Processed</div>
                  <div className="mt-1 text-sm font-bold text-zinc-100">2.4M</div>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-2.5 text-center">
                  <div className="text-[10px] text-zinc-400">Time Saved</div>
                  <div className="mt-1 text-sm font-bold text-emerald-400">18.4 hrs</div>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-2.5 text-center">
                  <div className="text-[10px] text-zinc-400">Local Security</div>
                  <div className="mt-1 text-sm font-bold text-cyan-400">100%</div>
                </div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-300">
                  <span>Weekly Productivity Velocity</span>
                  <span className="text-[11px] text-emerald-400">+24% vs last week</span>
                </div>
                <div className="flex h-16 items-end gap-1.5 pt-2">
                  {[35, 50, 42, 68, 80, 95, 88].map((val, i) => (
                    <div
                      key={i}
                      className="group relative flex-1 rounded-t bg-zinc-800 transition-all hover:bg-indigo-600"
                      style={{ height: `${val}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded border border-zinc-700 bg-zinc-950 px-1.5 py-0.5 text-[9px] text-zinc-200 opacity-0 group-hover:opacity-100">
                        {val}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Status Bar */}
        <div className="flex items-center justify-between border-t border-zinc-800/60 bg-zinc-950/80 px-4 py-2 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Local Vector Engine: Connected
          </span>
          <span className="font-mono text-zinc-400">SOC2 Type II • AES-256</span>
        </div>
      </div>
    </div>
  );
};
