import React, { useState } from 'react';
import { Conversation } from './assistanttype';
import { groupMessagesByDate, formatRelativeTimestamp } from './assistantutils';
import { Pin, Archive, Trash2, Edit2, MessageSquare, Check, X } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onToggleArchive?: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeId,
  onSelect,
  onRename,
  onDelete,
  onTogglePin,
  onToggleArchive,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const groups = groupMessagesByDate(conversations);

  const startRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const handleRenameSubmit = (id: string) => {
    if (editTitle.trim()) {
      onRename(id, editTitle.trim());
    }
    setEditingId(null);
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <MessageSquare className="mb-2 h-8 w-8 stroke-1 opacity-50" />
        No conversations found.
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-2">
      {Object.entries(groups).map(([groupKey, groupConvs]) => {
        if (groupConvs.length === 0) return null;

        return (
          <div key={groupKey} className="space-y-1">
            <h3 className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {groupKey}
            </h3>

            {groupConvs.map((conv) => {
              const isActive = conv.id === activeId;
              const isEditing = conv.id === editingId;
              const isPinned = conv.metadata?.pinned;
              const isArchived = conv.metadata?.archived;

              return (
                <div
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs transition-all duration-150 ${
                    isActive
                      ? 'border border-indigo-200/80 bg-indigo-50 font-semibold text-indigo-700 shadow-sm dark:border-indigo-800/60 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'border border-transparent text-slate-700 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {isEditing ? (
                    <div
                      className="flex w-full items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(conv.id)}
                        autoFocus
                        className="w-full rounded-lg border border-indigo-500 bg-white px-2 py-1 text-xs text-slate-900 outline-none dark:bg-slate-800 dark:text-white"
                      />
                      <button
                        onClick={() => handleRenameSubmit(conv.id)}
                        className="rounded-md p-1 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-1.5 truncate font-medium">
                          {isPinned && (
                            <Pin className="h-3 w-3 shrink-0 fill-indigo-500/20 text-indigo-500" />
                          )}
                          <span className="truncate text-slate-900 dark:text-slate-100">
                            {conv.title}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                          {formatRelativeTimestamp(conv.updatedAt)}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                        {onTogglePin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTogglePin(conv.id);
                            }}
                            className={`rounded-md p-1 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 ${
                              isPinned
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                            title={isPinned ? 'Unpin' : 'Pin'}
                          >
                            <Pin className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {onToggleArchive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleArchive(conv.id);
                            }}
                            className={`rounded-md p-1 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 ${
                              isArchived
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                            title={isArchived ? 'Unarchive' : 'Archive'}
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => startRename(conv, e)}
                          className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                          title="Rename"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(conv.id);
                          }}
                          className="rounded-md p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
