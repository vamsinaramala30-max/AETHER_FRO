import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  Brain,
  Sparkles,
  Send,
  Clock,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export const ProductPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'planner' | 'tasks' | 'cognitive'>('planner');
  const [chatMessage, setChatMessage] = useState('');
  const [chatLogs, setChatLogs] = useState([
    {
      sender: 'user',
      text: 'What are my top priorities for today and what should I practice in the cognitive hub?',
      time: '9:30 AM',
    },
    {
      sender: 'ai',
      text: 'You have 3 focus tasks scheduled in your planner today. In the cognitive hub, a practice problem has been created around resolving client sync bottlenecks.',
      time: '9:30 AM',
      tags: ['Daily Planner', 'Smart Reminders', 'Cognitive Hub'],
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
        text: `Updated your planner for "${chatMessage}". Reminders configured for your next focus session.`,
        time: 'Just now',
        tags: ['Planner Update'],
      },
    ]);
    setChatMessage('');
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden lg:max-w-none">
      {/* Glow Ambient Layer behind Preview */}
      <div className="pointer-events-none absolute -inset-1 animate-pulse rounded-2xl bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-purple-500/20 opacity-70 blur-xl" />

      {/* Floating Card 1: Top Right Planner Notice (Desktop / Tablet) */}
      <div className="absolute -right-2 -top-4 z-20 hidden items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-xs text-zinc-200 shadow-xl backdrop-blur-md sm:flex">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-1.5 text-indigo-400">
          <Clock className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-semibold text-zinc-100">
            Daily Planner Ready
            <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
          </div>
          <p className="text-[11px] text-zinc-400">Adaptive schedule & reminders</p>
        </div>
      </div>

      {/* Floating Card 2: Bottom Left Cognitive Status (Desktop / Tablet) */}
      <div className="absolute -bottom-4 -left-2 z-20 hidden items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-xs text-zinc-200 shadow-xl backdrop-blur-md sm:flex">
        <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-1.5 text-purple-400">
          <Brain className="h-4 w-4" />
        </div>
        <div>
          <div className="font-semibold text-zinc-100">Cognitive Hub</div>
          <p className="text-[11px] text-zinc-400">Real-task problem exercises</p>
        </div>
      </div>

      {/* Main Glass Container */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/85 shadow-2xl backdrop-blur-xl">
        {/* Window Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 bg-zinc-900/40 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="mr-1 flex shrink-0 items-center gap-1.5 sm:mr-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full border border-rose-600/40 bg-rose-500/80 sm:h-3 sm:w-3" />
              <span className="inline-block h-2.5 w-2.5 rounded-full border border-amber-600/40 bg-amber-500/80 sm:h-3 sm:w-3" />
              <span className="inline-block h-2.5 w-2.5 rounded-full border border-emerald-600/40 bg-emerald-500/80 sm:h-3 sm:w-3" />
            </div>
            <span className="flex items-center gap-1.5 truncate font-mono text-[11px] font-medium text-zinc-400 sm:text-xs">
              <Cpu className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
              <span className="truncate">aether://workspace</span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300 sm:text-[11px]">
              <Sparkles className="h-3 w-3 shrink-0" />
              Personal Workspace
            </span>
          </div>
        </div>

        {/* Tab Navigation Toolbar */}
        <div className="scrollbar-none flex items-center justify-start gap-1 overflow-x-auto border-b border-zinc-800/60 bg-zinc-950/60 px-2 py-2 text-xs sm:px-3">
          <button
            type="button"
            onClick={() => setActiveTab('planner')}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'planner'
                ? 'border border-indigo-500/30 bg-indigo-600/20 text-indigo-300'
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Smart Planner
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'tasks'
                ? 'border border-indigo-500/30 bg-indigo-600/20 text-indigo-300'
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            Tasks & Projects
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cognitive')}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'cognitive'
                ? 'border border-indigo-500/30 bg-indigo-600/20 text-indigo-300'
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
            }`}
          >
            <Brain className="h-3.5 w-3.5" />
            Cognitive Hub
          </button>
        </div>

        {/* Dynamic Tab Body */}
        <div className="max-h-[360px] min-h-[300px] overflow-y-auto p-3.5 font-sans text-sm sm:p-5">
          {activeTab === 'planner' && (
            <div className="flex h-full flex-col justify-between space-y-4">
              <div className="space-y-3.5">
                {chatLogs.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${
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
                  placeholder="Plan your next task or set a reminder..."
                  aria-label="Ask AETHER planner or set a reminder"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 pr-10 text-xs text-zinc-100 placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
                <button
                  type="submit"
                  aria-label="Send planner request"
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
                <span className="font-semibold text-zinc-200">Today's Focus Tasks</span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> 2 of 4 done
                </span>
              </div>
              <div className="space-y-2">
                {[
                  {
                    title: 'Finalize quarterly project milestones',
                    tag: 'Project Planning',
                    status: 'Done',
                    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                  },
                  {
                    title: 'Review weekly calendar and set smart reminders',
                    tag: 'Planner',
                    status: 'Done',
                    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                  },
                  {
                    title: 'Prepare task breakdown for feature roadmap',
                    tag: 'Workspace',
                    status: 'In Progress',
                    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                  },
                  {
                    title: 'Complete cognitive hub problem-solving session',
                    tag: 'Practice',
                    status: 'Scheduled',
                    badge: 'bg-zinc-800 text-zinc-400 border-zinc-700',
                  },
                ].map((task, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 rounded-lg border border-zinc-800/60 bg-zinc-900/60 p-2.5 text-xs transition-colors hover:border-zinc-700 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={task.status === 'Done'}
                        readOnly
                        aria-label={task.title}
                        className="shrink-0 rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-0"
                      />
                      <span
                        className={`truncate font-medium ${
                          task.status === 'Done' ? 'text-zinc-400 line-through' : 'text-zinc-200'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
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

          {activeTab === 'cognitive' && (
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 rounded-xl border border-purple-800/40 bg-purple-950/30 p-3 text-xs text-purple-200">
                <Brain className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                <div>
                  <div className="font-medium text-purple-100">Task-Based Problem Solving</div>
                  <p className="mt-0.5 text-[11px] text-purple-300/80">
                    AETHER turns real obstacles from your projects into structured scenarios to
                    practice decision-making and build clear reasoning habits.
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
                  <div className="font-semibold text-zinc-100">Scenario Practice: Priority Conflict</div>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    Two critical project deliverables overlap on Thursday. Evaluate trade-offs and
                    restructure timeline dependencies to maintain focus.
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-500/20">
                      Active Challenge
                    </span>
                    <span className="text-[10px] text-zinc-500">Derived from: Feature Roadmap</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-zinc-800/60 bg-zinc-950/80 px-3.5 py-2 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5 truncate">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            AI Workspace Sync: Active
          </span>
          <span className="text-zinc-500">Personal & Private</span>
        </div>
      </div>
    </div>
  );
};
