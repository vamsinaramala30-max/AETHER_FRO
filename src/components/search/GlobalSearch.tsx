import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  MessageSquare,
  FolderOpen,
  FileText,
  BookOpen,
  Zap,
  Settings,
  Calendar,
  Target,
  ChevronRight,
  Command,
  Home,
  Sparkles,
  Brain,
  Cpu,
  Bot,
  Building2,
  Layers,
  Star,
  Users,
  Clock,
  Globe,
  Wrench,
  Gamepad2,
  LayoutDashboard,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  type:
    | 'conversation'
    | 'project'
    | 'document'
    | 'note'
    | 'prompt'
    | 'agent'
    | 'calendar'
    | 'task'
    | 'setting'
    | 'nav';
  title: string;
  description?: string;
  href: string;
  meta?: string;
  aliases?: string[];
}

// ─── Type Config ─────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  SearchResult['type'],
  { icon: React.ReactNode; label: string; color: string }
> = {
  nav: {
    icon: <LayoutDashboard className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />,
    label: 'Page',
    color: 'text-indigo-600 dark:text-indigo-400',
  },
  conversation: {
    icon: <MessageSquare className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />,
    label: 'Chat',
    color: 'text-purple-600 dark:text-purple-400',
  },
  project: {
    icon: <FolderOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />,
    label: 'Project',
    color: 'text-blue-600 dark:text-blue-400',
  },
  document: {
    icon: <FileText className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />,
    label: 'Doc',
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  note: {
    icon: <FileText className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />,
    label: 'Note',
    color: 'text-amber-600 dark:text-amber-400',
  },
  prompt: {
    icon: <Zap className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />,
    label: 'Prompt',
    color: 'text-cyan-600 dark:text-cyan-400',
  },
  agent: {
    icon: <Bot className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />,
    label: 'Agent',
    color: 'text-pink-600 dark:text-pink-400',
  },
  calendar: {
    icon: <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />,
    label: 'Event',
    color: 'text-indigo-600 dark:text-indigo-400',
  },
  task: {
    icon: <Target className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />,
    label: 'Task',
    color: 'text-orange-600 dark:text-orange-400',
  },
  setting: {
    icon: <Settings className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />,
    label: 'Setting',
    color: 'text-slate-500 dark:text-slate-400',
  },
};

// ─── Comprehensive AETHER Navigation Index ────────────────────────────────────
// This is the single source of truth for all static nav/page search.
// Derived from navConfig.tsx — must stay in sync if routes change.
// Searched instantly in memory — no API call needed for nav pages.

const NAV_INDEX: SearchResult[] = [
  // ── Home ──────────────────────────────────────────────────────────────────
  {
    id: 'nav_home',
    type: 'nav',
    title: 'Home',
    description: 'Dashboard overview, stats, quick actions and recent activity',
    href: '/app',
    aliases: ['dashboard', 'main', 'overview', 'start'],
  },

  // ── AI Platform ───────────────────────────────────────────────────────────
  {
    id: 'nav_ai',
    type: 'nav',
    title: 'Aether Agent',
    description: 'AI platform — assistant, memory, prompts, models, agents',
    href: '/app/ai',
    aliases: ['ai', 'artificial intelligence', 'aether agent', 'aether ai'],
  },
  {
    id: 'nav_ai_assistant',
    type: 'nav',
    title: 'AI Assistant',
    description: 'Chat with the AETHER AI assistant — conversations and completions',
    href: '/app/ai/assistant',
    aliases: ['chat', 'assistant', 'chatgpt', 'llm', 'ask ai', 'ask aether', 'conversation'],
  },
  {
    id: 'nav_ai_memory',
    type: 'nav',
    title: 'AI Memory',
    description: 'Long-term memory and knowledge context for the AETHER AI',
    href: '/app/ai/memory',
    aliases: ['memory', 'context', 'recall', 'ai memory'],
  },
  {
    id: 'nav_ai_prompts',
    type: 'nav',
    title: 'Prompt Library',
    description: 'Saved and reusable AI prompts for the AETHER assistant',
    href: '/app/ai/prompts',
    aliases: ['prompts', 'prompt library', 'templates', 'prompt templates'],
  },
  {
    id: 'nav_ai_models',
    type: 'nav',
    title: 'AI Models',
    description: 'Available language models and provider configurations',
    href: '/app/ai/models',
    aliases: ['models', 'gpt', 'gemini', 'claude', 'llm models', 'ai models'],
  },
  {
    id: 'nav_ai_agents',
    type: 'nav',
    title: 'Agents',
    description: 'Autonomous AI agents and agentic workflows',
    href: '/app/ai/agents',
    aliases: ['agents', 'autonomous', 'agent', 'bot'],
  },

  // ── Cognitive Hub ─────────────────────────────────────────────────────────
  {
    id: 'nav_cognitive',
    type: 'nav',
    title: 'Cognitive Hub',
    description: 'Brain training games — focus, memory, logic, and reasoning',
    href: '/app/cognitive-hub',
    aliases: ['cognitive', 'brain', 'games', 'training', 'cognitive hub', 'game hub'],
  },
  {
    id: 'nav_cognitive_daily',
    type: 'nav',
    title: 'Daily Training',
    description: 'Daily cognitive training exercises and challenges',
    href: '/app/cognitive-hub/daily',
    aliases: ['daily', 'daily training', 'daily challenge'],
  },
  {
    id: 'nav_cognitive_dashboard',
    type: 'nav',
    title: 'Progress Dashboard',
    description: 'Cognitive performance analytics and progress tracking',
    href: '/app/cognitive-hub/dashboard',
    aliases: ['progress', 'cognitive progress', 'performance'],
  },
  {
    id: 'nav_game_focus_lock',
    type: 'nav',
    title: 'Focus Lock',
    description: 'Attention and concentration cognitive game',
    href: '/app/cognitive-hub/focus-lock',
    aliases: ['focus lock', 'focus game', 'attention game'],
  },
  {
    id: 'nav_game_memory_matrix',
    type: 'nav',
    title: 'Memory Matrix',
    description: 'Visual memory and pattern recall game',
    href: '/app/cognitive-hub/memory-matrix',
    aliases: ['memory matrix', 'memory game', 'pattern recall'],
  },
  {
    id: 'nav_game_logic_forge',
    type: 'nav',
    title: 'Logic Forge',
    description: 'Deductive reasoning and logical thinking game',
    href: '/app/cognitive-hub/logic-forge',
    aliases: ['logic forge', 'logic game', 'reasoning game', 'deduction'],
  },
  {
    id: 'nav_game_pattern_shift',
    type: 'nav',
    title: 'Pattern Shift',
    description: 'Pattern recognition and adaptive thinking game',
    href: '/app/cognitive-hub/pattern-shift',
    aliases: ['pattern shift', 'pattern game', 'pattern recognition'],
  },
  {
    id: 'nav_game_sequence_core',
    type: 'nav',
    title: 'Sequence Core',
    description: 'Sequential memory and order recall game',
    href: '/app/cognitive-hub/sequence-core',
    aliases: ['sequence core', 'sequence game', 'order recall'],
  },
  {
    id: 'nav_game_code_breaker',
    type: 'nav',
    title: 'Code Breaker',
    description: 'Code deciphering and pattern breaking game',
    href: '/app/cognitive-hub/code-breaker',
    aliases: ['code breaker', 'code game', 'cipher', 'decoding'],
  },
  {
    id: 'nav_game_sudoku',
    type: 'nav',
    title: 'Sudoku',
    description: 'Classic Sudoku number placement puzzle',
    href: '/app/cognitive-hub/sudoku',
    aliases: ['sudoku', 'number puzzle'],
  },
  {
    id: 'nav_game_logic_grid',
    type: 'nav',
    title: 'Logic Grid',
    description: 'Advanced logic grid deduction puzzle',
    href: '/app/cognitive-hub/logic-grid',
    aliases: ['logic grid', 'grid puzzle', 'logic puzzle'],
  },
  {
    id: 'nav_game_strategy_grid',
    type: 'nav',
    title: 'Strategy Grid',
    description: 'Strategic thinking and planning game',
    href: '/app/cognitive-hub/strategy-grid',
    aliases: ['strategy grid', 'strategy game', 'planning game'],
  },
  {
    id: 'nav_game_reaction_control',
    type: 'nav',
    title: 'Reaction Control',
    description: 'Reaction time and impulse control training game',
    href: '/app/cognitive-hub/reaction-control',
    aliases: ['reaction control', 'reaction game', 'reflex game'],
  },

  // ── Workspace ─────────────────────────────────────────────────────────────
  {
    id: 'nav_workspace',
    type: 'nav',
    title: 'Workspace',
    description: 'Workspace hub — organization, team, calendar, and productivity',
    href: '/app/workspace',
    aliases: ['workspace', 'org', 'organization'],
  },
  {
    id: 'nav_workspace_overview',
    type: 'nav',
    title: 'Workspace Overview',
    description: 'Overview of your workspace modules, members, and activity',
    href: '/app/workspace',
    aliases: ['workspace overview', 'overview'],
  },
  {
    id: 'nav_workspace_weekly',
    type: 'nav',
    title: 'Weekly Planner',
    description: 'Weekly schedule with 8-8-8 balance gauges and revision cycles',
    href: '/app/workspace/weeklyplanner',
    aliases: ['weekly planner', 'planner', 'weekly schedule', 'schedule', '8-8-8'],
  },
  {
    id: 'nav_workspace_calendar',
    type: 'nav',
    title: 'Calendar',
    description: 'Schedule events, meetings, and task deadlines',
    href: '/app/workspace/calendar',
    aliases: ['calendar', 'events', 'schedule', 'meetings', 'agenda', 'cal'],
  },
  {
    id: 'nav_workspace_productivity',
    type: 'nav',
    title: 'Productivity Hub',
    description: 'Productivity stats, focus telemetry, and performance metrics',
    href: '/app/workspace/productivity-hub',
    aliases: ['productivity', 'productivity hub', 'telemetry', 'performance', 'metrics'],
  },
  {
    id: 'nav_workspace_recent',
    type: 'nav',
    title: 'Recent Files',
    description: 'Recently opened workspace documents and files',
    href: '/app/workspace/recent-files',
    aliases: ['recent files', 'recent', 'files', 'documents', 'recent docs'],
  },
  {
    id: 'nav_workspace_favorites',
    type: 'nav',
    title: 'Favorites',
    description: 'Starred and pinned items — high-priority workspace nodes',
    href: '/app/workspace/favorites',
    aliases: ['favorites', 'starred', 'pinned', 'bookmarks'],
  },
  {
    id: 'nav_workspace_members',
    type: 'nav',
    title: 'Members',
    description: 'Team members, roles, and permissions management',
    href: '/app/workspace/members',
    aliases: ['members', 'team', 'users', 'colleagues', 'staff'],
  },

  // ── Projects / Productivity ───────────────────────────────────────────────
  {
    id: 'nav_projects',
    type: 'nav',
    title: 'Projects',
    description: 'Projects management — overview, tasks, goals, and files',
    href: '/app/projects',
    aliases: ['projects', 'proj', 'project management'],
  },
  {
    id: 'nav_tasks',
    type: 'nav',
    title: 'Tasks',
    description: 'Task management — create, assign, track and complete tasks',
    href: '/app/projects/tasks',
    aliases: ['tasks', 'task', 'to-do', 'todo', 'action items'],
  },
  {
    id: 'nav_goals',
    type: 'nav',
    title: 'Goals',
    description: 'Goal setting and progress tracking for projects',
    href: '/app/projects/goals',
    aliases: ['goals', 'objectives', 'okr', 'milestones'],
  },

  // ── Knowledge ─────────────────────────────────────────────────────────────
  {
    id: 'nav_knowledge',
    type: 'nav',
    title: 'Knowledge',
    description: 'Knowledge hub — documents, notes, and knowledge base',
    href: '/app/knowledge',
    aliases: ['knowledge', 'know', 'wiki', 'library'],
  },
  {
    id: 'nav_knowledge_documents',
    type: 'nav',
    title: 'Documents',
    description: 'All knowledge documents and references',
    href: '/app/knowledge/documents',
    aliases: ['documents', 'docs', 'files', 'papers'],
  },
  {
    id: 'nav_knowledge_notes',
    type: 'nav',
    title: 'Notes',
    description: 'Personal and shared notes in the knowledge base',
    href: '/app/knowledge/notes',
    aliases: ['notes', 'note', 'notepad', 'memos'],
  },
  {
    id: 'nav_knowledge_base',
    type: 'nav',
    title: 'Knowledge Base',
    description: 'Structured knowledge base — articles and reference content',
    href: '/app/knowledge/base',
    aliases: ['knowledge base', 'kb', 'base', 'articles'],
  },
  {
    id: 'nav_knowledge_search',
    type: 'nav',
    title: 'Knowledge Search',
    description: 'Full-text search across the knowledge base',
    href: '/app/knowledge/search',
    aliases: ['knowledge search', 'search knowledge'],
  },

  // ── Automation ───────────────────────────────────────────────────────────
  {
    id: 'nav_automation',
    type: 'nav',
    title: 'Automation',
    description: 'Workflow automation — rules, triggers, and scheduled tasks',
    href: '/app/automation',
    aliases: ['automation', 'auto', 'workflows', 'automations', 'triggers', 'rules'],
  },
  {
    id: 'nav_automation_list',
    type: 'nav',
    title: 'My Automations',
    description: 'Your active and paused automation workflows',
    href: '/app/automation/automations',
    aliases: ['my automations', 'active automations'],
  },
  {
    id: 'nav_automation_templates',
    type: 'nav',
    title: 'Automation Templates',
    description: 'Pre-built automation templates to get started quickly',
    href: '/app/automation/templates',
    aliases: ['automation templates', 'workflow templates'],
  },
  {
    id: 'nav_automation_activity',
    type: 'nav',
    title: 'Automation Activity',
    description: 'Activity log for automation runs and events',
    href: '/app/automation/activity',
    aliases: ['automation activity', 'automation log'],
  },

  // ── Quick Tools ───────────────────────────────────────────────────────────
  {
    id: 'nav_quick_tools',
    type: 'nav',
    title: 'Quick Tools',
    description: 'Handy productivity tools — focus timer and web directory',
    href: '/app/quick-tools',
    aliases: ['quick tools', 'tools'],
  },
  {
    id: 'nav_focus_timer',
    type: 'nav',
    title: 'Focus Timer',
    description: 'Pomodoro-style focus timer for deep work sessions',
    href: '/app/workspace/focustimer',
    aliases: ['focus timer', 'timer', 'pomodoro', 'focus', 'countdown'],
  },
  {
    id: 'nav_web_directory',
    type: 'nav',
    title: 'Web Directory',
    description: 'Curated web directory of tools, resources, and links',
    href: '/app/workspace/webdirectory',
    aliases: ['web directory', 'directory', 'links', 'web', 'bookmarks', 'resources'],
  },

  // ── Settings ─────────────────────────────────────────────────────────────
  {
    id: 'nav_settings',
    type: 'nav',
    title: 'Settings',
    description: 'Application settings and account configuration',
    href: '/app/settings',
    aliases: ['settings', 'config', 'preferences', 'account'],
  },
  {
    id: 'nav_settings_profile',
    type: 'nav',
    title: 'Profile Settings',
    description: 'Update your profile, name, bio, and avatar',
    href: '/app/settings/profile',
    aliases: ['profile', 'profile settings', 'account info'],
  },
  {
    id: 'nav_settings_appearance',
    type: 'nav',
    title: 'Appearance',
    description: 'Theme, dark mode, and visual appearance settings',
    href: '/app/settings/appearance',
    aliases: ['appearance', 'theme', 'dark mode', 'light mode', 'display'],
  },
  {
    id: 'nav_settings_notifications',
    type: 'nav',
    title: 'Notification Settings',
    description: 'Email and push notification preferences',
    href: '/app/settings/notifications',
    aliases: ['notifications', 'alerts', 'notification settings', 'push'],
  },
  {
    id: 'nav_settings_security',
    type: 'nav',
    title: 'Security',
    description: 'Password, two-factor authentication, and API keys',
    href: '/app/settings/security',
    aliases: ['security', '2fa', 'api keys', 'password', 'authentication'],
  },
  {
    id: 'nav_settings_accounts',
    type: 'nav',
    title: 'Connected Accounts',
    description: 'OAuth integrations and connected external accounts',
    href: '/app/settings/accounts',
    aliases: ['connected accounts', 'oauth', 'google', 'github', 'integrations'],
  },
  {
    id: 'nav_settings_billing',
    type: 'nav',
    title: 'Billing',
    description: 'Subscription plan, usage, and payment methods',
    href: '/app/settings/billing',
    aliases: ['billing', 'subscription', 'plan', 'payment', 'invoice'],
  },
  {
    id: 'nav_settings_audit',
    type: 'nav',
    title: 'Audit Logs',
    description: 'Security events and activity audit trail',
    href: '/app/settings/audit-logs',
    aliases: ['audit logs', 'audit', 'security log', 'activity log'],
  },
];

// ─── Quick nav shortcuts (shown when no query is typed) ───────────────────────

const QUICK_LINKS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: 'Home',
    href: '/app',
    icon: <Home className="h-4 w-4 text-slate-500 dark:text-slate-400" />,
  },
  {
    label: 'AI Assistant',
    href: '/app/ai/assistant',
    icon: <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
  },
  {
    label: 'Calendar',
    href: '/app/workspace/calendar',
    icon: <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
  },
  {
    label: 'Projects',
    href: '/app/projects',
    icon: <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  },
  {
    label: 'Knowledge Base',
    href: '/app/knowledge',
    icon: <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
  },
  {
    label: 'Automation',
    href: '/app/automation',
    icon: <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
  },
  {
    label: 'Focus Timer',
    href: '/app/workspace/focustimer',
    icon: <Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />,
  },
  {
    label: 'Settings',
    href: '/app/settings/profile',
    icon: <Settings className="h-4 w-4 text-slate-500 dark:text-slate-400" />,
  },
];

