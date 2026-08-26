import React from 'react';
import {
  Home,
  Sparkles,
  Brain,
  Command,
  Cpu,
  Bot,
  FolderOpen,
  BookOpen,
  Zap,
  Building2,
  Settings,
} from 'lucide-react';
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
        label: 'AETHER AGENT',
        icon: React.createElement(Sparkles, { className: 'h-4 w-4' }),
        href: '/app/ai',
        items: [
          {
            id: 'agent',
            label: 'Agent',
            href: '/app/ai/assistant',
            icon: React.createElement(Sparkles, { className: 'h-3.5 w-3.5' }),
          },
          {
            id: 'memory',
            label: 'Memory',
            href: '/app/ai/memory',
            icon: React.createElement(Brain, { className: 'h-3.5 w-3.5' }),
          },
          {
            id: 'prompts',
            label: 'Prompt Library',
            href: '/app/ai/prompts',
            icon: React.createElement(Command, { className: 'h-3.5 w-3.5' }),
          },
          {
            id: 'models',
            label: 'Models',
            href: '/app/ai/models',
            icon: React.createElement(Cpu, { className: 'h-3.5 w-3.5' }),
          },
          {
            id: 'agents',
            label: 'Agents',
            href: '/app/ai/agents',
            icon: React.createElement(Bot, { className: 'h-3.5 w-3.5' }),
          },
        ],
      },
    ],
  },
  {
    id: 'workspace-group',
    groupLabel: 'WORKSPACE',
    items: [
      {
        id: 'workspace',
        label: 'Workspace',
        icon: React.createElement(Building2, { className: 'h-4 w-4' }),
        href: '/app/workspace',
        items: [
          { label: 'Overview', href: '/app/workspace' },
          { label: 'Calendar', href: '/app/workspace/calendar' },
          { label: 'Productivity Hub', href: '/app/workspace/productivity-hub' },
          { label: 'Recent Files', href: '/app/workspace/recent-files' },
          { label: 'Favorites', href: '/app/workspace/favorites' },
          { label: 'Members', href: '/app/workspace/members' },
          { label: 'Timer', href: '/app/workspace/focustimer' },
          { label: 'Weekly Planner', href: '/app/workspace/weeklyplanner' },
          { label: 'WebDirectory', href: '/app/workspace/webdirectory' },
        ],
      },
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
        ],
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
          { label: 'Overview', href: '/app/automation' },
          { label: 'My Automations', href: '/app/automation/automations' },
          { label: 'Templates', href: '/app/automation/templates' },
          { label: 'Activity', href: '/app/automation/activity' },
        ],
      },
    ],
  },
  {
    id: 'system-group',
    groupLabel: 'SYSTEM',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        icon: React.createElement(Settings, { className: 'h-4 w-4' }),
        href: '/app/settings',
        items: [
          { label: 'Profile', href: '/app/settings/profile' },
          { label: 'Notifications', href: '/app/settings/notifications' },
          { label: 'Security', href: '/app/settings/security' },
          { label: 'Connected Accounts', href: '/app/settings/accounts' },
          { label: 'Billing', href: '/app/settings/billing' },
        ],
      },
    ],
  },
];
