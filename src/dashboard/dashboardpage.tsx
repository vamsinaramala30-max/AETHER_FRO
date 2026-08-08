import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers/authprovider';
import { apiClient } from '@/api/client';
import { PageWrapper } from '@/components/layout/PageWrapper';
import {
  Sparkles,
  Plus,
  Compass,
  Bot,
  FileText,
  ChevronRight,
  Zap,
  Target,
  ArrowUpRight,
} from 'lucide-react';

interface DashboardStats {
  activeProjects: number;
  aiChatsToday: number;
  tasksDue: number;
  knowledgeDocs: number;
  unreadNotifications: number;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    aiChatsToday: 0,
    tasksDue: 0,
    knowledgeDocs: 0,
    unreadNotifications: 0,
  });

  const displayName = user?.firstName
    ? user.firstName
    : user?.name
      ? user.name.split(' ')[0]
      : user?.email
        ? user.email.split('@')[0]
        : 'User';

  useEffect(() => {
    let mounted = true;
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get<any>('/dashboard');
        const data = res.data?.data || res.data || {};
        if (mounted && data.stats) {
          setStats({
            activeProjects: data.stats.activeProjects || 0,
            aiChatsToday: data.stats.aiChatsToday || 0,
            tasksDue: data.stats.tasksDue || 0,
            knowledgeDocs: data.stats.knowledgeDocs || 0,
            unreadNotifications: data.stats.unreadNotifications || 0,
          });
        }
      } catch {
        // Fallback safe state
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void fetchDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <PageWrapper wide>
        <div className="min-h-[400px] animate-pulse space-y-6 text-slate-100">
          <div className="h-24 rounded-2xl border border-aether-border bg-aether-surface" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl border border-aether-border bg-aether-surface"
              />
            ))}
          </div>
          <div className="h-64 rounded-2xl border border-aether-border bg-aether-surface" />
        </div>
      </PageWrapper>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <PageWrapper wide>
      {/* Top Welcome Header */}
      <header className="flex flex-col gap-2 border-b border-slate-800/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {getGreeting()}, <span className="text-indigo-200">{displayName}.</span>
          </h1>
          <h2 className="mt-0.5 text-lg font-bold sm:text-2xl">
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Let’s make today count.
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2 pt-2 sm:pt-0">
          <Link
            to="/app/ai/assistant"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-600/35"
          >
            <Bot className="h-4 w-4" />
            <span>AI Assistant</span>
          </Link>
        </div>
      </header>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Active Goals Card */}
        <Link
          to="/app/projects/goals"
          className="group flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md transition-all hover:border-purple-500/40 hover:bg-slate-900/90 sm:p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/60 text-purple-400 transition-transform group-hover:scale-105">
              <Compass className="h-4 w-4" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-purple-400" />
          </div>
          <div>
            <div className="mb-1 text-2xl font-black text-white sm:text-3xl">
              {stats.activeProjects}
            </div>
            <div className="text-xs font-semibold text-slate-400">Active Projects</div>
          </div>
        </Link>

        {/* Focus Today Card */}
        <Link
          to="/app/projects/tasks"
          className="group flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:bg-slate-900/90 sm:p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/60 text-cyan-400 transition-transform group-hover:scale-105">
              <Zap className="h-4 w-4" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-cyan-400" />
          </div>
          <div>
            <div className="mb-1 text-2xl font-black text-white sm:text-3xl">{stats.tasksDue}</div>
            <div className="text-xs font-semibold text-slate-400">Focus Tasks</div>
          </div>
        </Link>

        {/* AI Chats Today Card */}
        <Link
          to="/app/ai/assistant"
          className="group flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md transition-all hover:border-emerald-500/40 hover:bg-slate-900/90 sm:p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/60 text-emerald-400 transition-transform group-hover:scale-105">
              <Bot className="h-4 w-4" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-emerald-400" />
          </div>
          <div>
            <div className="mb-1 text-2xl font-black text-white sm:text-3xl">
              {stats.aiChatsToday}
            </div>
            <div className="text-xs font-semibold text-slate-400">AI Chats Today</div>
          </div>
        </Link>

        {/* Knowledge Docs Card */}
        <Link
          to="/app/knowledge/notes"
          className="group flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md transition-all hover:border-indigo-500/40 hover:bg-slate-900/90 sm:p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-950/60 text-indigo-400 transition-transform group-hover:scale-105">
              <FileText className="h-4 w-4" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-indigo-400" />
          </div>
          <div>
            <div className="mb-1 text-2xl font-black text-white sm:text-3xl">
              {stats.knowledgeDocs}
            </div>
            <div className="text-xs font-semibold text-slate-400">Knowledge Docs</div>
          </div>
        </Link>
      </div>

      {/* Smart Suggestions Card */}
      <div className="space-y-3 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/60 p-5 backdrop-blur-md sm:p-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
          <Sparkles className="h-4 w-4 animate-pulse text-purple-400" />
          <span>AI Intelligence Recommendation</span>
        </div>
        <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-indigo-900/40 bg-slate-950/60 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-purple-500/40 bg-purple-950/80 text-purple-300">
              <Target className="h-4 w-4" />
            </div>
            <p className="text-xs text-slate-200 sm:text-sm">
              Define your high-level objective — AETHER AI will auto-generate structured execution
              milestones.
            </p>
          </div>
          <Link
            to="/app/projects/goals"
            className="shrink-0 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-purple-500"
          >
            Create Goal
          </Link>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <Link
          to="/app/projects/goals"
          className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-950/20 px-3.5 py-2.5 text-xs font-medium text-purple-200 transition-all hover:bg-purple-950/40 sm:px-4"
        >
          <Plus className="h-4 w-4 text-purple-400" />
          <span>New Goal</span>
        </Link>

        <Link
          to="/app/projects/tasks"
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-950/20 px-3.5 py-2.5 text-xs font-medium text-indigo-200 transition-all hover:bg-indigo-950/40 sm:px-4"
        >
          <Plus className="h-4 w-4 text-indigo-400" />
          <span>New Task</span>
        </Link>

        <Link
          to="/app/ai/assistant"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-xs font-medium text-slate-200 transition-all hover:bg-slate-800 sm:px-4"
        >
          <Bot className="h-4 w-4 text-cyan-400" />
          <span>Ask AI Assistant</span>
        </Link>

        <Link
          to="/app/knowledge/notes"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-xs font-medium text-slate-200 transition-all hover:bg-slate-800 sm:px-4"
        >
          <FileText className="h-4 w-4 text-emerald-400" />
          <span>Capture Quick Note</span>
        </Link>
      </div>

      {/* Main Content Grid Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Focus Box */}
        <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Today's Focus</h3>
              <p className="text-xs text-slate-400">High-priority operational targets.</p>
            </div>
            <Link
              to="/app/projects/tasks"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
            >
              <span>View Tasks</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3 py-8 text-center">
            <p className="text-sm font-semibold text-slate-300">No active focus tasks queued</p>
            <p className="mx-auto max-w-sm text-xs text-slate-400">
              Select up to 3 priority items from your tasks catalog to focus on today.
            </p>
            <div>
              <Link
                to="/app/projects/tasks"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500"
              >
                <span>Choose Tasks</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Active Goals Box */}
        <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Strategic Goals</h3>
              <p className="text-xs text-slate-400">Long-term vision & milestones.</p>
            </div>
            <Link
              to="/app/projects/goals"
              className="flex items-center gap-1 text-xs font-semibold text-purple-400 transition-colors hover:text-purple-300"
            >
              <span>All Goals</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3 py-8 text-center">
            <p className="text-sm font-semibold text-slate-300">No strategic goals defined</p>
            <p className="mx-auto max-w-sm text-xs text-slate-400">
              Create your objective to automatically track progress and team milestones.
            </p>
            <div>
              <Link
                to="/app/projects/goals"
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/30 px-4 py-2 text-xs font-semibold text-purple-300 transition-all hover:bg-purple-950/50"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Goal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Today's Schedule Box */}
        <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Calendar Schedule</h3>
              <p className="text-xs text-slate-400">Scheduled events & meetings.</p>
            </div>
            <Link
              to="/app/workspace/calendar"
              className="flex items-center gap-1 text-xs font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              <span>Open Calendar</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-1 py-8 text-center">
            <p className="text-sm font-semibold text-slate-300">You're clear for today</p>
            <p className="text-xs text-slate-400">No scheduled calendar events due today.</p>
          </div>
        </div>

        {/* Recent Notes Box */}
        <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Recent Knowledge Notes</h3>
              <p className="text-xs text-slate-400">Quick thoughts & docs.</p>
            </div>
            <Link
              to="/app/knowledge/notes"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
            >
              <span>All Notes</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3 py-8 text-center">
            <p className="text-sm font-semibold text-slate-300">No notes captured yet</p>
            <p className="text-xs text-slate-400">
              Create notes to store research, ideas, and specs.
            </p>
            <div>
              <Link
                to="/app/knowledge/notes"
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-2 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-950/50"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Note</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
