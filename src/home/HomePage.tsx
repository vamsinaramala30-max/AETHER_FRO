import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import {
  MessageSquare,
  FolderOpen,
  Calendar,
  FileText,
  Zap,
  ChevronRight,
  Plus,
  Bot,
  CheckCircle2,
  Target,
  Sparkles,
  RefreshCw,
  Bell,
  Star,
  Clock,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/app/providers/authprovider';
import { StatsSkeleton } from '@/components/ui/LoadingSkeleton';
import { aiService } from '@/services/aiService';
import { apiClient } from '@/api/client';

import { useEventStore } from '@/workspace/calendar/store/eventStore';
import { taskService } from '@/projects/tasks/taskservice';
import { recentFilesService } from '@/workspace/recent-files/recentfilesservices';
import { favoritesService } from '@/workspace/favorites/favoritesservice';
import { productivityService } from '@/workspace/productivity-hub/productivityservice';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Interfaces & Types
// ─────────────────────────────────────────────────────────────────────────────
export interface SectionState<T> {
  status: 'loading' | 'success' | 'error';
  data: T | null;
  error?: string;
}

interface RecentChat {
  id: string;
  title: string;
  time: string;
  messageCount: number;
}

interface RecentProject {
  id: string;
  name: string;
  progress: number;
  taskCount: number;
  color: string;
}

interface DisplayEvent {
  id: string;
  title: string;
  time: string;
  type: 'meeting' | 'task' | 'reminder';
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const StatCard: React.FC<{
  label: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  href: string;
  isError?: boolean;
  onRetry?: () => void;
}> = ({ label, value, subtitle, icon, iconBg, href, isError, onRetry }) => (
  <Link
    to={href}
    className={`group flex flex-col justify-between gap-3 rounded-2xl border p-4 transition-all duration-200 hover:border-indigo-400/50 hover:shadow-lg ${
      isError ? 'border-amber-500/30 bg-amber-500/5' : 'border-aether-border bg-aether-surface'
    }`}
  >
    <div className="flex items-center justify-between">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>{icon}</div>
      {isError && onRetry ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRetry();
          }}
          className="rounded-lg p-1 text-amber-400 transition-colors hover:bg-amber-500/20 hover:text-amber-300"
          title="Retry loading this metric"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      ) : (
        <ChevronRight className="h-4 w-4 text-aether-muted transition-transform group-hover:translate-x-0.5 group-hover:text-aether-main" />
      )}
    </div>
    <div>
      <p
        className={`text-2xl font-extrabold ${isError ? 'text-sm font-semibold text-amber-400' : 'text-aether-main'}`}
      >
        {isError ? 'Unavailable' : value}
      </p>
      <p className="mt-0.5 text-xs font-medium text-aether-muted">{label}</p>
      {subtitle && <p className="text-aether-muted/70 mt-1 text-[10px]">{subtitle}</p>}
    </div>
  </Link>
);

