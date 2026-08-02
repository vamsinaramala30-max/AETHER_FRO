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
  BookOpen,
  CheckCircle2,
  Target,
  Sparkles,
  RefreshCw,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/app/providers/authprovider';
import { StatsSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';

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
// Mock service (replace with real API calls)
// ─────────────────────────────────────────────────────────────────────────────
interface DashboardStats {
  activeProjects: number;
  aiChatsToday: number;
  tasksDue: number;
  knowledgeDocs: number;
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

interface CalendarEvent {
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

async function fetchDashboardData(): Promise<{
  stats: DashboardStats;
  chats: RecentChat[];
  projects: RecentProject[];
  events: CalendarEvent[];
}> {
  // Simulate API delay
  await new Promise((r) => setTimeout(r, 600));
  return {
    stats: {
      activeProjects: 4,
      aiChatsToday: 7,
      tasksDue: 3,
      knowledgeDocs: 24,
    },
    chats: [
      { id: '1', title: 'Architecture Design Review', time: '2h ago', messageCount: 12 },
      { id: '2', title: 'API Integration Planning', time: '5h ago', messageCount: 8 },
      { id: '3', title: 'Code Review Assistance', time: '1d ago', messageCount: 23 },
    ],
    projects: [
      {
        id: '1',
        name: 'AETHER Frontend',
        progress: 68,
        taskCount: 14,
        color: 'from-indigo-500 to-purple-500',
      },
      {
        id: '2',
        name: 'API Gateway',
        progress: 42,
        taskCount: 9,
        color: 'from-emerald-500 to-teal-500',
      },
      {
        id: '3',
        name: 'Knowledge Base v2',
        progress: 85,
        taskCount: 5,
        color: 'from-amber-500 to-orange-500',
      },
    ],
    events: [
      { id: '1', title: 'Team Standup', time: '10:00 AM', type: 'meeting' },
      { id: '2', title: 'Submit PR Review', time: '2:00 PM', type: 'task' },
      { id: '3', title: 'Weekly retrospective', time: '4:30 PM', type: 'meeting' },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
  href: string;
}> = ({ label, value, icon, iconBg, href }) => (
  <Link
    to={href}
    className="group flex flex-col gap-3 rounded-2xl border border-aether-border bg-aether-surface p-5 transition-all duration-200 hover:border-aether-border-strong hover:shadow-lg"
  >
    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-aether-main">{value}</p>
      <p className="mt-0.5 text-xs text-aether-muted">{label}</p>
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

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chats, setChats] = useState<RecentChat[]>([]);
  const [projects, setProjects] = useState<RecentProject[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const displayName = user?.firstName
    ? user.firstName
    : user?.name
      ? user.name.split(' ')[0]
      : user?.email
        ? user.email.split('@')[0]
        : 'there';

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardData();
      setStats(data.stats);
      setChats(data.chats);
      setProjects(data.projects);
      setEvents(data.events);
    } catch {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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
      label: 'New Note',
      icon: <FileText className="h-4 w-4" />,
      href: '/app/knowledge/notes',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20',
    },
    {
      label: 'Automation',
      icon: <Zap className="h-4 w-4" />,
      href: '/app/automation',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20',
    },
    {
      label: 'Knowledge',
      icon: <BookOpen className="h-4 w-4" />,
      href: '/app/knowledge',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20',
    },
    {
      label: 'Calendar',
      icon: <Calendar className="h-4 w-4" />,
      href: '/app/calendar',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20',
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
    <PageWrapper>
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
          <p className="text-sm text-aether-muted">Here's what's happening in your workspace.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
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

      {error && <ErrorState message={error} onRetry={() => void load()} />}

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      {loading ? (
        <StatsSkeleton count={4} />
      ) : stats ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Active Projects"
            value={stats.activeProjects}
            icon={<FolderOpen className="h-4 w-4 text-blue-400" />}
            iconBg="bg-blue-500/10"
            href="/app/projects"
          />
          <StatCard
            label="AI Chats Today"
            value={stats.aiChatsToday}
            icon={<MessageSquare className="h-4 w-4 text-purple-400" />}
            iconBg="bg-purple-500/10"
            href="/app/ai/conversations"
          />
          <StatCard
            label="Tasks Due"
            value={stats.tasksDue}
            icon={<Target className="h-4 w-4 text-amber-400" />}
            iconBg="bg-amber-500/10"
            href="/app/projects/tasks"
          />
          <StatCard
            label="Knowledge Docs"
            value={stats.knowledgeDocs}
            icon={<BookOpen className="h-4 w-4 text-emerald-400" />}
            iconBg="bg-emerald-500/10"
            href="/app/knowledge"
          />
        </div>
      ) : null}

      {/* ── Quick Actions ──────────────────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-aether-muted">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
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
            <SectionHeader title="Recent AI Conversations" href="/app/ai/conversations" />
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-aether-subtle" />
                ))}
              </div>
            ) : chats.length === 0 ? (
              <div className="py-8 text-center">
                <MessageSquare className="mx-auto mb-2 h-8 w-8 text-aether-muted" />
                <p className="text-xs text-aether-muted">No conversations yet</p>
                <Link
                  to="/app/ai/assistant"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  <Plus className="h-3.5 w-3.5" /> Start a conversation
                </Link>
              </div>
            ) : (
              <div className="space-y-1.5">
                {chats.map((chat) => (
                  <Link
                    key={chat.id}
                    to={`/app/ai/conversations/${chat.id}`}
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
            ) : projects.length === 0 ? (
              <div className="py-8 text-center">
                <FolderOpen className="mx-auto mb-2 h-8 w-8 text-aether-muted" />
                <p className="text-xs text-aether-muted">No active projects</p>
                <Link
                  to="/app/projects"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  <Plus className="h-3.5 w-3.5" /> Create a project
                </Link>
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

        {/* Right column: Calendar + Activity */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="rounded-2xl border border-aether-border bg-aether-surface p-5">
            <SectionHeader title="Today's Schedule" href="/app/calendar" />
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-xl bg-aether-subtle" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="mx-auto mb-2 h-8 w-8 text-aether-muted" />
                <p className="text-xs text-aether-muted">Clear day ahead</p>
              </div>
            ) : (
              <div className="space-y-2">
                {events.map((event) => {
                  const config = EVENT_TYPE_CONFIG[event.type];
                  return (
                    <Link
                      key={event.id}
                      to="/app/calendar"
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
              <h3 className="text-xs font-semibold text-indigo-300">AI Insight</h3>
            </div>
            <p className="text-xs leading-relaxed text-aether-muted">
              You have 3 tasks due today. Based on your patterns, consider tackling the hardest one
              first — your focus is typically highest before noon.
            </p>
            <Link
              to="/app/ai/assistant"
              className="mt-3 flex items-center gap-1.5 text-xs text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Ask AI for help <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* System Status */}
          <div className="rounded-2xl border border-aether-border bg-aether-surface p-5">
            <h3 className="mb-3 text-xs font-semibold text-aether-main">System Status</h3>
            <div className="space-y-2.5">
              {[
                {
                  label: 'AI Service',
                  status: 'Operational',
                  color: 'text-emerald-400',
                  dot: 'bg-emerald-400',
                },
                {
                  label: 'Knowledge Base',
                  status: 'Operational',
                  color: 'text-emerald-400',
                  dot: 'bg-emerald-400',
                },
                {
                  label: 'Automation Engine',
                  status: 'Operational',
                  color: 'text-emerald-400',
                  dot: 'bg-emerald-400',
                },
                {
                  label: 'Storage',
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
