import React from 'react';
import { Home, Bot, FolderOpen, BookOpen, Calendar, Zap, Building2, Settings } from 'lucide-react';
import { NavGroup } from './types';

export const navigationGroups: NavGroup[] = [
  {
    id: 'main-group',
    items: [
      {
        id: 'home',
        label: 'Home',
        icon: React.createElement(Home, { className: 'h-4 w-4' }),
        href: '/app',
      },
    ],
  },
  {
    id: 'ai-group',
    groupLabel: 'AI PLATFORM',
    items: [
      {
        id: 'ai',
        label: 'AI Operating System',
        icon: React.createElement(Bot, { className: 'h-4 w-4' }),
        href: '/app/ai',
        items: [
          { label: 'Assistant', href: '/app/ai/assistant' },
          { label: 'Memory', href: '/app/ai/memory' },
          { label: 'Prompt Library', href: '/app/ai/prompts' },
          { label: 'Models', href: '/app/ai/models' },
          { label: 'Agents', href: '/app/ai/agents' },
        ],
      },
    ],
  },
  {
    id: 'workspace-group',
    groupLabel: 'WORKSPACE',
    items: [
      {
        id: 'projects',
        label: 'Projects',
        icon: React.createElement(FolderOpen, { className: 'h-4 w-4' }),
        href: '/app/projects',
        items: [
          { label: 'Overview', href: '/app/projects' },
          { label: 'Tasks', href: '/app/projects/tasks' },
          { label: 'Goals', href: '/app/projects/goals' },
          { label: 'Files', href: '/app/projects/files' },
        ],
      },
      {
        id: 'knowledge',
        label: 'Knowledge',
        icon: React.createElement(BookOpen, { className: 'h-4 w-4' }),
        href: '/app/knowledge',
        items: [
          { label: 'Documents', href: '/app/knowledge/documents' },
          { label: 'Notes', href: '/app/knowledge/notes' },
          { label: 'Knowledge Base', href: '/app/knowledge/base' },
          { label: 'Search', href: '/app/knowledge/search' },
        ],
      },
      {
        id: 'calendar',
        label: 'Calendar',
        icon: React.createElement(Calendar, { className: 'h-4 w-4' }),
        href: '/app/calendar',
      },
    ],
  },
  {
    id: 'automation-group',
    groupLabel: 'AUTOMATION',
    items: [
      {
        id: 'automation',
        label: 'Automation',
        icon: React.createElement(Zap, { className: 'h-4 w-4' }),
        href: '/app/automation',
        items: [
          { label: 'Workflows', href: '/app/automation/workflows' },
          { label: 'Integrations', href: '/app/automation/integrations' },
          { label: 'Schedules', href: '/app/automation/schedules' },
          { label: 'Logs', href: '/app/automation/logs' },
        ],
      },
    ],
  },
  {
    id: 'system-group',
    groupLabel: 'SYSTEM',
    items: [
      {
        id: 'workspace',
        label: 'Members',
        icon: React.createElement(Building2, { className: 'h-4 w-4' }),
        href: '/app/workspace/members',
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: React.createElement(Settings, { className: 'h-4 w-4' }),
        href: '/app/settings',
        items: [
          { label: 'Profile', href: '/app/settings/profile' },
          { label: 'Appearance', href: '/app/settings/appearance' },
          { label: 'Notifications', href: '/app/settings/notifications' },
          { label: 'Security', href: '/app/settings/security' },
          { label: 'Connected Accounts', href: '/app/settings/accounts' },
          { label: 'Billing', href: '/app/settings/billing' },
        ],
      },
    ],
  },
];
