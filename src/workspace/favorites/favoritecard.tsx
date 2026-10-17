import React from 'react';
import { Link } from 'react-router-dom';
import { FavoriteItemData } from './favoritesservice';
import {
  Star,
  Trash2,
  FolderGit2,
  FileText,
  StickyNote,
  MessageSquare,
  Zap,
  Bot,
  ExternalLink,
} from 'lucide-react';

interface FavoriteCardProps {
  item: FavoriteItemData;
  onRemove: (id: string) => void;
}

function getCategoryConfig(category?: string) {
  const norm = (category || 'project').toLowerCase();
  switch (norm) {
    case 'project':
      return {
        icon: FolderGit2,
        color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        badge: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/30 dark:text-blue-400',
        href: '/app/projects',
        label: 'Project',
      };
    case 'file':
      return {
        icon: FileText,
        color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
        badge: 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/30 dark:bg-cyan-950/30 dark:text-cyan-400',
        href: '/app/projects/files',
        label: 'File',
      };
    case 'note':
      return {
        icon: StickyNote,
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        badge: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-400',
        href: '/app/knowledge/notes',
        label: 'Note',
      };
    case 'conversation':
    case 'chat':
      return {
        icon: MessageSquare,
        color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        badge: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/30 dark:bg-purple-950/30 dark:text-purple-400',
        href: '/app/ai/assistant',
        label: 'Conversation',
      };
    case 'automation':
      return {
        icon: Zap,
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        badge: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-950/30 dark:text-amber-400',
        href: '/app/automation',
        label: 'Automation',
      };
    case 'model':
      return {
        icon: Bot,
        color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        badge: 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/30 dark:bg-indigo-950/30 dark:text-indigo-400',
        href: '/app/ai/models',
        label: 'Model',
      };
    default:
      return {
        icon: Star,
        color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        badge: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300',
        href: '/app/workspace',
        label: category || 'Resource',
      };
  }
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({ item, onRemove }) => {
  const config = getCategoryConfig(item.category);
  const IconComponent = config.icon;

  return (
    <div className="group relative flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-amber-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-500/40">
      <Link
        to={config.href}
        className="flex min-w-0 flex-1 items-center gap-3 transition-opacity hover:opacity-90"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.color}`}
        >
          <IconComponent className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {item.title}
            </h4>
            <ExternalLink className="h-3 w-3 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`inline-block rounded-md border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${config.badge}`}
            >
              {config.label}
            </span>
            {item.starredAt && (
              <span className="text-[10px] text-slate-400">
                {new Date(item.starredAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-400 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-red-900/50 dark:hover:bg-red-950/40 dark:hover:text-red-400"
        title="Unstar item"
        aria-label={`Unstar ${item.title}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};
