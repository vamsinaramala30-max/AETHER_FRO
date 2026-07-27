import { useCallback } from 'react';
import { useAIStore, ChatMessage } from '../state/aiStore';

export const useChat = (conversationId?: string) => {
  const hasConvId = typeof conversationId === 'string' && conversationId.trim() !== '';
  const activeId = useAIStore((s) => (hasConvId ? conversationId : s.activeConversationId));
  const messages = useAIStore((s) => {
    if (typeof activeId === 'string' && activeId.trim() !== '') {
      return s.messages[activeId] ?? [];
    }
    return [];
  });
  const addMessage = useAIStore((s) => s.addMessage);
  const appendStreamContent = useAIStore((s) => s.appendStreamContent);

  const sendMessage = useCallback(
    (content: string) => {
      if (typeof activeId !== 'string' || activeId.trim() === '') return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        conversationId: activeId,
        sender: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      addMessage(activeId, userMsg);
    },
    [activeId, addMessage],
  );

  return { activeId, messages, sendMessage, appendStreamContent };
};
