// ============================================================================
// AETHER AI — ConversationList Component
// ============================================================================

import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import type { AIConversation } from '../ai-types';
import { formatConversationDate } from '../conversations/conversation-types';

interface ConversationListProps {
  conversations: AIConversation[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  className?: string;
}

interface ConversationItemProps {
  conversation: AIConversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

const ConversationItem = memo<ConversationItemProps>(
  ({ conversation, isActive, onSelect, onRename, onDelete }) => {
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState(conversation.title);
    const [menuOpen, setMenuOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (editing) inputRef.current?.select();
    }, [editing]);

    // Close menu on outside click
    useEffect(() => {
      if (!menuOpen) return;
      const handler = (e: MouseEvent): void => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setMenuOpen(false);
        }
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    const handleRename = useCallback(() => {
      const trimmed = editValue.trim();
      if (trimmed && trimmed !== conversation.title) {
        onRename(conversation.id, trimmed);
      }
      setEditing(false);
    }, [editValue, conversation.id, conversation.title, onRename]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleRename();
        if (e.key === 'Escape') {
          setEditing(false);
          setEditValue(conversation.title);
        }
      },
      [handleRename, conversation.title],
    );

    return (
      <li className="group relative">
        <button
          type="button"
          onClick={() => onSelect(conversation.id)}
          className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
            isActive
              ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-medium'
              : 'text-aether-muted hover:bg-aether-hover hover:text-aether-main'
          }`}
          aria-current={isActive ? 'true' : undefined}
          aria-label={`Conversation: ${conversation.title}`}
        >
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-aether-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
          <div className="min-w-0 flex-1">
            {editing ? (
              <input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-transparent text-xs font-medium text-aether-main outline-none ring-0"
                aria-label="Edit conversation title"
                maxLength={80}
              />
            ) : (
              <p className="truncate text-xs font-medium text-aether-main">{conversation.title}</p>
            )}
            <p className="text-[10px] text-aether-muted">
              {formatConversationDate(conversation.updatedAt)}
            </p>
          </div>
        </button>

        {/* Context menu trigger */}
        {!editing && (
          <div
            className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
            ref={menuRef}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((m) => !m);
              }}
              className="flex h-6 w-6 items-center justify-center rounded-md text-aether-muted hover:bg-aether-hover hover:text-aether-main focus:outline-none"
              aria-label="Conversation options"
              aria-expanded={menuOpen}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-7 z-20 min-w-[120px] rounded-xl border border-aether-border bg-aether-surface py-1 shadow-xl"
                role="menu"
                aria-label="Conversation options"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setEditing(true);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-aether-main hover:bg-aether-hover"
                >
                  Rename
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDelete(conversation.id);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-500 dark:text-red-400 hover:bg-aether-hover"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </li>
    );
  },
);

ConversationItem.displayName = 'ConversationItem';

/**
 * ConversationList — Sortable list of conversations with rename, delete, and new.
 */
export const ConversationList = memo<ConversationListProps>(
  ({
    conversations,
    activeConversationId,
    onSelect,
    onRename,
    onDelete,
    onNew,
    className = '',
  }) => {
    const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

    return (
      <div className={`flex flex-col ${className}`}>
        {/* New Conversation Button */}
        <div className="p-2">
          <button
            type="button"
            onClick={onNew}
            id="ai-new-conversation"
            className="flex w-full items-center gap-2 rounded-lg border border-dashed border-aether-border px-3 py-2 text-xs text-aether-muted transition-colors hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Conversation
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-aether-muted">No conversations yet.</p>
            <p className="mt-1 text-xs text-aether-muted opacity-80">Start a new conversation above.</p>
          </div>
        ) : (
          <ul className="space-y-0.5 overflow-y-auto p-2" role="list" aria-label="Conversations">
            {sorted.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeConversationId}
                onSelect={onSelect}
                onRename={onRename}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </div>
    );
  },
);

ConversationList.displayName = 'ConversationList';
