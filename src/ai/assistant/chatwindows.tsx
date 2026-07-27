import React, { useEffect, useRef } from 'react';
import { Message } from './assistanttype';
import { ChatMessage } from './chatmessage';
import { TypingIndicator } from './typingindicator';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto scroll-smooth bg-slate-50/50 px-4 py-6 dark:bg-slate-900/40"
    >
      <div className="mx-auto max-w-5xl space-y-2">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Contextual Session Initialized
            </h3>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Begin typing below. The model will reference vector notes, open project
              configurations, and past milestone memories automatically.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="my-2 flex w-full justify-start">
            <TypingIndicator />
          </div>
        )}
      </div>
    </div>
  );
};
