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
    <div className="flex-1 overflow-y-auto space-y-4 px-2">
      {Object.entries(groups).map(([groupKey, groupConvs]) => {
        if (groupConvs.length === 0) return null;

        return (
          <div key={groupKey} className="space-y-1">
            <h3 className="px-2 text-[10px] font-semibold tracking-wider uppercase text-gray-400 dark:text-gray-500">
              {groupKey}
            </h3>

            {groupConvs.map((conv) => {
              const isActive = conv.id === activeId;
              const isEditing = conv.id === editingId;

              return (
                <div
                  key={conv.id}
                  onClick={() => { onSelect(conv.id); }}
                  className={`group relative flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                  }`}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => { setEditTitle(e.target.value); }}
                      onBlur={() => { handleRenameSubmit(conv.id); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(conv.id)}
                      autoFocus
                      className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded border border-blue-500 outline-none"
                    />
                  ) : (
                    <>
                      <div className="flex-1 truncate pr-2">
                        <div className="truncate">{conv.title}</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500">
                          {formatRelativeTimestamp(conv.updatedAt)}
                        </div>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <button
                          onClick={(e) => { startRename(conv, e); }}
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