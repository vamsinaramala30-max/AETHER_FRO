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
  Wrench,
  Settings,
  Gamepad2,
  Layers,
  Calendar,
  FileText,
  Star,
  Users,
  Clock,
  Globe,
} from 'lucide-react';
import { NavGroup } from './types';

export const navigationGroups: NavGroup[] = [
  // ── Home ────────────────────────────────────────────────────────────────────
  {
    id: 'home-group',
    items: [
      {
        id: 'home',
        label: 'Home',
        icon: React.createElement(Home, { className: 'h-4 w-4' }),
        href: '/app',
      },
    ],
  },

  // ── AI PLATFORM ─────────────────────────────────────────────────────────────
  {
    id: 'ai-group',
    groupLabel: 'AI Platform',
    items: [
      {
        id: 'ai',
        label: 'Aether Agent',
        icon: React.createElement(Sparkles, { className: 'h-4 w-4' }),
        href: '/app/ai',
        items: [
          {
            id: 'agent',
            label: 'Assistant',
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

  // ── COGNITIVE ────────────────────────────────────────────────────────────────
  {
    id: 'cognitive-group',
    groupLabel: 'Cognitive',
    items: [
      {
        id: 'cognitive-hub',
        label: 'Cognitive Hub',
        icon: React.createElement(Gamepad2, { className: 'h-4 w-4' }),
        href: '/app/cognitive-hub',
        items: [
          {
            id: 'cognitive-hub-overview',
            label: 'Game Hub',
            href: '/app/cognitive-hub',
          },
          {
            id: 'cognitive-hub-daily',
            label: 'Daily Training',
            href: '/app/cognitive-hub/daily',
          },
          {
            id: 'cognitive-hub-dashboard',
            label: 'Progress Dashboard',
            href: '/app/cognitive-hub/dashboard',
          },
        ],
      },
    ],
  },

  // ── WORKSPACE ────────────────────────────────────────────────────────────────
  {
    id: 'workspace-group',
    groupLabel: 'Workspace',
    items: [
      {
        id: 'workspace',
        label: 'Workspace',
        icon: React.createElement(Building2, { className: 'h-4 w-4' }),
        href: '/app/workspace',
        items: [
          {
            id: 'workspace-overview',
            label: 'Overview',
            href: '/app/workspace',
            icon: React.createElement(Building2, { className: 'h-3.5 w-3.5' }),
          },
          {
            id: 'workspace-weekly',
            label: 'Weekly Planner',
            href: '/app/workspace/weeklyplanner',
            icon: React.createElement(Layers, { className: 'h-3.5 w-3.5' }),
          },
          {
            id: 'workspace-calendar',
            label: 'Calendar',
            href: '/app/workspace/calendar',
            icon: React.createElement(Calendar, { className: 'h-3.5 w-3.5' }),
          },
          {
            id: 'workspace-productivity',
            label: 'Productivity',
            href: '/app/workspace/productivity-hub',
            icon: React.createElement(Zap, { className: 'h-3.5 w-3.5' }),
          },
          {
            id: 'workspace-recent',
            label: 'Recent Files',
            href: '/app/workspace/recent-files',
            icon: React.createElement(FileText, { className: 'h-3.5 w-3.5' }),
          },
          {
            id: 'workspace-favorites',
            label: 'Favorites',
            href: '/app/workspace/favorites',
            icon: React.createElement(Star, { className: 'h-3.5 w-3.5' }),
          },
          {
            id: 'workspace-members',
            label: 'Members',
            href: '/app/workspace/members',
            icon: React.createElement(Users, { className: 'h-3.5 w-3.5' }),
          },
          {
            id: 'workspace-timer',
            label: 'Focus Timer',
            href: '/app/workspace/focustimer',
            icon: React.createElement(Clock, { className: 'h-3.5 w-3.5' }),
          },
          {
            id: 'workspace-webdirectory',
            label: 'Web Directory',
            href: '/app/workspace/webdirectory',
            icon: React.createElement(Globe, { className: 'h-3.5 w-3.5' }),
          },
        ],
      },
    ],
  },

  // ── PROJECTS / KNOWLEDGE / AUTOMATION ───────────────────────────────────────
  {
    id: 'productivity-group',
    groupLabel: 'Productivity',
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
          { label: 'Overview', href: '/app/knowledge' },
          { label: 'Documents', href: '/app/knowledge/documents' },
          { label: 'Notes', href: '/app/knowledge/notes' },
          { label: 'Knowledge Base', href: '/app/knowledge/base' },
          { label: 'Search', href: '/app/knowledge/search' },
        ],
      },
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
          { label: 'Logs', href: '/app/automation/logs' },
        ],
      },
    ],
  },

  // ── TOOLS ────────────────────────────────────────────────────────────────────
  {
    id: 'tools-group',
    groupLabel: 'Tools',
    items: [
      {
        id: 'quick-tools',
        label: 'Quick Tools',
        icon: React.createElement(Wrench, { className: 'h-4 w-4' }),
        href: '/app/quick-tools',
        items: [
          {
            id: 'focus-timer',
            label: 'Focus Timer',
            href: '/app/workspace/focustimer',
            icon: React.createElement(Clock, { className: 'h-3.5 w-3.5' }),
          },
          {
            id: 'web-directory',
            label: 'Web Directory',
            href: '/app/workspace/webdirectory',
            icon: React.createElement(Globe, { className: 'h-3.5 w-3.5' }),
          },
        ],
      },
    ],
  },

  // ── SYSTEM ───────────────────────────────────────────────────────────────────
  {
    id: 'system-group',
    groupLabel: 'System',
    items: [
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
          { label: 'Audit Logs', href: '/app/settings/audit-logs' },
        ],
      },
    ],
  },
];