const SectionHeader: React.FC<{
  title: string;
  href: string;
  isError?: boolean;
  onRetry?: () => void;
}> = ({ title, href, isError, onRetry }) => (
  <div className="mb-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <h2 className="text-sm font-semibold text-aether-main">{title}</h2>
      {isError && (
        <span className="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
          <AlertTriangle className="h-3 w-3" /> Unavailable
        </span>
      )}
    </div>
    <div className="flex items-center gap-2">
      {isError && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1 text-xs text-amber-400 transition-colors hover:text-amber-300"
        >
          <RefreshCw className="h-3 w-3" /> Retry
        </button>
      )}
      <Link
        to={href}
        className="flex items-center gap-1 text-xs text-indigo-400 transition-colors hover:text-indigo-300"
      >
        View all <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  </div>
);

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const calendarEvents = useEventStore((state) => state.events);

  const [loading, setLoading] = useState(true);

  // Independent section states
  const [tasksState, setTasksState] = useState<
    SectionState<{ completed: number; pending: number }>
  >({
    status: 'loading',
    data: null,
  });
  const [filesState, setFilesState] = useState<SectionState<number>>({
    status: 'loading',
    data: null,
  });
  const [favoritesState, setFavoritesState] = useState<SectionState<number>>({
    status: 'loading',
    data: null,
  });
  const [prodState, setProdState] = useState<
    SectionState<{ focusMinutesToday: number; productivityScore: number }>
  >({
    status: 'loading',
    data: null,
  });
  const [projectsState, setProjectsState] = useState<SectionState<RecentProject[]>>({
    status: 'loading',
    data: null,
  });
  const [chatsState, setChatsState] = useState<
    SectionState<{ count: number; chats: RecentChat[] }>
  >({
    status: 'loading',
    data: null,
  });
  const [calendarState, setCalendarState] = useState<
    SectionState<{
      totalEvents: number;
      todaysEventsCount: number;
      upcomingEventsCount: number;
      todaysSchedule: DisplayEvent[];
    }>
  >({ status: 'loading', data: null });

  const displayName = user?.firstName
    ? user.firstName
    : user?.name
      ? user.name.split(' ')[0]
      : user?.email
        ? user.email.split('@')[0]
        : 'there';

  // Individual section fetchers for retry granularity
  const fetchTasks = useCallback(async () => {
    setTasksState((prev) => ({ ...prev, status: 'loading' }));
    try {
      const tasks = await taskService.getTasks();
      const safeTasks = Array.isArray(tasks) ? tasks : [];
      const completed = safeTasks.filter((t) => t.status === 'done').length;
      const pending = safeTasks.filter((t) => t.status !== 'done').length;
      setTasksState({ status: 'success', data: { completed, pending } });
    } catch (err) {
      console.error('[HomePage] Tasks service request failed:', err);
      setTasksState({ status: 'error', data: null, error: 'Failed to load tasks' });
    }
  }, []);

  const fetchFiles = useCallback(async () => {
    setFilesState((prev) => ({ ...prev, status: 'loading' }));
    try {
      const recentFiles = await recentFilesService.getRecentFiles();
      const safeFiles = Array.isArray(recentFiles) ? recentFiles : [];
      setFilesState({ status: 'success', data: safeFiles.length });
    } catch (err) {
      console.error('[HomePage] Recent files request failed:', err);
      setFilesState({ status: 'error', data: null, error: 'Failed to load files' });
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    setFavoritesState((prev) => ({ ...prev, status: 'loading' }));
    try {
      const favs = await favoritesService.getFavorites();
      const safeFavs = Array.isArray(favs) ? favs : [];
      setFavoritesState({ status: 'success', data: safeFavs.length });
    } catch (err) {
      console.error('[HomePage] Favorites service request failed:', err);
      setFavoritesState({ status: 'error', data: null, error: 'Failed to load favorites' });
    }
  }, []);

  const fetchProductivity = useCallback(async () => {
    setProdState((prev) => ({ ...prev, status: 'loading' }));
    try {
      const prodStats = await productivityService.getStats();
      setProdState({
        status: 'success',
        data: {
          focusMinutesToday: prodStats?.focusTimeToday || 0,
          productivityScore: prodStats?.efficiencyScore || 0,
        },
      });
    } catch (err) {
      console.error('[HomePage] Productivity service request failed:', err);
      setProdState({ status: 'error', data: null, error: 'Failed to load productivity stats' });
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    setProjectsState((prev) => ({ ...prev, status: 'loading' }));
    try {
      const projRes = await apiClient.get<any>('/projects');
      const projData = Array.isArray(projRes) ? projRes : projRes?.data || projRes?.projects || [];
      const fetchedProjects: RecentProject[] = Array.isArray(projData)
        ? projData.map((p: any) => ({
            id: p.id || `proj_${Date.now()}`,
            name: p.name || p.title || 'Untitled Project',
            progress: typeof p.progress === 'number' ? p.progress : 0,
            taskCount: typeof p.taskCount === 'number' ? p.taskCount : 0,
            color: 'from-blue-600 to-indigo-600',
          }))
        : [];
      setProjectsState({ status: 'success', data: fetchedProjects });
    } catch (err) {
      console.error('[HomePage] Projects API request failed:', err);
      setProjectsState({ status: 'error', data: null, error: 'Failed to load projects' });
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);

    // Concurrently settle all remote dependencies independently
    await Promise.allSettled([
      fetchTasks(),
      fetchFiles(),
      fetchFavorites(),
      fetchProductivity(),
      fetchProjects(),
    ]);

    // Local Calendar Calculation
    try {
      const safeCalendarEvents = Array.isArray(calendarEvents) ? calendarEvents : [];
      const todayStr = new Date().toISOString().substring(0, 10);
      const totalEvents = safeCalendarEvents.length;
      const todaysEvts = safeCalendarEvents.filter(
        (e) => typeof e.start === 'string' && e.start.startsWith(todayStr),
      );
      const todaysEventsCount = todaysEvts.length;
      const upcomingEventsCount = safeCalendarEvents.filter(
        (e) => typeof e.start === 'string' && e.start.substring(0, 10) > todayStr,
      ).length;

      const scheduleList: DisplayEvent[] = todaysEvts.map((e) => {
        const timePart = e.isAllDay ? 'All Day' : e.start ? e.start.substring(11, 16) : '09:00';
        return {
          id: e.id,
          title: e.title,
          time: timePart,
          type: e.isAllDay ? 'reminder' : 'meeting',
        };
      });

      setCalendarState({
        status: 'success',
        data: {
          totalEvents,
          todaysEventsCount,
          upcomingEventsCount,
          todaysSchedule: scheduleList,
        },
      });
    } catch (err) {
      console.error('[HomePage] Calendar calculation error:', err);
      setCalendarState({ status: 'error', data: null, error: 'Failed to compute calendar events' });
    }

    // Local AI Conversations Storage
    try {
      let fetchedChats: RecentChat[] = [];
      const storedConvs = localStorage.getItem('aether_assistant_conversations');
      if (storedConvs) {
        const convsMap = JSON.parse(storedConvs);
        const convList = Object.values(convsMap) as any[];
        if (Array.isArray(convList) && convList.length > 0) {
          fetchedChats = convList.map((c) => {
            const diffMs = Date.now() - (c.updatedAt || Date.now());
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const timeStr =
              diffHours < 1
                ? 'Just now'
                : diffHours < 24
                  ? `${diffHours}h ago`
                  : `${Math.floor(diffHours / 24)}d ago`;

            return {
              id: c.id,
              title: c.title || 'Untitled Conversation',
              time: timeStr,
              messageCount: Array.isArray(c.messages) ? c.messages.length : 0,
            };
          });
        }
      }
      setChatsState({
        status: 'success',
        data: { count: fetchedChats.length, chats: fetchedChats },
      });
    } catch (err) {
      console.error('[HomePage] AI conversations calculation error:', err);
      setChatsState({ status: 'error', data: null, error: 'Failed to load conversations' });
    }

    setLoading(false);
  }, [calendarEvents, fetchTasks, fetchFiles, fetchFavorites, fetchProductivity, fetchProjects]);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  const QUICK_ACTIONS: QuickAction[] = [
    {
      label: 'New Chat',
      icon: <MessageSquare className="h-4 w-4" />,
      href: '/app/ai/assistant',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20',
    },
    {
      label: 'New Project',
      icon: <FolderOpen className="h-4 w-4" />,
      href: '/app/projects',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20',
    },
    {
      label: 'New Task',
      icon: <CheckCircle2 className="h-4 w-4" />,
      href: '/app/projects/tasks',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20',
    },
    {
      label: 'New Event',
      icon: <Calendar className="h-4 w-4" />,
      href: '/app/workspace/calendar',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20',
    },
    {
      label: 'Productivity',
      icon: <Zap className="h-4 w-4" />,
      href: '/app/workspace/productivity-hub',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20',
    },
    {
      label: 'Favorites',
      icon: <Star className="h-4 w-4" />,
      href: '/app/workspace/favorites',
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20',
    },
  ];

  const EVENT_TYPE_CONFIG = {
    meeting: {
      icon: <Calendar className="h-3.5 w-3.5" />,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    task: {
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    reminder: {
      icon: <Bell className="h-3.5 w-3.5" />,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
  };

  const hasAnySectionError =
    tasksState.status === 'error' ||
    filesState.status === 'error' ||
    favoritesState.status === 'error' ||
    prodState.status === 'error' ||
    projectsState.status === 'error';

  return (
    <PageWrapper wide>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-aether-muted">
            {formatDate()}
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-aether-main sm:text-3xl">
            {getGreeting()},{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {displayName}.
            </span>
          </h1>
          <p className="text-sm text-aether-muted">
            Real-time workspace telemetry and performance counters.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => void loadDashboardData()}
            disabled={loading}
            className="rounded-xl p-2 text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main disabled:opacity-40"
            title="Refresh dashboard telemetry"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/app/ai/assistant"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-900/30 transition-colors hover:bg-indigo-500"
          >
            <Bot className="h-3.5 w-3.5" />
            Ask AI
          </Link>
        </div>
      </div>

      {hasAnySectionError && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Some dashboard statistics could not be loaded from remote services.</span>
          </div>
          <button
            type="button"
            onClick={() => void loadDashboardData()}
            className="font-semibold underline hover:text-amber-200"
          >
            Retry Failed
          </button>
        </div>
      )}

      {/* ── Stat Cards Grid ─────────────────────────────────────────────────── */}
      {loading ? (
        <StatsSkeleton count={8} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          <StatCard
            label="Total Events"
            value={calendarState.data?.totalEvents ?? 0}
            subtitle={
              calendarState.status === 'success'
                ? `${calendarState.data?.todaysEventsCount ?? 0} today · ${calendarState.data?.upcomingEventsCount ?? 0} upcoming`
                : undefined
            }
            icon={<Calendar className="h-4 w-4 text-indigo-400" />}
            iconBg="bg-indigo-500/10"
            href="/app/workspace/calendar"
            isError={calendarState.status === 'error'}
          />
          <StatCard
            label="Pending Tasks"
            value={tasksState.data?.pending ?? 0}
            subtitle={
              tasksState.status === 'success'
                ? `${tasksState.data?.completed ?? 0} tasks completed`
                : undefined
            }
            icon={<Target className="h-4 w-4 text-amber-400" />}
            iconBg="bg-amber-500/10"
            href="/app/projects/tasks"
            isError={tasksState.status === 'error'}
            onRetry={fetchTasks}
          />
          <StatCard
            label="Recent Files"
            value={filesState.data ?? 0}
            subtitle={filesState.status === 'success' ? 'Indexed memory blobs' : undefined}
            icon={<FileText className="h-4 w-4 text-cyan-400" />}
            iconBg="bg-cyan-500/10"
            href="/app/workspace/recent-files"
            isError={filesState.status === 'error'}
            onRetry={fetchFiles}
          />
          <StatCard
            label="Starred Favorites"
            value={favoritesState.data ?? 0}
            subtitle={favoritesState.status === 'success' ? 'Pinned system nodes' : undefined}
            icon={<Star className="h-4 w-4 text-yellow-400" />}
            iconBg="bg-yellow-500/10"
            href="/app/workspace/favorites"
            isError={favoritesState.status === 'error'}
            onRetry={fetchFavorites}
          />
          <StatCard
            label="AI Conversations"
            value={chatsState.data?.count ?? 0}
            subtitle={chatsState.status === 'success' ? 'Active agent sessions' : undefined}
            icon={<MessageSquare className="h-4 w-4 text-purple-400" />}
            iconBg="bg-purple-500/10"
            href="/app/ai/assistant"
            isError={chatsState.status === 'error'}
          />
          <StatCard
            label="Active Projects"
            value={projectsState.data?.length ?? 0}
            subtitle={projectsState.status === 'success' ? 'Projects in progress' : undefined}
            icon={<FolderOpen className="h-4 w-4 text-blue-400" />}
            iconBg="bg-blue-500/10"
            href="/app/projects"
            isError={projectsState.status === 'error'}
            onRetry={fetchProjects}
          />
          <StatCard
            label="Focus Time Today"
            value={`${prodState.data?.focusMinutesToday ?? 0}m`}
            subtitle={prodState.status === 'success' ? 'Attentional telemetry' : undefined}
            icon={<Clock className="h-4 w-4 text-emerald-400" />}
            iconBg="bg-emerald-500/10"
            href="/app/workspace/productivity-hub"
            isError={prodState.status === 'error'}
            onRetry={fetchProductivity}
          />
          <StatCard
            label="Productivity Efficiency"
            value={`${prodState.data?.productivityScore ?? 0}%`}
            subtitle={prodState.status === 'success' ? 'System block performance' : undefined}
            icon={<Activity className="h-4 w-4 text-rose-400" />}
            iconBg="bg-rose-500/10"
            href="/app/workspace/productivity-hub"
            isError={prodState.status === 'error'}
            onRetry={fetchProductivity}
          />
        </div>
      )}

      {/* ── Quick Actions ──────────────────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-aether-muted">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-3.5 text-center transition-all ${action.color} hover:scale-[1.03]`}
            >
              {action.icon}
              <span className="text-[11px] font-medium leading-tight text-aether-main">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Main Grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: AI chats + Projects */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent AI Chats */}
          <div className="rounded-2xl border border-aether-border bg-aether-surface p-5">
            <SectionHeader title="Recent AI Conversations" href="/app/ai/assistant" />
            {chatsState.status === 'loading' ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-aether-subtle" />
                ))}
              </div>
            ) : !chatsState.data || chatsState.data.chats.length === 0 ? (
              <div className="py-8 text-center">
                <MessageSquare className="mx-auto mb-2 h-8 w-8 text-aether-muted" />
                <p className="text-xs text-aether-muted">No agent conversations yet</p>
                <Link
                  to="/app/ai/assistant"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  <Plus className="h-3.5 w-3.5" /> Start a conversation
                </Link>
              </div>
            ) : (
              <div className="space-y-1.5">
                {chatsState.data.chats.slice(0, 4).map((chat) => (
                  <Link
                    key={chat.id}
                    to="/app/ai/assistant"
                    className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-aether-hover"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
                      <MessageSquare className="h-3.5 w-3.5 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-aether-main">{chat.title}</p>
                      <p className="text-[10px] text-aether-muted">
                        {chat.messageCount} messages · {chat.time}
                      </p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-aether-subtleText transition-colors group-hover:text-aether-main" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Active Projects */}
          <div className="rounded-2xl border border-aether-border bg-aether-surface p-5">
            <SectionHeader
              title="Active Projects"
              href="/app/projects"
              isError={projectsState.status === 'error'}
              onRetry={fetchProjects}
            />
            {projectsState.status === 'loading' ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-aether-subtle" />
                ))}
              </div>
            ) : projectsState.status === 'error' ? (
              <div className="py-8 text-center">
                <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-amber-400" />
                <p className="text-xs text-aether-muted">
                  Unable to load projects from remote service.
                </p>
                <button
                  type="button"
                  onClick={fetchProjects}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Retry Projects
                </button>
              </div>
            ) : !projectsState.data || projectsState.data.length === 0 ? (
              <div className="py-8 text-center">
                <FolderOpen className="mx-auto mb-2 h-8 w-8 text-aether-muted" />
                <p className="text-xs text-aether-muted">No active projects found</p>
                <Link
                  to="/app/projects"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  <Plus className="h-3.5 w-3.5" /> Create a project
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {projectsState.data.map((project) => (
                  <Link
                    key={project.id}
                    to="/app/projects"
                    className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-aether-hover"
                  >
                    <div
                      className={`h-8 w-8 rounded-full bg-gradient-to-tr ${project.color} flex shrink-0 items-center justify-center`}
                    >
                      <FolderOpen className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-center justify-between">
                        <p className="truncate text-xs font-medium text-aether-main">
                          {project.name}
                        </p>
                        <span className="ml-2 shrink-0 text-[10px] text-aether-muted">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-aether-subtle">
                        <div
                          className={`h-full bg-gradient-to-r ${project.color} rounded-full transition-all`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-aether-subtleText transition-colors group-hover:text-aether-main" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Today's Schedule + AI Insights */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="rounded-2xl border border-aether-border bg-aether-surface p-5">
            <SectionHeader title="Today's Schedule" href="/app/workspace/calendar" />
            {calendarState.status === 'loading' ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-xl bg-aether-subtle" />
                ))}
              </div>
            ) : !calendarState.data || calendarState.data.todaysSchedule.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="mx-auto mb-2 h-8 w-8 text-aether-muted" />
                <p className="text-xs text-aether-muted">No events scheduled for today</p>
                <Link
                  to="/app/workspace/calendar"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  <Plus className="h-3.5 w-3.5" /> Schedule an event
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {calendarState.data.todaysSchedule.map((event) => {
                  const config = EVENT_TYPE_CONFIG[event.type];
                  return (
                    <Link
                      key={event.id}
                      to="/app/workspace/calendar"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-aether-hover"
                    >
                      <div
                        className={`h-7 w-7 rounded-lg ${config.bg} flex shrink-0 items-center justify-center ${config.color}`}
                      >
                        {config.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-aether-main">
                          {event.title}
                        </p>
                        <p className="text-[10px] text-aether-muted">{event.time}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Insight Card */}
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-semibold text-indigo-300">
                {aiService.isAiEnabled() ? 'AI Insight' : 'Workspace Summary'}
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-aether-muted">
              {tasksState.data?.pending || calendarState.data?.totalEvents
                ? `You have ${tasksState.data?.pending ?? 0} pending tasks and ${calendarState.data?.totalEvents ?? 0} total events scheduled.`
                : 'Welcome to your workspace! Get started by creating your first project, task, or note.'}
            </p>
            <Link
              to="/app/ai/assistant"
              className="mt-3 flex items-center gap-1.5 text-xs text-indigo-400 transition-colors hover:text-indigo-300"
            >
              {aiService.isAiEnabled() ? 'Ask AI for help' : 'Open Assistant'}{' '}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* System Telemetry & Status */}
          <div className="rounded-2xl border border-aether-border bg-aether-surface p-5">
            <h3 className="mb-3 text-xs font-semibold text-aether-main">System Health</h3>
            <div className="space-y-2.5">
              {[
                {
                  label: 'AI Core Engine',
                  status: aiService.isAiEnabled() ? 'Operational' : 'Active (Local)',
                  color: 'text-emerald-400',
                  dot: 'bg-emerald-400',
                },
                {
                  label: 'Calendar Engine',
                  status: 'Operational',
                  color: 'text-emerald-400',
                  dot: 'bg-emerald-400',
                },
                {
                  label: 'Telemetry Pipelines',
                  status: 'Operational',
                  color: 'text-emerald-400',
                  dot: 'bg-emerald-400',
                },
                {
                  label: 'Storage & Blobs',
                  status: 'Operational',
                  color: 'text-emerald-400',
                  dot: 'bg-emerald-400',
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-aether-muted">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${item.dot} animate-pulse`} />
                    <span className={`text-[10px] font-medium ${item.color}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HomePage;
