import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

const SUGGESTIONS = [
  {
    title: 'Code Architecture',
    prompt: 'Design a clean architecture for a high-throughput microservice in TypeScript.',
    icon: '⚡',
  },
  {
    title: 'Debug & Refactor',
    prompt: 'Help me optimize this React component to minimize unnecessary re-renders.',
    icon: '🔧',
  },
  {
    title: 'AI Integration',
    prompt: 'Explain how to implement structured output streams using LLMs.',
    icon: '🧠',
  },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-3 py-4 text-center sm:px-4 sm:py-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-2xl sm:text-3xl font-bold text-blue-600 shadow-inner dark:bg-blue-500/20 dark:text-blue-400"
      >
        A
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-2 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl"
      >
        How can AETHER assist you today?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mb-6 sm:mb-8 max-w-md text-xs text-gray-500 dark:text-gray-400 sm:text-sm"
      >
        Ask questions, refactor complex systems, or explore technical strategies with your personal
        engineering copilot.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => {
              onSelectPrompt(s.prompt);
            }}
            className="group flex flex-col items-start rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:bg-gray-800/80"
          >
            <span className="mb-2 text-xl transition-transform group-hover:scale-110">
              {s.icon}
            </span>
            <span className="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-200">
              {s.title}
            </span>
            <span className="line-clamp-2 text-[11px] text-gray-500 dark:text-gray-400">
              {s.prompt}
            </span>
          </button>
        ))}
      </motion.div>
    </div>
  );
};
