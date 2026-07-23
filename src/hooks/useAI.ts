import { useCallback } from 'react';
import { useAIStore } from '../state/aiStore';

export const useAI = () => {
  const assistantStatus = useAIStore((s) => s.assistantStatus);
  const isTyping = useAIStore((s) => s.isTyping);
  const error = useAIStore((s) => s.error);

  const setAssistantStatus = useAIStore((s) => s.setAssistantStatus);
  const setIsTyping = useAIStore((s) => s.setIsTyping);
  const setError = useAIStore((s) => s.setError);

  const setStatus = useCallback(
    (status: 'idle' | 'thinking' | 'streaming' | 'error') => {
      setAssistantStatus(status);
    },
    [setAssistantStatus]
  );

  return { assistantStatus, isTyping, error, setStatus, setIsTyping, setError };
};