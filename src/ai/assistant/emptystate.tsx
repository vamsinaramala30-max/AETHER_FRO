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
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-16 h-16 bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-3xl font-bold mb-6 shadow-inner"
      >
        A
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
      >
        How can AETHER assist you today?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-gray-500 dark:text-gray-400 mb-8 text-sm max-w-md"
      >
        Ask questions, refactor complex systems, or explore technical strategies with your personal engineering copilot.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full"
      >
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => { onSelectPrompt(s.prompt); }}
            className="flex flex-col items-start p-4 text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all shadow-sm group"
          >
            <span className="text-xl mb-2 group-hover:scale-110 transition-transform">{s.icon}</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-200 mb-1">{s.title}</span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">{s.prompt}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
};