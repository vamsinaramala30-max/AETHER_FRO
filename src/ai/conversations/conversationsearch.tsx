import React from 'react';

interface ConversationSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export const ConversationSearch: React.FC<ConversationSearchProps> = ({ value, onChange }) => {
  return (
    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value); }}
          placeholder="Filter active threads..."
          className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <div className="absolute left-2.5 top-2.5 text-slate-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};