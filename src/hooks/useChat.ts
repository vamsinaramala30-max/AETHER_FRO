import { useCallback } from 'react';
import { useAIStore, ChatMessage } from '../state/aiStore';

export const useChat = (conversationId?: string) => {
  const activeId = useAIStore((s) => conversationId || s.activeConversationId);
  const messages = useAIStore((s) => (activeId ? s.messages[activeId] || [] : []));
  const addMessage = useAIStore((s) => s.addMessage);
  const appendStreamContent = useAIStore((s) => s.appendStreamContent);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeId) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        conversationId: activeId,
        sender: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      addMessage(activeId, userMsg);
    },
    [activeId, addMessage]
  );

  return { activeId, messages, sendMessage, appendStreamContent };
};