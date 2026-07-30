import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/providers/authprovider";
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
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);

  const displayName =
    user?.firstName
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
      <div className="min-h-screen bg-[#0A0D14] text-slate-100 p-6 sm:p-8 animate-pulse space-y-6">
        <div className="h-20 bg-[#121722] rounded-2xl border border-slate-800/60" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-[#121722] rounded-xl border border-slate-800/60" />
          ))}
        </div>
        <div className="h-64 bg-[#121722] rounded-2xl border border-slate-800/60" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* Top Welcome Header */}
      <header className="space-y-1">
        <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
          THURSDAY, JULY 30
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Good afternoon, <span className="text-slate-100">{displayName}.</span>
        </h1>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Let’s make today count.
          </span>
        </h2>
      </header>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Goals Card */}
        <div className="bg-[#121722] border border-[#1E2638] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">0</div>
            <div className="text-xs text-slate-400 font-medium">Active goals</div>
          </div>
        </div>

        {/* Focus Today Card */}
        <div className="bg-[#121722] border border-[#1E2638] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">0</div>
            <div className="text-xs text-slate-400 font-medium">Focus today</div>
          </div>
        </div>

        {/* Done Today Card */}
        <div className="bg-[#121722] border border-[#1E2638] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">0</div>
            <div className="text-xs text-slate-400 font-medium">Done today</div>
          </div>
        </div>

        {/* Week Velocity Card */}
        <div className="bg-[#121722] border border-[#1E2638] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">0</div>
            <div className="text-xs text-slate-400 font-medium">Week velocity</div>
          </div>
        </div>
      </div>

      {/* Smart Suggestions Card */}
      <div className="bg-[#121722] border border-[#1E2638] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Smart suggestions</span>
        </div>
        <div className="bg-[#0B0E17] border border-[#1B2232] rounded-xl p-4 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Set your first goal — the AI will decompose it into actionable steps.
          </p>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B1E32] hover:bg-[#252a45] text-slate-200 border border-purple-500/30 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 text-purple-400" />
          <span>New goal</span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#151928] hover:bg-[#1f253c] text-slate-200 border border-slate-700/60 rounded-xl text-xs sm:text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4 text-indigo-400" />
          <span>New task</span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#151928] hover:bg-[#1f253c] text-slate-200 border border-slate-700/60 rounded-xl text-xs sm:text-sm font-medium transition-all"
        >
          <Bot className="w-4 h-4 text-purple-400" />
          <span>Ask AI</span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#151928] hover:bg-[#1f253c] text-slate-200 border border-slate-700/60 rounded-xl text-xs sm:text-sm font-medium transition-all"
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Capture n...</span>
        </button>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        {/* Today's Focus Box */}
        <div className="bg-[#121722] border border-[#1E2638] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Today's focus</h3>
              <p className="text-xs text-slate-400">Your top 3 for today.</p>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>Open focus</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-8 text-center space-y-4">
            <p className="text-sm font-semibold text-slate-300">No focus tasks yet</p>
            <p className="text-xs text-slate-400">Pick up to 3 tasks that matter most today.</p>
            <div>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-medium transition-all shadow-md"
              >
                <span>Choose tasks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Goals Box */}
        <div className="bg-[#121722] border border-[#1E2638] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white">Goals</h3>
            <button
              type="button"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-8 text-center space-y-4">
            <p className="text-sm font-semibold text-slate-300">No goals yet</p>
            <p className="text-xs text-slate-400">Create your first goal — AI will plan it.</p>
            <div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1C2336] hover:bg-[#252e46] text-purple-300 border border-purple-500/30 rounded-xl text-xs font-medium transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New goal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Today's Schedule Box */}
        <div className="bg-[#121722] border border-[#1E2638] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Today's schedule</h3>
              <p className="text-xs text-slate-400">0 tasks scheduled.</p>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>Open</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-8 text-center space-y-1">
            <p className="text-sm font-semibold text-slate-300">You're clear for today</p>
            <p className="text-xs text-slate-400">Nothing due. Consider pulling forward tomorrow's work.</p>
          </div>
        </div>

        {/* Upcoming Box */}
        <div className="bg-[#121722] border border-[#1E2638] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Upcoming</h3>
              <p className="text-xs text-slate-400">Next tasks on your radar.</p>
            </div>
            <CalendarIcon className="w-4 h-4 text-slate-400" />
          </div>

          <div className="py-8 text-center space-y-1">
            <p className="text-sm font-semibold text-slate-300">Nothing scheduled ahead</p>
            <p className="text-xs text-slate-400">Add due dates to see what's coming.</p>
          </div>
        </div>

        {/* Recent Notes Box */}
        <div className="bg-[#121722] border border-[#1E2638] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white">Recent notes</h3>
            <button
              type="button"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-8 text-center space-y-4">
            <p className="text-sm font-semibold text-slate-300">No notes yet</p>
            <p className="text-xs text-slate-400">Capture your first thought.</p>
            <div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1C2336] hover:bg-[#252e46] text-purple-300 border border-purple-500/30 rounded-xl text-xs font-medium transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
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