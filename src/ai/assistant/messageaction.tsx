import React, { useState } from 'react';
import { copyToClipboard } from './assistantutils';

interface MessageActionsProps {
  content: string;
  role: 'user' | 'assistant';
  onRegenerate?: () => void;
  onDelete?: () => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  content,
  role,
  onRegenerate,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
      <button
        onClick={handleCopy}
        className="rounded-md p-1.5 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        title="Copy message"
        aria-label="Copy content"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>

      {role === 'assistant' && onRegenerate && (
        <button
          onClick={onRegenerate}
          className="rounded-md p-1.5 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          title="Regenerate response"
          aria-label="Regenerate response"
        >
          Regenerate
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
          title="Delete message"
          aria-label="Delete message"
        >
          Delete
        </button>
      )}
    </div>
  );
};
