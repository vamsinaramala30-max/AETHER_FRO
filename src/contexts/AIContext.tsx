import React, { createContext, useContext, useMemo, useState, useCallback, ReactNode, useEffect } from 'react';
import { aiService, AIProviderConfig, AIProviderId } from '../services/aiService';

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

export interface WorkspaceContextMemory {
  currentProject?: { id?: string; name?: string };
  currentDocument?: { id?: string; title?: string };
  selectedFile?: { id?: string; name?: string };
  currentWorkspace?: { id?: string; name?: string };
  recentActivity?: string[];
}

export interface AIContextValue {
  activeAssistant: Assistant | null;
  activeConversationId: string | null;
  isStreaming: boolean;
  isTyping: boolean;
  availableAssistants: Assistant[];
  uiPreferences: AIUIPreferences;
  aiConfig: AIProviderConfig;
  isAiEnabled: boolean;
  workspaceContext: WorkspaceContextMemory;
  setActiveAssistant: (assistant: Assistant) => void;
  selectConversation: (conversationId: string | null) => void;
  setStreamingState: (isStreaming: boolean) => void;
  setTypingState: (isTyping: boolean) => void;
  updatePreferences: (prefs: Partial<AIUIPreferences>) => void;
  updateAIConfig: (config: Partial<AIProviderConfig>) => void;
  setWorkspaceContext: (context: Partial<WorkspaceContextMemory>) => void;
  setActiveProvider: (providerId: AIProviderId) => void;
}

const AIContext = createContext<AIContextValue | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aiConfig, setAiConfig] = useState<AIProviderConfig>(() => aiService.getConfig());
  const [activeAssistant, setActiveAssistant] = useState<Assistant | null>({
    id: 'aether-core-1',
    name: 'Aether Core AI',
    model: 'aether-v4-turbo',
    isAvailable: true,
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [workspaceContext, setWorkspaceContextState] = useState<WorkspaceContextMemory>({
    recentActivity: ['Opened Workspace Dashboard', 'Checked System Preferences'],
  });

  const [availableAssistants] = useState<Assistant[]>([
    { id: 'aether-core-1', name: 'Aether Core AI', model: 'aether-v4-turbo', isAvailable: true },
    { id: 'aether-code-1', name: 'Aether Code Engine', model: 'aether-code-v2', isAvailable: true },
    { id: 'aether-doc-1', name: 'Aether Document Analyst', model: 'aether-doc-v1', isAvailable: true },
  ]);

  const [uiPreferences, setUiPreferences] = useState<AIUIPreferences>({
    temperature: 0.7,
    streamingEnabled: true,
    codeHighlighting: true,
  });

  useEffect(() => {
    // Listen for storage changes in case config is changed across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aether_ai_config') {
        setAiConfig(aiService.getConfig());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateAIConfig = useCallback((config: Partial<AIProviderConfig>) => {
    const updated = aiService.saveConfig(config);
    setAiConfig(updated);
  }, []);

  const setActiveProvider = useCallback((providerId: AIProviderId) => {
    const updated = aiService.saveConfig({
      activeProvider: providerId,
      enabled: providerId !== 'disabled',
    });
    setAiConfig(updated);
  }, []);

  const setWorkspaceContext = useCallback((context: Partial<WorkspaceContextMemory>) => {
    setWorkspaceContextState((prev) => ({
      ...prev,
      ...context,
      recentActivity: context.recentActivity || prev.recentActivity,
    }));
  }, []);

  const selectConversation = useCallback((conversationId: string | null) => {
    setActiveConversationId(conversationId);
  }, []);

  const updatePreferences = useCallback((prefs: Partial<AIUIPreferences>) => {
    setUiPreferences((prev) => ({ ...prev, ...prefs }));
  }, []);

  const isAiEnabled = aiConfig.enabled === true;

  const value = useMemo<AIContextValue>(
    () => ({
      activeAssistant,
      activeConversationId,
      isStreaming,
      isTyping,
      availableAssistants,
      uiPreferences,
      aiConfig,
      isAiEnabled,
      workspaceContext,
      setActiveAssistant,
      selectConversation,
      setStreamingState: setIsStreaming,
      setTypingState: setIsTyping,
      updatePreferences,
      updateAIConfig,
      setWorkspaceContext,
      setActiveProvider,
    }),
    [
      activeAssistant,
      activeConversationId,
      isStreaming,
      isTyping,
      availableAssistants,
      uiPreferences,
      aiConfig,
      isAiEnabled,
      workspaceContext,
      selectConversation,
      updatePreferences,
      updateAIConfig,
      setWorkspaceContext,
      setActiveProvider,
    ],
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
