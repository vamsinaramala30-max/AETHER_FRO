import React, { useState } from 'react';
import { copyToClipboard } from './assistantutils';

interface MessageActionsProps {
  content: string;
  role: 'user' | 'assistant';
  onRegenerate?: () => void;
  onDelete?: () => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({ content, role, onRegenerate, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => { setCopied(false); }, 2000);
    }
  };

  return (
    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity text-xs text-gray-500">
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        title="Copy message"
        aria-label="Copy content"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>

      {role === 'assistant' && onRegenerate && (
        <button
          onClick={onRegenerate}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          title="Regenerate response"
          aria-label="Regenerate response"
        >
          Regenerate
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors"
          title="Delete message"
          aria-label="Delete message"
        >
          Delete
        </button>
      )}
    </div>
  );
};