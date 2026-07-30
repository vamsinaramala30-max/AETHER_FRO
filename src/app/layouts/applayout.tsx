import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Bot,
  CheckSquare,
  BookOpen,
  DollarSign,
  Briefcase,
  Zap,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Menu,
} from 'lucide-react';

import { useAuth } from '@/app/providers/authprovider';

interface NavSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: { label: string; href: string; active?: boolean }[];
}

export const AppLayout: React.FC<React.PropsWithChildren> = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userDisplayName =
    (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.name || user?.email?.split('@')[0]) || 'User';
  const userEmail = user?.email || '';
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    home: true,
    ai: true,
    tasks: true,
    knowledge: true,
    workspace: true,
    automation: true,
    analytics: true,
    settings: true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navSections: NavSection[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-4 h-4" />,
      items: [
        { label: 'Dashboard', href: '/app' },
        { label: 'Daily Overview', href: '/app/overview' },
        { label: "Today's Schedule", href: '/app/schedule' },
        { label: 'Recent Activity', href: '/app/activity' },
        { label: 'Quick Actions', href: '/app/quick-actions' },
      ],
    },
    {
      id: 'ai',
      label: 'AI',
      icon: <Bot className="w-4 h-4" />,
      items: [
        { label: 'AI Assistant', href: '/app/assistant' },
        { label: 'Conversations', href: '/app/conversations' },
        { label: 'Memory', href: '/app/memory' },
        { label: 'Prompt Library', href: '/app/prompts' },
        { label: 'AI Insights', href: '/app/insights' },
      ],
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare className="w-4 h-4" />,
      items: [
        { label: 'Tasks', href: '/app/tasks' },
        { label: 'Projects', href: '/app/projects' },
        { label: 'Goals', href: '/app/goals' },
        { label: 'Calendar', href: '/app/calendar' },
        { label: 'Weekly Review', href: '/app/weekly-review' },
      ],
    },
    {
      id: 'knowledge',
      label: 'Knowledge',
      icon: <BookOpen className="w-4 h-4" />,
      items: [
        { label: 'Notes', href: '/app/notes' },
        { label: 'Documents', href: '/app/documents' },
        { label: 'Knowledge Base', href: '/app/knowledge-base' },
        { label: 'Search', href: '/app/search' },
      ],
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: <DollarSign className="w-4 h-4" />,
      items: [{ label: 'Overview', href: '/app/finance' }],
    },
    {
      id: 'workspace',
      label: 'Workspace',
      icon: <Briefcase className="w-4 h-4" />,
      items: [
        { label: 'Focus Mode', href: '/app/focus' },
        { label: 'Productivity Hub', href: '/app/productivity' },
        { label: 'Recent Files', href: '/app/recent-files' },
        { label: 'Favorites', href: '/app/favorites' },
      ],
    },
    {
      id: 'automation',
      label: 'Automation',
      icon: <Zap className="w-4 h-4" />,
      items: [
        { label: 'Workflow Center', href: '/app/workflows' },
        { label: 'Integrations', href: '/app/integrations' },
        { label: 'Scheduled Actions', href: '/app/scheduled-automation' },
        { label: 'Smart Reminders', href: '/app/reminders' },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      items: [
        { label: 'Productivity Report', href: '/app/analytics/productivity' },
        { label: 'Goal Progress', href: '/app/analytics/goals' },
        { label: 'Time Insights', href: '/app/analytics/time' },
        { label: 'AI Recommendations', href: '/app/analytics/ai' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      items: [
        { label: 'Profile', href: '/app/settings/profile' },
        { label: 'Appearance', href: '/app/settings/appearance' },
        { label: 'Notifications', href: '/app/settings/notifications' },
        { label: 'Security', href: '/app/settings/security' },
        { label: 'Connected Accounts', href: '/app/settings/accounts' },
        { label: 'Preferences', href: '/app/settings/preferences' },
      ],
    },
  ];

  return (
    <div className="bg-[#090C15] text-slate-100 flex min-h-screen font-sans selection:bg-purple-500/30">
      {/* Sidebar Navigation */}
      <aside
        className={`bg-[#0B0E17] border-r border-[#192032] flex flex-col transition-all duration-300 z-30 shrink-0 ${
          collapsed ? 'w-16' : 'w-64'
        } hidden md:flex min-h-screen sticky top-0 h-screen`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#192032]/60">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-900/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {!collapsed && <span className="font-extrabold text-base tracking-tight text-white">Aether</span>}
          </div>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {navSections.map((section) => {
            const isOpen = openSections[section.id];
            return (
              <div key={section.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#131A2B] rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-400 group-hover:text-purple-400 transition-colors">
                      {section.icon}
                    </span>
                    {!collapsed && <span>{section.label}</span>}
                  </div>
                  {!collapsed && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                        isOpen ? '' : '-rotate-90'
                      }`}
                    />
                  )}
                </button>

                {/* Section Items */}
                {!collapsed && isOpen && (
                  <div className="pl-9 pr-1 space-y-1 py-0.5">
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.label}
                          to={item.href}
                          className={`block px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            isActive
                              ? 'text-white bg-[#1A1F36] border border-purple-500/30'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Status & Auth */}
        <div className="p-3 border-t border-[#192032]/60 space-y-2">
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-3 py-2 bg-[#101524] border border-[#1E2638] rounded-xl">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">
                {userDisplayName[0] || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">{userDisplayName}</div>
                <div className="text-[10px] text-slate-400 truncate">{userEmail}</div>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => void logout()}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation Header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0B0E17] border-b border-[#192032]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base text-white">Aether</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Main Canvas Area */}
        <main id="app-content" className="flex-1 overflow-y-auto pl-6 pr-6 py-6 md:pl-8 md:pr-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
