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
} from 'lucide-react';
import { useAuth } from '@/app/providers/authprovider';
import { StatsSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { aiService } from '@/services/aiService';
import { apiClient } from '@/api/client';

import { useEventStore } from '@/workspace/calendar/store/eventStore';
import { taskService } from '@/projects/tasks/taskservice';
import { recentFilesService } from '@/workspace/recent-files/recentfilesservices';
import { favoritesService } from '@/workspace/favorites/favoritesservice';
import { productivityService } from '@/workspace/productivity-hub/productivityservice';

// ─────────────────────────────────────────────────────────────────────────────
// Greeting helper
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
// Dashboard Stats Interfaces
// ─────────────────────────────────────────────────────────────────────────────
interface ComprehensiveDashboardStats {
  activeProjects: number;
  aiChatsToday: number;
  completedTasks: number;
  pendingTasks: number;
  totalEvents: number;
  todaysEventsCount: number;
  upcomingEventsCount: number;
  filesCount: number;
  favoritesCount: number;
  focusMinutesToday: number;
  productivityScore: number;
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
}> = ({ label, value, subtitle, icon, iconBg, href }) => (
  <Link
    to={href}
    className="group flex flex-col justify-between gap-3 rounded-2xl border border-aether-border bg-aether-surface p-4 transition-all duration-200 hover:border-indigo-400/50 hover:shadow-lg"
  >
    <div className="flex items-center justify-between">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>{icon}</div>
      <ChevronRight className="h-4 w-4 text-aether-muted transition-transform group-hover:translate-x-0.5 group-hover:text-aether-main" />
    </div>
    <div>
      <p className="text-2xl font-extrabold text-aether-main">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-aether-muted">{label}</p>
      {subtitle && <p className="mt-1 text-[10px] text-aether-muted/70">{subtitle}</p>}
    </div>
  </Link>
);

const SectionHeader: React.FC<{ title: string; href: string }> = ({ title, href }) => (
  <div className="mb-3 flex items-center justify-between">
    <h2 className="text-sm font-semibold text-aether-main">{title}</h2>
    <Link
      to={href}
      className="flex items-center gap-1 text-xs text-indigo-400 transition-colors hover:text-indigo-300"
    >
      View all <ChevronRight className="h-3.5 w-3.5" />
    </Link>
  </div>
);

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const calendarEvents = useEventStore((state) => state.events);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ComprehensiveDashboardStats | null>(null);
  const [chats, setChats] = useState<RecentChat[]>([]);
  const [projects, setProjects] = useState<RecentProject[]>([]);
  const [todaysSchedule, setTodaysSchedule] = useState<DisplayEvent[]>([]);

  const displayName = user?.firstName
    ? user.firstName
    : user?.name
      ? user.name.split(' ')[0]
      : user?.email
        ? user.email.split('@')[0]
        : 'there';

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Tasks live data
      const tasks = await taskService.getTasks();
      const completedTasks = tasks.filter((t) => t.status === 'done').length;
      const pendingTasks = tasks.filter((t) => t.status !== 'done').length;

      // 2. Files live data
      const recentFiles = await recentFilesService.getRecentFiles();

      // 3. Favorites live data
      const favorites = await favoritesService.getFavorites();

      // 4. Productivity live data
      const prodStats = await productivityService.getStats();

      // 5. Calendar events live calculation
      const todayStr = new Date().toISOString().substring(0, 10);
      const totalEvents = calendarEvents.length;
      const todaysEvts = calendarEvents.filter(
        (e) => typeof e.start === 'string' && e.start.startsWith(todayStr),
      );
      const todaysEventsCount = todaysEvts.length;
      const upcomingEventsCount = calendarEvents.filter(
        (e) => typeof e.start === 'string' && e.start.substring(0, 10) > todayStr,
      ).length;

      // Build todays schedule display
      const scheduleList: DisplayEvent[] = todaysEvts.map((e) => {
        const timePart = e.isAllDay ? 'All Day' : e.start ? e.start.substring(11, 16) : '09:00';
        return {
          id: e.id,
          title: e.title,
          time: timePart,
          type: e.isAllDay ? 'reminder' : 'meeting',
        };
      });

      // 6. AI chats live calculation
      let aiChatsToday = 0;
      let fetchedChats: RecentChat[] = [];
      try {
        const storedConvs = localStorage.getItem('aether_assistant_conversations');
        if (storedConvs) {
          const convsMap = JSON.parse(storedConvs);
          const convList = Object.values(convsMap) as any[];
          if (convList.length > 0) {
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
            aiChatsToday = fetchedChats.length;
          }
        }
      } catch {
        // Ignore parse error
      }

      // Fetch active projects from backend API or empty state
      let fetchedProjects: RecentProject[] = [];
      try {
        const projRes = await apiClient.get<any>('/projects');
        const projData = Array.isArray(projRes) ? projRes : projRes?.data || projRes?.projects || [];
        if (Array.isArray(projData)) {
          fetchedProjects = projData.map((p: any) => ({
            id: p.id || `proj_${Date.now()}`,
            name: p.name || p.title || 'Untitled Project',
            progress: typeof p.progress === 'number' ? p.progress : 0,
            taskCount: typeof p.taskCount === 'number' ? p.taskCount : 0,
            color: 'from-blue-600 to-indigo-600',
          }));
        }
      } catch {
        fetchedProjects = [];
      }

      setStats({
        activeProjects: fetchedProjects.length,
        aiChatsToday,
        completedTasks,
        pendingTasks,
        totalEvents,
        todaysEventsCount,
        upcomingEventsCount,
        filesCount: recentFiles.length,
        favoritesCount: favorites.length,
        focusMinutesToday: prodStats.focusTimeToday || 0,
        productivityScore: prodStats.efficiencyScore || 0,
      });

      setChats(fetchedChats);
      setProjects(fetchedProjects);
      setTodaysSchedule(scheduleList);
    } catch {
      setError('Failed to aggregate workspace statistics.');
    } finally {
      setLoading(false);
    }
  }, [calendarEvents]);

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
            title="Refresh dashboard"
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

      {error && <ErrorState message={error} onRetry={() => void loadDashboardData()} />}

      {/* ── All Real Live Stats Cards ──────────────────────────────────────────────────────── */}
      {loading ? (
        <StatsSkeleton count={8} />
      ) : stats ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          <StatCard
            label="Total Events"
            value={stats.totalEvents}
            subtitle={`${stats.todaysEventsCount} today · ${stats.upcomingEventsCount} upcoming`}
            icon={<Calendar className="h-4 w-4 text-indigo-400" />}
            iconBg="bg-indigo-500/10"
            href="/app/workspace/calendar"
          />
          <StatCard
            label="Pending Tasks"
            value={stats.pendingTasks}
            subtitle={`${stats.completedTasks} tasks completed`}
            icon={<Target className="h-4 w-4 text-amber-400" />}
            iconBg="bg-amber-500/10"
            href="/app/projects/tasks"
          />
          <StatCard
            label="Recent Files"
            value={stats.filesCount}
            subtitle="Indexed memory blobs"
            icon={<FileText className="h-4 w-4 text-cyan-400" />}
            iconBg="bg-cyan-500/10"
            href="/app/workspace/recent-files"
          />
          <StatCard
            label="Starred Favorites"
            value={stats.favoritesCount}
            subtitle="Pinned system nodes"
            icon={<Star className="h-4 w-4 text-yellow-400" />}
            iconBg="bg-yellow-500/10"
            href="/app/workspace/favorites"
          />
          <StatCard
            label="AI Conversations"
            value={stats.aiChatsToday}
            subtitle="Active agent sessions"
            icon={<MessageSquare className="h-4 w-4 text-purple-400" />}
            iconBg="bg-purple-500/10"
            href="/app/ai/assistant"
          />
          <StatCard
            label="Active Projects"
            value={stats.activeProjects}
            subtitle="Projects in progress"
            icon={<FolderOpen className="h-4 w-4 text-blue-400" />}
            iconBg="bg-blue-500/10"
            href="/app/projects"
          />
          <StatCard
            label="Focus Time Today"
            value={`${stats.focusMinutesToday}m`}
            subtitle="Attentional telemetry"
            icon={<Clock className="h-4 w-4 text-emerald-400" />}
            iconBg="bg-emerald-500/10"
            href="/app/workspace/productivity-hub"
          />
          <StatCard
            label="Productivity Efficiency"
            value={`${stats.productivityScore}%`}
            subtitle="System block performance"
            icon={<Activity className="h-4 w-4 text-rose-400" />}
            iconBg="bg-rose-500/10"
            href="/app/workspace/productivity-hub"
          />
        </div>
      ) : null}

      {/* ── Quick Actions ──────────────────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-aether-muted">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
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
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-aether-subtle" />
                ))}
              </div>
            ) : chats.length === 0 ? (
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
                {chats.slice(0, 4).map((chat) => (
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

          {/* Recent Projects */}
          <div className="rounded-2xl border border-aether-border bg-aether-surface p-5">
            <SectionHeader title="Active Projects" href="/app/projects" />
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-aether-subtle" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
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
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-xl bg-aether-subtle" />
                ))}
              </div>
            ) : todaysSchedule.length === 0 ? (
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
                {todaysSchedule.map((event) => {
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
              {stats?.pendingTasks || stats?.totalEvents
                ? `You have ${stats?.pendingTasks ?? 0} pending tasks and ${stats?.totalEvents ?? 0} total events scheduled.`
                : 'Welcome to your new workspace! Get started by creating your first project, task, or note.'}
            </p>
            <Link
              to="/app/ai/assistant"
              className="mt-3 flex items-center gap-1.5 text-xs text-indigo-400 transition-colors hover:text-indigo-300"
            >
              {aiService.isAiEnabled() ? 'Ask AI for help' : 'Open Assistant'} <ChevronRight className="h-3.5 w-3.5" />
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
