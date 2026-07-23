import React, { createContext, useContext, useMemo, useState, useCallback, ReactNode } from 'react';

export interface Assistant {
  id: string;
  name: string;
  model: string;
  isAvailable: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

export interface AIUIPreferences {
  temperature: number;
  streamingEnabled: boolean;
  codeHighlighting: boolean;
}

export interface AIContextValue {
  activeAssistant: Assistant | null;
  activeConversationId: string | null;
  isStreaming: boolean;
  isTyping: boolean;
  availableAssistants: Assistant[];
  uiPreferences: AIUIPreferences;
  setActiveAssistant: (assistant: Assistant) => void;
  selectConversation: (conversationId: string | null) => void;
  setStreamingState: (isStreaming: boolean) => void;
  setTypingState: (isTyping: boolean) => void;
  updatePreferences: (prefs: Partial<AIUIPreferences>) => void;
}

const AIContext = createContext<AIContextValue | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeAssistant, setActiveAssistant] = useState<Assistant | null>({
    id: 'aether-core-1',
    name: 'Aether Core AI',
    model: 'aether-v4-turbo',
    isAvailable: true,
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [availableAssistants] = useState<Assistant[]>([
    { id: 'aether-core-1', name: 'Aether Core AI', model: 'aether-v4-turbo', isAvailable: true },
    { id: 'aether-code-1', name: 'Aether Code Engine', model: 'aether-code-v2', isAvailable: true },
  ]);

  const [uiPreferences, setUiPreferences] = useState<AIUIPreferences>({
    temperature: 0.7,
    streamingEnabled: true,
    codeHighlighting: true,
  });

  const selectConversation = useCallback((conversationId: string | null) => {
    setActiveConversationId(conversationId);
  }, []);

  const updatePreferences = useCallback((prefs: Partial<AIUIPreferences>) => {
    setUiPreferences((prev) => ({ ...prev, ...prefs }));
  }, []);

  const value = useMemo<AIContextValue>(
    () => ({
      activeAssistant,
      activeConversationId,
      isStreaming,
      isTyping,
      availableAssistants,
      uiPreferences,
      setActiveAssistant,
      selectConversation,
      setStreamingState: setIsStreaming,
      setTypingState: setIsTyping,
      updatePreferences,
    }),
    [
      activeAssistant,
      activeConversationId,
      isStreaming,
      isTyping,
      availableAssistants,
      uiPreferences,
      selectConversation,
      updatePreferences,
    ]
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = (): AIContextValue => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};