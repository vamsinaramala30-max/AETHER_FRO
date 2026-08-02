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
    icon: <MessageSquare className="h-3.5 w-3.5" />,
    label: 'Chat',
    color: 'text-purple-400',
  },
  project: {
    icon: <FolderOpen className="h-3.5 w-3.5" />,
    label: 'Project',
    color: 'text-blue-400',
  },
  document: { icon: <FileText className="h-3.5 w-3.5" />, label: 'Doc', color: 'text-emerald-400' },
  note: { icon: <FileText className="h-3.5 w-3.5" />, label: 'Note', color: 'text-amber-400' },
  prompt: { icon: <Zap className="h-3.5 w-3.5" />, label: 'Prompt', color: 'text-cyan-400' },
  agent: { icon: <Zap className="h-3.5 w-3.5" />, label: 'Agent', color: 'text-pink-400' },
  calendar: {
    icon: <Calendar className="h-3.5 w-3.5" />,
    label: 'Event',
    color: 'text-indigo-400',
  },
  task: { icon: <Target className="h-3.5 w-3.5" />, label: 'Task', color: 'text-orange-400' },
  setting: {
    icon: <Settings className="h-3.5 w-3.5" />,
    label: 'Setting',
    color: 'text-slate-400',
  },
};

// Quick nav shortcuts always visible
const QUICK_LINKS: { label: string; href: string; icon: React.ReactNode; shortcut?: string }[] = [
  {
    label: 'AI Assistant',
    href: '/app/ai/assistant',
    icon: <MessageSquare className="h-4 w-4 text-purple-400" />,
  },
  {
    label: 'Projects',
    href: '/app/projects',
    icon: <FolderOpen className="h-4 w-4 text-blue-400" />,
  },
  {
    label: 'Knowledge Base',
    href: '/app/knowledge',
    icon: <BookOpen className="h-4 w-4 text-emerald-400" />,
  },
  {
    label: 'Calendar',
    href: '/app/calendar',
    icon: <Calendar className="h-4 w-4 text-indigo-400" />,
  },
  {
    label: 'Automation',
    href: '/app/automation',
    icon: <Zap className="h-4 w-4 text-amber-400" />,
  },
  {
    label: 'Settings',
    href: '/app/settings/profile',
    icon: <Settings className="h-4 w-4 text-slate-400" />,
  },
];

// Simulated search — in production replace with real API call
async function performSearch(query: string): Promise<SearchResult[]> {
  await new Promise((r) => setTimeout(r, 150));
  if (!query.trim()) return [];

  const q = query.toLowerCase();
  const mock: SearchResult[] = [
    {
      id: '1',
      type: 'conversation',
      title: 'AI Architecture Discussion',
      description: '3 messages',
      href: '/app/ai/conversations',
      meta: '2h ago',
    },
    {
      id: '2',
      type: 'project',
      title: 'AETHER Frontend',
      description: 'Active · 12 tasks',
      href: '/app/projects',
      meta: 'Today',
    },
    {
      id: '3',
      type: 'document',
      title: 'Product Requirements',
      description: 'Knowledge Base',
      href: '/app/knowledge/documents',
      meta: '1d ago',
    },
    {
      id: '4',
      type: 'note',
      title: 'Meeting Notes - Aug 1',
      description: 'Architecture review',
      href: '/app/knowledge/notes',
      meta: '1d ago',
    },
    {
      id: '5',
      type: 'task',
      title: 'Implement GlobalSearch',
      description: 'AETHER Frontend',
      href: '/app/projects/tasks',
      meta: 'Due today',
    },
    {
      id: '6',
      type: 'prompt',
      title: 'Code Review Template',
      description: 'Prompt Library',
      href: '/app/ai/prompts',
      meta: '',
    },
    {
      id: '7',
      type: 'setting',
      title: 'Profile Settings',
      description: 'Update your profile',
      href: '/app/settings/profile',
      meta: '',
    },
    {
      id: '8',
      type: 'calendar',
      title: 'Team Standup',
      description: '10:00 AM',
      href: '/app/calendar',
      meta: 'Tomorrow',
    },
  ];

  return mock.filter(
    (r) => r.title.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q),
  );
}

interface GlobalSearchProps {
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await performSearch(query);
      setResults(res);
      setSelectedIndex(0);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const navigateTo = useCallback(
    (href: string) => {
      navigate(href);
      onClose();
    },
    [navigate, onClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const list = query ? results : QUICK_LINKS;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => Math.min(p + 1, list.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => Math.max(p - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (query && results[selectedIndex]) {
        navigateTo(results[selectedIndex].href);
      } else if (!query && QUICK_LINKS[selectedIndex]) {
        navigateTo(QUICK_LINKS[selectedIndex].href);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1040] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-label="Global search"
        aria-modal="true"
        className="fixed left-1/2 top-[20%] z-[1050] w-full max-w-2xl -translate-x-1/2 px-4"
      >
        <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-[#111827] shadow-2xl shadow-black/60">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-slate-800/60 px-4 py-3.5">
            <Search className="h-4 w-4 shrink-0 text-slate-500" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search projects, chats, docs, tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
              aria-label="Search"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-slate-500 transition-colors hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-1 text-slate-500 transition-colors hover:text-slate-300"
            >
              <kbd className="inline-flex items-center rounded border border-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                ESC
              </kbd>
            </button>
          </div>

          {/* Results / Quick Links */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-sm text-slate-500">No results for "{query}"</p>
                <p className="mt-1 text-xs text-slate-600">Try a different search term</p>
              </div>
            )}

            {!loading && query && results.length > 0 && (
              <div className="py-2">
                {results.map((result, i) => {
                  const config = TYPE_CONFIG[result.type];
                  return (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => navigateTo(result.href)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                        i === selectedIndex ? 'bg-slate-800/60' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <span className={`shrink-0 ${config.color}`}>{config.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-200">
                          {result.title}
                        </p>
                        {result.description && (
                          <p className="truncate text-xs text-slate-500">{result.description}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {result.meta && (
                          <span className="text-xs text-slate-600">{result.meta}</span>
                        )}
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${config.color} bg-slate-800/60`}
                        >
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
                <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                  Quick Navigation
                </p>
                {QUICK_LINKS.map((link, i) => (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => navigateTo(link.href)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      i === selectedIndex ? 'bg-slate-800/60' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {link.icon}
                    <span className="flex-1 text-sm text-slate-300">{link.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer hints */}
          <div className="flex items-center gap-4 border-t border-slate-800/60 px-4 py-2.5 text-[10px] text-slate-600">
            <span className="flex items-center gap-1">
              <kbd className="font-mono">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono">↵</kbd> open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono">ESC</kbd> close
            </span>
            <span className="ml-auto flex items-center gap-1">
              <Command className="h-3 w-3" /> K to reopen
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalSearch;
