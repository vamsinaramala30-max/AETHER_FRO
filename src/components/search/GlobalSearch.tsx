import React, { useState, useEffect, useRef, useCallback } from 'react';
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
} from 'lucide-react';

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
    | 'setting';
  title: string;
  description?: string;
  href: string;
  meta?: string;
}

const TYPE_CONFIG: Record<
  SearchResult['type'],
  { icon: React.ReactNode; label: string; color: string }
> = {
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
    icon: <Zap className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />,
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

// Quick nav shortcuts
const QUICK_LINKS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: 'AI Assistant',
    href: '/app/ai/assistant',
    icon: <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
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
    label: 'Calendar',
    href: '/app/workspace/calendar',
    icon: <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
  },
  {
    label: 'Automation',
    href: '/app/automation',
    icon: <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
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

async function performSearch(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q) return [];

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
    const tokens = q.split(/\s+/).filter(Boolean).map((t) => t.toLowerCase());

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

    const matched = candidates
      .map((c) => ({ c, score: scoreItem(c) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)
      .map((x) => x.c);

    return matched;
  } catch (err) {
    console.error('performSearch error', err);
    throw err;
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
            className="bg-indigo-500/20 text-indigo-700 font-bold dark:bg-indigo-500/30 dark:text-indigo-300"
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
              placeholder="Search projects, chats, docs, tasks..."
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
            {loading && (
              <div className="flex items-center justify-center py-10">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400" />
              </div>
            )}

            {error && <div className="px-4 py-6 text-sm text-red-600 dark:text-red-400">{error}</div>}

            {!loading && query && results.length === 0 && !error && (
              <div className="py-12 text-center">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No results for "{query}"
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Try searching with different keywords or check spelling.
                </p>
              </div>
            )}

            {!loading && query && results.length > 0 && (
              <div className="py-2">
                {results.map((result, i) => {
                  const config = TYPE_CONFIG[result.type];
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
