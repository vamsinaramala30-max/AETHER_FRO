// ============================================================================
// AETHER AI — AIWelcome Component
// ============================================================================

import React, { memo } from 'react';

interface AIWelcomeProps {
  onStartConversation: () => void;
  className?: string;
}

const CAPABILITY_ITEMS = [
  {
    icon: '💬',
    title: 'Intelligent Conversation',
    description: 'Ask questions, get answers, and work through complex topics.',
  },
  {
    icon: '📚',
    title: 'Knowledge Retrieval',
    description: 'Search and reference your indexed documents and knowledge base.',
  },
  {
    icon: '🧠',
    title: 'Persistent Memory',
    description: 'Remembers your preferences and important context across sessions.',
  },
  {
    icon: '🔧',
    title: 'Workspace Tools',
    description: 'Create tasks, search projects, and navigate your workspace.',
  },
] as const;

/**
 * AIWelcome — Clean first-use experience.
 * Does not show fake AI-generated content or fake examples.
 */
export const AIWelcome = memo<AIWelcomeProps>(({ onStartConversation, className = '' }) => {
  return (
    <section
      className={`flex flex-col items-center justify-center gap-8 p-6 text-center ${className}`}
      aria-label="Welcome to AETHER AI"
    >
      {/* Logo / Icon */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          </div>
          <div className="absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full bg-emerald-400 ring-2 ring-slate-900" aria-hidden="true" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AETHER AI</h1>
          <p className="mt-1 text-sm text-slate-400">
            Your intelligent workspace assistant
          </p>
        </div>
      </div>

      {/* Capabilities */}
      <div className="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
        {CAPABILITY_ITEMS.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-4 text-left"
          >
            <span className="text-xl" role="img" aria-label={item.title}>
              {item.icon}
            </span>
            <h3 className="mt-2 text-sm font-semibold text-slate-200">{item.title}</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{item.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onStartConversation}
        className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        id="ai-start-conversation"
      >
        Start a Conversation
      </button>
    </section>
  );
});

AIWelcome.displayName = 'AIWelcome';