import { searchService as knowledgeSearch } from '../../knowledge/search/searchservice';
import { projectService } from '../../services/projectService';
import { chatService } from '../../services/chatService';
import { recentFilesService } from '../../workspace/recent-files/recentfilesservices';
import { taskService } from '../../projects/tasks/taskservice';
import { useEventStore } from '../../workspace/calendar/store/eventStore';
import { storageService } from '../../services/storageService';
import { aiService } from '../../services/aiService';

// ─── Nav search (instant, no API) ────────────────────────────────────────────

function searchNavIndex(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const scored: { item: SearchResult; score: number }[] = [];

  for (const item of NAV_INDEX) {
    const titleLower = item.title.toLowerCase();
    const descLower = (item.description ?? '').toLowerCase();
    const aliasStr = (item.aliases ?? []).join(' ').toLowerCase();
    const combined = `${titleLower} ${descLower} ${aliasStr}`;

    let score = 0;

    // Exact title match (highest priority)
    if (titleLower === q) score += 100;
    // Title starts with query
    else if (titleLower.startsWith(q)) score += 80;
    // Title contains query
    else if (titleLower.includes(q)) score += 60;
    // Alias exact match
    else if ((item.aliases ?? []).some((a) => a.toLowerCase() === q)) score += 70;
    // Alias starts with
    else if ((item.aliases ?? []).some((a) => a.toLowerCase().startsWith(q))) score += 55;
    // Alias contains
    else if (aliasStr.includes(q)) score += 40;
    // Description contains
    else if (descLower.includes(q)) score += 20;
    // Token matching
    else {
      const tokens = q.split(/\s+/).filter(Boolean);
      for (const tok of tokens) {
        if (combined.includes(tok)) score += 10;
      }
    }

    if (score > 0) scored.push({ item, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((s) => s.item);
}

// ─── Backend data search ──────────────────────────────────────────────────────

async function performSearch(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  // 1. Search nav index instantly (synchronous)
  const navResults = searchNavIndex(q);

  try {
    const [knowledgeResults, projects, chats, files, tasks, events] = await Promise.all([
      (async () => {
        try {
          return await knowledgeSearch.queryAll(q);
        } catch {
          return [] as any;
        }
      })(),
      (async () => {
        try {
          const workspaces = await import('../../services/workspaceService').then((m) =>
            m.workspaceService.getWorkspaces().catch(() => []),
          );
          const workspaceId =
            Array.isArray(workspaces) && workspaces[0] ? (workspaces[0] as any).id : '';
          return (await projectService.listProjects(workspaceId)).slice(0, 20);
        } catch {
          return [] as any;
        }
      })(),
      (async () => {
        try {
          return chatService.getSessions();
        } catch {
          return [] as any;
        }
      })(),
      (async () => {
        try {
          return await recentFilesService.getRecentFiles();
        } catch {
          return [] as any;
        }
      })(),
      (async () => {
        try {
          return await taskService.getTasks();
        } catch {
          return [] as any;
        }
      })(),
      (async () => {
        try {
          return useEventStore.getState().events || [];
        } catch {
          return [] as any;
        }
      })(),
    ]);

    const candidates: SearchResult[] = [];

    for (const k of knowledgeResults) {
      candidates.push({
        id: `knowledge_${k.id}`,
        type: k.type === 'note' ? 'note' : 'document',
        title: k.title,
        description: k.snippet || '',
        href: `/app/knowledge`,
        meta: new Date(k.date || Date.now()).toLocaleDateString(),
      });
    }

    for (const p of projects || []) {
      const title = p.name || p.title || p.displayName || 'Project';
      candidates.push({
        id: `project_${p.id}`,
        type: 'project',
        title,
        description: p.description || `Workspace: ${p.workspace || ''}`,
        href: `/app/projects/${p.id}`,
        meta: p.updatedAt || '',
      });
    }

    for (const c of chats || []) {
      candidates.push({
        id: `conv_${c.id}`,
        type: 'conversation',
        title: c.title || `Conversation ${c.id}`,
        description: `${(c.messages || []).length || 0} messages`,
        href: `/app/ai/conversations/${c.id}`,
        meta: c.createdAt ? new Date(c.createdAt).toLocaleString() : '',
      });
    }

    for (const f of files || []) {
      candidates.push({
        id: `file_${f.id}`,
        type: 'document',
        title: f.name,
        description: `${f.type} • ${f.location}`,
        href: `/app/workspace/recent-files`,
        meta: new Date(f.lastAccessed).toLocaleDateString(),
      });
    }

    for (const t of tasks || []) {
      candidates.push({
        id: `task_${t.id}`,
        type: 'task',
        title: t.title,
        description: t.description || '',
        href: `/app/projects/tasks/${t.id}`,
        meta: t.dueDate ? `Due ${new Date(t.dueDate).toLocaleDateString()}` : '',
      });
    }

    for (const e of events || []) {
      candidates.push({
        id: `event_${e.id}`,
        type: 'calendar',
        title: e.title,
        description: e.isAllDay ? 'All day' : new Date(e.start).toLocaleTimeString(),
        href: `/app/workspace/calendar`,
        meta: e.start ? new Date(e.start).toLocaleDateString() : '',
      });
    }

    const settingsCandidates: SearchResult[] = [
      {
        id: 'setting_profile',
        type: 'setting',
        title: 'Profile Settings',
        description: 'Update your profile metadata and preferences',
        href: '/app/settings/profile',
      },
      {
        id: 'setting_prefs',
        type: 'setting',
        title: 'Preferences',
        description: 'Appearance, notifications, and dark mode controls',
        href: '/app/settings/preferences',
      },
      {
        id: 'setting_accounts',
        type: 'setting',
        title: 'Connected Accounts',
        description: 'Single sign-on & OAuth integrations',
        href: '/app/settings/accounts',
      },
    ];
    candidates.push(...settingsCandidates);

    const nlIntent = await aiService.parseNaturalLanguageSearch(q).catch(() => ({ intent: 'all' }));
    const tokens = q
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => t.toLowerCase());

    function scoreItem(item: SearchResult): number {
      const hay = `${item.title} ${item.description} ${item.meta}`.toLowerCase();
      let score = 0;
      for (const tok of tokens) {
        if (hay.includes(tok)) score += 10;
        else {
          let idx = 0;
          for (const ch of tok) {
            idx = hay.indexOf(ch, idx);
            if (idx === -1) {
              score -= 1;
              break;
            }
            idx++;
            score += 0.1;
          }
        }
      }
      if (tokens.some((t) => item.title.toLowerCase().includes(t))) score += 5;

      if (nlIntent.intent === 'calendar' && item.type === 'calendar') score += 15;
      if (nlIntent.intent === 'projects' && item.type === 'project') score += 15;
      if (nlIntent.intent === 'files' && (item.type === 'document' || item.type === 'note'))
        score += 15;

      return score;
    }

    const matchedData = candidates
      .map((c) => ({ c, score: scoreItem(c) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map((x) => x.c);

    // Deduplicate: nav results first (instant), then backend data
    const seen = new Set(navResults.map((r) => r.id));
    const uniqueData = matchedData.filter((r) => !seen.has(r.id));

    return [...navResults, ...uniqueData].slice(0, 50);
  } catch (err) {
    console.error('performSearch error', err);
    // Return at least nav results even if backend fails
    return navResults;
  }
}

interface GlobalSearchProps {
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const highlight = (text: string, q: string) => {
    if (!q) return text;
    try {
      const tokens = q
        .split(/\s+/)
        .filter(Boolean)
        .map((t) => escapeRegExp(t));
      if (tokens.length === 0) return text;
      const rx = new RegExp(`(${tokens.join('|')})`, 'ig');
      const parts = text.split(rx);
      return parts.map((part, idx) =>
        rx.test(part) ? (
          <mark
            key={idx}
            className="bg-indigo-500/20 font-bold text-indigo-700 dark:bg-indigo-500/30 dark:text-indigo-300"
          >
            {part}
          </mark>
        ) : (
          <span key={idx}>{part}</span>
        ),
      );
    } catch {
      return text;
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    const stored = storageService.get<string[]>('recent_searches', []);
    setRecentSearches(Array.isArray(stored) ? stored : []);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      setSelectedIndex(0);
      return;
    }

    // Instant nav search (synchronous, no loading state flash)
    const immediateNav = searchNavIndex(query);
    if (immediateNav.length > 0) {
      setResults(immediateNav);
      setSelectedIndex(0);
    }

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const res = await performSearch(query);
        setResults(res);
        setSelectedIndex(0);
      } catch (err: any) {
        setError('Search failed. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const saveRecent = (q: string) => {
    if (!q || !q.trim()) return;
    const list = storageService.get<string[]>('recent_searches', []);
    const dedup = [q, ...list.filter((s) => s !== q)].slice(0, 6);
    storageService.set('recent_searches', dedup);
    setRecentSearches(dedup);
  };

  const navigateTo = useCallback(
    (href: string, q?: string) => {
      if (q) saveRecent(q);
      navigate(href);
      onClose();
    },
    [navigate, onClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const listNoQuery: Array<any> = [];
    if (!query) {
      if (recentSearches.length)
        listNoQuery.push(...recentSearches.map((s) => ({ kind: 'recent', value: s })));
      listNoQuery.push(...QUICK_LINKS.map((l) => ({ kind: 'quick', value: l })));
    }

    const maxIndex = query ? Math.max(0, results.length - 1) : Math.max(0, listNoQuery.length - 1);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => Math.min(p + 1, maxIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => Math.max(p - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (query && results[selectedIndex]) {
        saveRecent(query);
        navigateTo(results[selectedIndex].href, query);
      } else if (!query) {
        const sel = listNoQuery[selectedIndex];
        if (sel) {
          if (sel.kind === 'recent') {
            setQuery(sel.value);
          } else if (sel.kind === 'quick') {
            navigateTo(sel.value.href);
          }
        }
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1040] bg-slate-900/60 backdrop-blur-sm dark:bg-black/80"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Theme-aware Modal */}
      <div
        role="dialog"
        aria-label="Global search"
        aria-modal="true"
        className="fixed left-1/2 top-[15%] z-[1050] w-full max-w-2xl -translate-x-1/2 px-4"
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 dark:border-slate-800">
            <Search className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search pages, projects, chats, docs, tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
              aria-label="Search"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <kbd className="inline-flex items-center rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                ESC
              </kbd>
            </button>
          </div>

          {/* Results / Quick Links Container */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading && results.length === 0 && (
              <div className="flex items-center justify-center py-10">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400" />
              </div>
            )}

            {error && (
              <div className="px-4 py-6 text-sm text-red-600 dark:text-red-400">{error}</div>
            )}

            {!loading && query && results.length === 0 && !error && (
              <div className="py-12 text-center">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Try searching with different keywords or check spelling.
                </p>
              </div>
            )}

            {query && results.length > 0 && (
              <div className="py-2">
                {results.map((result, i) => {
                  const config = TYPE_CONFIG[result.type] ?? TYPE_CONFIG['nav'];
                  const isSelected = i === selectedIndex;

                  return (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => {
                        saveRecent(query);
                        navigateTo(result.href, query);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isSelected
                          ? 'bg-indigo-50/80 dark:bg-slate-800/80'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <span className={`shrink-0 ${config.color}`}>{config.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                          {typeof result.title === 'string'
                            ? highlight(result.title, query)
                            : result.title}
                        </p>
                        {result.description && (
                          <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            {typeof result.description === 'string'
                              ? highlight(result.description, query)
                              : result.description}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {result.meta && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {result.meta}
                          </span>
                        )}
                        <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {config.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {!query && (
              <div className="py-2">
                {recentSearches.length > 0 && (
                  <>
                    <p className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Recent Searches
                    </p>
                    {recentSearches.map((s, i) => (
                      <button
                        key={`recent_${s}_${i}`}
                        type="button"
                        onClick={() => setQuery(s)}
                        className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                          i === selectedIndex
                            ? 'bg-indigo-50/80 dark:bg-slate-800/80'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <Search className="h-3.5 w-3.5 text-slate-400" />
                        <span className="flex-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {s}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    ))}
                    <div className="my-1 border-t border-slate-200 dark:border-slate-800" />
                  </>
                )}

                <p className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Quick Navigation
                </p>
                {QUICK_LINKS.map((link, i) => {
                  const isSelected = recentSearches.length + i === selectedIndex;
                  return (
                    <button
                      key={link.href}
                      type="button"
                      onClick={() => navigateTo(link.href)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isSelected
                          ? 'bg-indigo-50/80 dark:bg-slate-800/80'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {link.icon}
                      <span className="flex-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                        {link.label}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer controls hint */}
          <div className="flex items-center gap-4 border-t border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[10px] text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <kbd className="rounded border border-slate-300 bg-white px-1 py-0.5 font-mono font-bold dark:border-slate-700 dark:bg-slate-800">
                ↑↓
              </kbd>{' '}
              navigate
            </span>
            <span className="flex items-center gap-1 font-medium">
              <kbd className="rounded border border-slate-300 bg-white px-1 py-0.5 font-mono font-bold dark:border-slate-700 dark:bg-slate-800">
                ↵
              </kbd>{' '}
              open
            </span>
            <span className="flex items-center gap-1 font-medium">
              <kbd className="rounded border border-slate-300 bg-white px-1 py-0.5 font-mono font-bold dark:border-slate-700 dark:bg-slate-800">
                ESC
              </kbd>{' '}
              close
            </span>
            <span className="ml-auto flex items-center gap-1 font-medium">
              <Command className="h-3 w-3 text-indigo-500" /> K to reopen
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalSearch;
