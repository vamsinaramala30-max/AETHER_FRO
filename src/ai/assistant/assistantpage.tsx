import React, { useEffect, useCallback, useRef } from 'react';
import { AssistantHeader } from './assistantheader';
import { ChatSidebar } from './chatsidebar';
import { ChatWindow } from './chatwindows';
import { ChatInput } from './chatinput';
import { EmptyState } from './emptystate';
import { ErrorState } from './errorstate';
import { TypingIndicator } from './typingindicator';
import { useAssistantState, useAssistantActions, useActiveConversation } from './assistanthooks';

export const AssistantPage: React.FC = () => {
  const state = useAssistantState();
  const actions = useAssistantActions();

  const conversations = Object.values(state.conversations);
  const activeConversationId = state.activeConversationId;
  const activeConv = useActiveConversation();
  const messages = activeConv?.messages || [];
  const isLoading = state.isLoading;
  const isStreaming = state.isStreaming;
  const error = state.error;

  const createNewConversation = actions.createConversation;
  const sendMessage = actions.sendMessage;
  const clearError = () => {};
  const retryLastMessage = actions.retryLastMessage;

  const isMobileMenuOpen = state.sidebarOpen;
  const setMobileMenuOpen = actions.setSidebarOpen;

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages or active streaming state
  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isStreaming, scrollToBottom]);

  // Keyboard shortcut support: Cmd/Ctrl + K (New Chat), Escape (Close Mobile Menu)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        createNewConversation();
      } else if (e.key === 'Escape' && isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [createNewConversation, isMobileMenuOpen, setMobileMenuOpen]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  return (
    <div className="bg-background relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
      <AssistantHeader
        title={activeConversation?.title || 'AI Assistant'}
        onClearSession={createNewConversation}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <ChatSidebar />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {error ? (
            <div className="flex flex-1 items-center justify-center overflow-y-auto p-4">
              <ErrorState message={error} onRetry={retryLastMessage} onDismiss={clearError} />
            </div>
          ) : !activeConversationId || (messages.length === 0 && !isLoading) ? (
            <div className="flex flex-1 items-center justify-center overflow-y-auto p-3 sm:p-4">
              <EmptyState onSelectPrompt={(promptText) => sendMessage(promptText)} />
            </div>
          ) : (
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 sm:p-4 md:p-6">
              <ChatWindow messages={messages} isLoading={isLoading} />
              {isStreaming && (
                <div className="pt-2">
                  <TypingIndicator />
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          <div className="shrink-0 border-t border-slate-200 bg-white/95 p-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:p-4">
            <ChatInput onSendMessage={sendMessage} disabled={isLoading || isStreaming} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;
