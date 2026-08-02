import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/authprovider';
import {
  Sparkles,
  Plus,
  Compass,
  Bot,
  FileText,
  Calendar as CalendarIcon,
  ChevronRight,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);

  const displayName = user?.firstName
    ? user.firstName
    : user?.name
      ? user.name.split(' ')[0]
      : user?.email
        ? user.email.split('@')[0]
        : 'User';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen animate-pulse space-y-6 bg-[#0A0D14] p-6 text-slate-100 sm:p-8">
        <div className="h-20 rounded-2xl border border-slate-800/60 bg-[#121722]" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl border border-slate-800/60 bg-[#121722]" />
          ))}
        </div>
        <div className="h-64 rounded-2xl border border-slate-800/60 bg-[#121722]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-[#0A0D14] p-4 font-sans text-slate-100 sm:p-6 lg:p-8">
      {/* Top Welcome Header */}
      <header className="space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          THURSDAY, JULY 30
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Good afternoon, <span className="text-slate-100">{displayName}.</span>
        </h1>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Let’s make today count.
          </span>
        </h2>
      </header>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Active Goals Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#1E2638] bg-[#121722] p-4 transition-colors hover:border-slate-700 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/30 bg-purple-950/60 text-purple-400">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="mb-1 text-2xl font-bold text-white sm:text-3xl">0</div>
            <div className="text-xs font-medium text-slate-400">Active goals</div>
          </div>
        </div>

        {/* Focus Today Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#1E2638] bg-[#121722] p-4 transition-colors hover:border-slate-700 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-950/60 text-cyan-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="mb-1 text-2xl font-bold text-white sm:text-3xl">0</div>
            <div className="text-xs font-medium text-slate-400">Focus today</div>
          </div>
        </div>

        {/* Done Today Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#1E2638] bg-[#121722] p-4 transition-colors hover:border-slate-700 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-950/60 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="mb-1 text-2xl font-bold text-white sm:text-3xl">0</div>
            <div className="text-xs font-medium text-slate-400">Done today</div>
          </div>
        </div>

        {/* Week Velocity Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#1E2638] bg-[#121722] p-4 transition-colors hover:border-slate-700 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-950/60 text-indigo-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="mb-1 text-2xl font-bold text-white sm:text-3xl">0</div>
            <div className="text-xs font-medium text-slate-400">Week velocity</div>
          </div>
        </div>
      </div>

      {/* Smart Suggestions Card */}
      <div className="space-y-4 rounded-2xl border border-[#1E2638] bg-[#121722] p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span>Smart suggestions</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#1B2232] bg-[#0B0E17] p-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-purple-500/40 bg-purple-950/80 text-purple-300">
            <Compass className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs text-slate-300 sm:text-sm">
            Set your first goal — the AI will decompose it into actionable steps.
          </p>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-[#1B1E32] px-4 py-2.5 text-xs font-medium text-slate-200 shadow-sm transition-all hover:bg-[#252a45] sm:text-sm"
        >
          <Plus className="h-4 w-4 text-purple-400" />
          <span>New goal</span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-[#151928] px-4 py-2.5 text-xs font-medium text-slate-200 transition-all hover:bg-[#1f253c] sm:text-sm"
        >
          <Plus className="h-4 w-4 text-indigo-400" />
          <span>New task</span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-[#151928] px-4 py-2.5 text-xs font-medium text-slate-200 transition-all hover:bg-[#1f253c] sm:text-sm"
        >
          <Bot className="h-4 w-4 text-purple-400" />
          <span>Ask AI</span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-[#151928] px-4 py-2.5 text-xs font-medium text-slate-200 transition-all hover:bg-[#1f253c] sm:text-sm"
        >
          <FileText className="h-4 w-4 text-cyan-400" />
          <span>Capture n...</span>
        </button>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        {/* Today's Focus Box */}
        <div className="space-y-6 rounded-2xl border border-[#1E2638] bg-[#121722] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white sm:text-lg">Today's focus</h3>
              <p className="text-xs text-slate-400">Your top 3 for today.</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-purple-400 transition-colors hover:text-purple-300"
            >
              <span>Open focus</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4 py-8 text-center">
            <p className="text-sm font-semibold text-slate-300">No focus tasks yet</p>
            <p className="text-xs text-slate-400">Pick up to 3 tasks that matter most today.</p>
            <div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-md transition-all hover:from-purple-500 hover:to-indigo-500"
              >
                <span>Choose tasks</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Goals Box */}
        <div className="space-y-6 rounded-2xl border border-[#1E2638] bg-[#121722] p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white sm:text-lg">Goals</h3>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-purple-400 transition-colors hover:text-purple-300"
            >
              <span>All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4 py-8 text-center">
            <p className="text-sm font-semibold text-slate-300">No goals yet</p>
            <p className="text-xs text-slate-400">Create your first goal — AI will plan it.</p>
            <div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-[#1C2336] px-4 py-2 text-xs font-medium text-purple-300 transition-all hover:bg-[#252e46]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New goal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Today's Schedule Box */}
        <div className="space-y-6 rounded-2xl border border-[#1E2638] bg-[#121722] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white sm:text-lg">Today's schedule</h3>
              <p className="text-xs text-slate-400">0 tasks scheduled.</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-purple-400 transition-colors hover:text-purple-300"
            >
              <span>Open</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-1 py-8 text-center">
            <p className="text-sm font-semibold text-slate-300">You're clear for today</p>
            <p className="text-xs text-slate-400">
              Nothing due. Consider pulling forward tomorrow's work.
            </p>
          </div>
        </div>

        {/* Upcoming Box */}
        <div className="space-y-6 rounded-2xl border border-[#1E2638] bg-[#121722] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white sm:text-lg">Upcoming</h3>
              <p className="text-xs text-slate-400">Next tasks on your radar.</p>
            </div>
            <CalendarIcon className="h-4 w-4 text-slate-400" />
          </div>

          <div className="space-y-1 py-8 text-center">
            <p className="text-sm font-semibold text-slate-300">Nothing scheduled ahead</p>
            <p className="text-xs text-slate-400">Add due dates to see what's coming.</p>
          </div>
        </div>

        {/* Recent Notes Box */}
        <div className="space-y-6 rounded-2xl border border-[#1E2638] bg-[#121722] p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white sm:text-lg">Recent notes</h3>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-purple-400 transition-colors hover:text-purple-300"
            >
              <span>All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4 py-8 text-center">
            <p className="text-sm font-semibold text-slate-300">No notes yet</p>
            <p className="text-xs text-slate-400">Capture your first thought.</p>
            <div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-[#1C2336] px-4 py-2 text-xs font-medium text-purple-300 transition-all hover:bg-[#252e46]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New note</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
