import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Users,
  CreditCard,
  Key,
  Shield,
  ChevronRight,
  Crown,
  Calendar as CalendarIcon,
  Zap,
  FileText,
  Star,
  LayoutDashboard,
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useAuth } from '@/app/providers/authprovider';

import { CalendarPage } from '@/workspace/calendar/pages/CalendarPage';
import { ProductivityHubPage } from '@/workspace/productivity-hub/productivityhubpage';
import { RecentFilesPage } from '@/workspace/recent-files/recentfilepage';
import { FavoritesPage } from '@/workspace/favorites/favoritepage';

const WORKSPACE_MODULES = [
  {
    href: '/app/workspace/calendar',
    icon: CalendarIcon,
    label: 'Calendar',
    description: 'Schedule events, meetings, and task deadlines.',
    count: 'Events & Agenda',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20',
  },
  {
    href: '/app/workspace/productivity-hub',
    icon: Zap,
    label: 'Productivity Hub',
    description: 'Focus timer, productivity stats, and performance telemetry.',
    count: 'Telemetry & Focus',
    iconColor: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
  },
  {
    href: '/app/workspace/recent-files',
    icon: FileText,
    label: 'Recent Files',
    description: 'Quickly access your recently opened workspace documents.',
    count: 'Recent Files',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20',
  },
  {
    href: '/app/workspace/favorites',
    icon: Star,
    label: 'Favorites',
    description: 'High-priority pinned nodes and starred items.',
    count: 'Pinned Items',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20',
  },
  {
    href: '/app/workspace/members',
    icon: Users,
    label: 'Members',
    description: 'Manage team members, roles, and permissions.',
    count: 'Team seats',
    iconColor: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
  },
  {
    href: '/app/settings/billing',
    icon: CreditCard,
    label: 'Billing',
    description: 'Subscription, usage, and payment methods.',
    count: 'Pro plan',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
  },
  {
    href: '/app/settings/security',
    icon: Key,
    label: 'API Keys & Security',
    description: 'Manage API keys and authentication rules.',
    count: '2 active keys',
    iconColor: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
  },
  {
    href: '/app/automation/logs',
    icon: Shield,
    label: 'Audit Logs',
    description: 'Security events and activity audit trail.',
    count: '247 events',
    iconColor: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20',
  },
];

const ROLE_CONFIG: Record<string, string> = {
  Owner:
    'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20',
  Admin:
    'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20',
  Member:
    'text-slate-700 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700',
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/app/workspace' },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon, path: '/app/workspace/calendar' },
  {
    id: 'productivity-hub',
    label: 'Productivity Hub',
    icon: Zap,
    path: '/app/workspace/productivity-hub',
  },
  {
    id: 'recent-files',
    label: 'Recent Files',
    icon: FileText,
    path: '/app/workspace/recent-files',
  },
  { id: 'favorites', label: 'Favorites', icon: Star, path: '/app/workspace/favorites' },
  { id: 'members', label: 'Members', icon: Users, path: '/app/workspace/members' },
];

interface MemberItem {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  color: string;
}

export const WorkspacePage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [membersList, setMembersList] = useState<MemberItem[]>([]);

  useEffect(() => {
    const initials = (
      user?.name
        ? user.name
            .split(' ')
            .map((p) => p[0])
            .join('')
            .substring(0, 2)
        : user?.email
          ? user.email.substring(0, 2)
          : 'US'
    ).toUpperCase();

    const currentUserObj: MemberItem = {
      id: user?.id || 'usr_current',
      name:
        user?.name ||
        (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Active User'),
      email: user?.email || 'user@aether.os',
      role: 'Owner',
      initials,
      color: 'from-indigo-600 to-purple-600',
    };

    let invited: MemberItem[] = [];
    try {
      const stored = localStorage.getItem('aether_workspace_invited_members');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          invited = parsed.map((m: any) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            role: m.role || 'Member',
            initials: m.initials || 'US',
            color: 'from-blue-600 to-cyan-600',
          }));
        }
      }
    } catch {
      // Ignore
    }

    setMembersList([currentUserObj, ...invited]);
  }, [user]);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/workspace/calendar')) return 'calendar';
    if (path.includes('/workspace/productivity-hub')) return 'productivity-hub';
    if (path.includes('/workspace/recent-files')) return 'recent-files';
    if (path.includes('/workspace/favorites')) return 'favorites';
    if (path.includes('/workspace/members')) return 'members';
    return 'overview';
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tabPath: string) => {
    navigate(tabPath);
  };

  return (
    <PageWrapper wide>
      {/* Workspace Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Building2 className="h-7 w-7 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Workspace
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Organization hub, team management, calendar, productivity telemetry & resources
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="scrollbar-thin flex overflow-x-auto border-b border-slate-200 dark:border-slate-800">
          <div className="flex min-w-max gap-2 pb-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.path)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content rendering */}
      {activeTab === 'calendar' && (
        <div className="mt-4">
          <CalendarPage />
        </div>
      )}

      {activeTab === 'productivity-hub' && (
        <div className="mt-4">
          <ProductivityHubPage />
        </div>
      )}

      {activeTab === 'recent-files' && (
        <div className="mt-4">
          <RecentFilesPage />
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="mt-4">
          <FavoritesPage />
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="mt-6 space-y-6">
          {/* Plan Banner */}
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50/50 to-white p-6 shadow-sm dark:border-indigo-500/20 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  Pro Plan Workspace
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {membersList.length} active seat{membersList.length === 1 ? '' : 's'} ·
                  Auto-renews Aug 15
                </p>
              </div>
            </div>
            <Link
              to="/app/settings/billing"
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Manage Plan <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Module Cards Grid */}
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Workspace Modules & Apps
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {WORKSPACE_MODULES.map((mod) => {
                const Icon = mod.icon;
                return (
                  <Link
                    key={mod.href}
                    to={mod.href}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${mod.bg} ${mod.iconColor}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">{mod.count}</span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                        {mod.label}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                        {mod.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:underline dark:text-indigo-400">
                      Open module <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Members Quick View */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-200">Team Members</h2>
              <Link
                to="/app/workspace/members"
                className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Manage members ({membersList.length})
              </Link>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {membersList.map((m) => (
                <div
                  key={m.email}
                  className="flex items-center gap-3.5 px-6 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <div
                    className={`h-9 w-9 rounded-full bg-gradient-to-tr ${m.color} flex shrink-0 items-center justify-center text-xs font-extrabold text-white shadow-sm`}
                  >
                    {m.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                      {m.name}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {m.email}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${ROLE_CONFIG[m.role] || ROLE_CONFIG.Member}`}
                  >
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default WorkspacePage;
