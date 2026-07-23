import React, { useEffect, useCallback, useRef } from 'react';
import { AssistantLayout } from './assistantlayout';
import { AssistantHeader } from './assistantheader';
import { ChatSidebar } from './chatsidebar';
import { ChatWindow } from './chatwindows';
import { ChatInput } from './chatinput';
import { EmptyState } from './emptystate';
import { ErrorState } from './errorstate';
import { TypingIndicator } from './typingindicator';
import { useAssistantState, useAssistantActions, useActiveConversation } from './assistanthooks';
import { assistantStore } from './assistantstore';

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

  const selectConversation = actions.setActiveConversation;
  const createNewConversation = actions.createConversation;
  const sendMessage = actions.sendMessage;
  const clearError = () => {};
  const retryLastMessage = actions.retryLastMessage;

  const isMobileMenuOpen = state.sidebarOpen;
  const toggleMobileMenu = actions.toggleSidebar;
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
  }, [messages, isStreaming, scrollToBottom]);

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
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [createNewConversation, isMobileMenuOpen, setMobileMenuOpen]);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-background">
      <AssistantHeader
        title={activeConversation?.title || 'AI Assistant'}
        onClearSession={createNewConversation}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        
        <div className="flex-1 flex flex-col">
          {error ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <ErrorState
                message={error}
                onRetry={retryLastMessage}
                onDismiss={clearError}
              />
            </div>
          ) : !activeConversationId || (messages.length === 0 && !isLoading) ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <EmptyState onSelectPrompt={createNewConversation} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              <ChatWindow messages={messages} isLoading={isLoading} />
              {isStreaming && (
                <div className="pt-2">
                  <TypingIndicator />
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          <div className="p-4 border-t border-border/40 bg-background/95 backdrop-blur support-[backdrop-filter]:bg-background/60">
            <ChatInput
              onSendMessage={sendMessage}
              disabled={isLoading || isStreaming}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;