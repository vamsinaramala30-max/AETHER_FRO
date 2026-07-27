import React, { useState } from 'react';
import { Conversation } from './assistanttype';
import { groupMessagesByDate, formatRelativeTimestamp } from './assistantutils';

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeId,
  onSelect,
  onRename,
  onDelete,
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
      <div className="p-4 text-center text-xs text-gray-400 dark:text-gray-500">
        No conversations found.
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-2">
      {Object.entries(groups).map(([groupKey, groupConvs]) => {
        if (groupConvs.length === 0) return null;

        return (
          <div key={groupKey} className="space-y-1">
            <h3 className="px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {groupKey}
            </h3>

            {groupConvs.map((conv) => {
              const isActive = conv.id === activeId;
              const isEditing = conv.id === editingId;

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelect(conv.id);
                  }}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs transition-colors ${
                    isActive
                      ? 'bg-blue-50 font-medium text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60'
                  }`}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => {
                        setEditTitle(e.target.value);
                      }}
                      onBlur={() => {
                        handleRenameSubmit(conv.id);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(conv.id)}
                      autoFocus
                      className="w-full rounded border border-blue-500 bg-white px-2 py-1 text-gray-900 outline-none dark:bg-gray-800 dark:text-white"
                    />
                  ) : (
                    <>
                      <div className="flex-1 truncate pr-2">
                        <div className="truncate">{conv.title}</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500">
                          {formatRelativeTimestamp(conv.updatedAt)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            startRename(conv, e);
                          }}
                          className="p-1 hover:text-gray-900 dark:hover:text-white"
                          title="Rename"
                        >
                          ✎
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(conv.id);
                          }}
                          className="p-1 hover:text-red-500"
                          title="Delete"
                        >
                          ✕
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
