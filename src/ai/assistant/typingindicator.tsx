import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex max-w-[80px] animate-pulse items-center space-x-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
      <div
        className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
        style={{ animationDelay: '0ms' }}
      />
      <div
        className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
        style={{ animationDelay: '150ms' }}
      />
      <div
        className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
};
