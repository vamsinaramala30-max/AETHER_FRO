import React from 'react';
import { Building2, Users, CreditCard, Key, Shield, ChevronRight, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';

const WORKSPACE_MODULES = [
  {
    href: '/app/workspace/members',
    icon: Users,
    label: 'Members',
    description: 'Manage team members, roles, and permissions.',
    count: '4 members',
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

const MEMBERS = [
  {
    name: 'Vamsi Naramala',
    email: 'vamsi@example.com',
    role: 'Owner',
    initials: 'VN',
    color: 'from-indigo-600 to-purple-600',
  },
  {
    name: 'Alex Chen',
    email: 'alex@example.com',
    role: 'Admin',
    initials: 'AC',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    name: 'Sarah Kim',
    email: 'sarah@example.com',
    role: 'Member',
    initials: 'SK',
    color: 'from-pink-600 to-rose-600',
  },
  {
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    role: 'Member',
    initials: 'JL',
    color: 'from-emerald-600 to-teal-600',
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

export const WorkspacePage: React.FC = () => {
  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Workspace
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Organization settings, team management, and workspace overview
            </p>
          </div>
        </div>
      </div>

      {/* Plan Banner */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50/50 to-white p-6 shadow-sm dark:border-indigo-500/20 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 dark:text-white">Pro Plan Workspace</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              4 of 10 seats active · Auto-renews Aug 15
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

      {/* Module Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {WORKSPACE_MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              to={mod.href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${mod.bg} ${mod.iconColor}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {mod.label}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                  {mod.description}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] font-semibold text-slate-400">{mod.count}</p>
                <ChevronRight className="ml-auto mt-1 h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-200" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Members Quick View */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-200">Team Members</h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {MEMBERS.length} active seats
          </span>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {MEMBERS.map((m) => (
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
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${ROLE_CONFIG[m.role]}`}
              >
                {m.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default WorkspacePage;
