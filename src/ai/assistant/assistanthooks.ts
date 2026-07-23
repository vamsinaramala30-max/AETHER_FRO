import { useSyncExternalStore, useCallback, useRef, useEffect } from 'react';
import { assistantStore } from './assistantstore';
import { AssistantState, Conversation, Message } from './assistanttype';

export const useAssistantState = (): AssistantState => {
  return useSyncExternalStore(
    (callback) => assistantStore.subscribe(callback),
    () => assistantStore.getState()
  );
};

export const useActiveConversation = (): Conversation | null => {
  const state = useAssistantState();
  if (!state.activeConversationId) return null;
  return state.conversations[state.activeConversationId] || null;
};

export const useAssistantMessages = (): Message[] => {
  const activeConv = useActiveConversation();
  return activeConv ? activeConv.messages : [];
};

export const useAssistantActions = () => {
  const sendMessage = useCallback((content: string) => assistantStore.sendMessage(content), []);
  const createConversation = useCallback(() => assistantStore.createConversation(), []);
  const setActiveConversation = useCallback((id: string | null) => { assistantStore.setActiveConversation(id); }, []);
  const deleteConversation = useCallback((id: string) => { assistantStore.deleteConversation(id); }, []);
  const renameConversation = useCallback((id: string, title: string) => { assistantStore.renameConversation(id, title); }, []);
  const setDraft = useCallback((id: string, draft: string) => { assistantStore.setDraft(id, draft); }, []);
  const setSearchQuery = useCallback((query: string) => { assistantStore.setSearchQuery(query); }, []);
  const toggleSidebar = useCallback(() => { assistantStore.toggleSidebar(); }, []);
  const setSidebarOpen = useCallback((open: boolean) => { assistantStore.setSidebarOpen(open); }, []);
  const cancelStreaming = useCallback(() => { assistantStore.cancelStreaming(); }, []);
  const retryLastMessage = useCallback(() => assistantStore.retryLastMessage(), []);
  const deleteMessage = useCallback((convId: string, msgId: string) => { assistantStore.deleteMessage(convId, msgId); }, []);

  return {
    sendMessage,
    createConversation,
    setActiveConversation,
    deleteConversation,
    renameConversation,
    setDraft,
    setSearchQuery,
    toggleSidebar,
    setSidebarOpen,
    cancelStreaming,
    retryLastMessage,
    deleteMessage,
  };
};

export const useAutoScroll = <T extends HTMLElement>(dependencies: unknown[]) => {
  const elementRef = useRef<T | null>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    if (elementRef.current) {
      elementRef.current.scrollTo({
        top: elementRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [dependencies, scrollToBottom]);

  return { elementRef, scrollToBottom };
};

export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyCombo = [
        event.ctrlKey || event.metaKey ? 'cmd' : '',
        event.shiftKey ? 'shift' : '',
        event.key.toLowerCase(),
      ]
        .filter(Boolean)
        .join('+');

      if (shortcuts[keyCombo]) {
        event.preventDefault();
        shortcuts[keyCombo]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [shortcuts]);
};