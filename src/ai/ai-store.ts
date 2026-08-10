// ============================================================================
// AETHER AI — Zustand Store
// ============================================================================

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  AIStoreState,
  AIConversation,
  AIMessage,
  AIModelInfo,
  MemoryEntry,
  AIDocument,
  AgentDefinition,
  AgentSession,
  ToolDefinition,
  StreamingSession,
  StreamingStatus,
  RAGContext,
  AIError,
  ModelStatus,
  AIConnectionStatus,
  ThinkingState,
  RAGStatus,
  MemoryStatus,
  ToolRegistryStatus,
  AIPanel,
  AIProviderMode,
  FallbackNotice,
  ProviderStatusInfo,
} from './ai-types';
import { AI_DEFAULTS, AI_STORAGE_KEYS } from './ai-constants';

// ---------------------------------------------------------------------------
// Store Actions
// ---------------------------------------------------------------------------

export interface AIStoreActions {
  // --- Provider ---
  setProviderMode: (mode: AIProviderMode) => void;
  setActiveProvider: (provider: string) => void;
  setFallbackNotice: (notice: FallbackNotice | null) => void;
  setProviderStatuses: (statuses: Record<string, ProviderStatusInfo>) => void;

  // --- Conversation ---
  setConversations: (conversations: Record<string, AIConversation>) => void;
  upsertConversation: (conversation: AIConversation) => void;
  removeConversation: (id: string) => void;
  setActiveConversationId: (id: string | null) => void;
  renameConversation: (id: string, title: string) => void;

  // --- Messages ---
  setMessages: (conversationId: string, messages: AIMessage[]) => void;
  appendMessage: (conversationId: string, message: AIMessage) => void;
  updateMessage: (conversationId: string, messageId: string, patch: Partial<AIMessage>) => void;
  appendStreamingChunk: (conversationId: string, messageId: string, delta: string) => void;
  removeMessage: (conversationId: string, messageId: string) => void;

  // --- Streaming ---
  setStreamingStatus: (status: StreamingStatus) => void;
  setStreamingSession: (session: StreamingSession | null) => void;
  setThinkingState: (state: ThinkingState | null) => void;

  // --- Model ---
  setActiveModel: (model: AIModelInfo | null) => void;
  setAvailableModels: (models: AIModelInfo[]) => void;
  setModelStatus: (status: ModelStatus) => void;

  // --- Memory ---
  setMemoryEntries: (entries: MemoryEntry[]) => void;
  appendMemoryEntry: (entry: MemoryEntry) => void;
  removeMemoryEntry: (id: string) => void;
  setMemoryStatus: (status: MemoryStatus | null) => void;

  // --- RAG / Knowledge ---
  setRAGStatus: (status: RAGStatus | null) => void;
  setDocuments: (documents: AIDocument[]) => void;
  upsertDocument: (document: AIDocument) => void;
  removeDocument: (id: string) => void;
  setActiveRAGContext: (context: RAGContext | null) => void;

  // --- Agent ---
  setActiveAgent: (agent: AgentDefinition | null) => void;
  setAvailableAgents: (agents: AgentDefinition[]) => void;
  setActiveAgentSession: (session: AgentSession | null) => void;

  // --- Tools ---
  setAvailableTools: (tools: ToolDefinition[]) => void;
  setToolRegistryStatus: (status: ToolRegistryStatus | null) => void;

  // --- Connection ---
  setConnectionStatus: (status: AIConnectionStatus) => void;

  // --- Error ---
  setError: (error: AIError | null) => void;
  clearError: () => void;

  // --- UI ---
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setActivePanel: (panel: AIPanel) => void;

  // --- Reset ---
  resetStore: () => void;
}

// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------

function loadSidebarPref(): boolean {
  try {
    const stored = localStorage.getItem(AI_STORAGE_KEYS.SIDEBAR_OPEN);
    if (stored !== null) return stored === 'true';
  } catch {
    // storage unavailable
  }
  return AI_DEFAULTS.SIDEBAR_OPEN_DESKTOP;
}

function loadPanelPref(): AIPanel {
  try {
    const stored = localStorage.getItem(AI_STORAGE_KEYS.ACTIVE_PANEL) as AIPanel | null;
    if (stored) return stored;
  } catch {
    // storage unavailable
  }
  return AI_DEFAULTS.DEFAULT_PANEL;
}

const INITIAL_STATE: AIStoreState = {
  providerMode: 'auto',
  activeProvider: 'gemini',
  fallbackNotice: null,
  providerStatuses: {},
  conversations: {},
  activeConversationId: null,
  messages: {},
  streamingStatus: 'idle',
  streamingSession: null,
  thinkingState: null,
  activeModel: null,
  availableModels: [],
  modelStatus: 'unavailable',
  memoryEntries: [],
  memoryStatus: null,
  ragStatus: null,
  documents: [],
  activeRAGContext: null,
  activeAgent: null,
  availableAgents: [],
  activeAgentSession: null,
  availableTools: [],
  toolRegistryStatus: null,
  connectionStatus: 'connecting',
  error: null,
  sidebarOpen: loadSidebarPref(),
  activePanel: loadPanelPref(),
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAIStore = create<AIStoreState & AIStoreActions>()(
  subscribeWithSelector((set, get) => ({
    ...INITIAL_STATE,

    // ----- Provider -----
    setProviderMode: (providerMode) => set({ providerMode }),
    setActiveProvider: (activeProvider) => set({ activeProvider }),
    setFallbackNotice: (fallbackNotice) => set({ fallbackNotice }),
    setProviderStatuses: (providerStatuses) => set({ providerStatuses }),

    // ----- Conversation -----
    setConversations: (conversations) => set({ conversations }),

    upsertConversation: (conversation) =>
      set((state) => ({
        conversations: { ...state.conversations, [conversation.id]: conversation },
      })),

    removeConversation: (id) =>
      set((state) => {
        const { [id]: _removed, ...rest } = state.conversations;
        const { [id]: _removedMsgs, ...restMsgs } = state.messages;
        return {
          conversations: rest,
          messages: restMsgs,
          activeConversationId:
            state.activeConversationId === id ? null : state.activeConversationId,
        };
      }),

    setActiveConversationId: (id) => {
      set({ activeConversationId: id });
      try {
        if (id) localStorage.setItem(AI_STORAGE_KEYS.ACTIVE_CONVERSATION, id);
        else localStorage.removeItem(AI_STORAGE_KEYS.ACTIVE_CONVERSATION);
      } catch {
        // storage unavailable
      }
    },

    renameConversation: (id, title) =>
      set((state) => {
        const existing = state.conversations[id];
        if (!existing) return state;
        return {
          conversations: {
            ...state.conversations,
            [id]: { ...existing, title, updatedAt: Date.now() },
          },
        };
      }),

    // ----- Messages -----
    setMessages: (conversationId, messages) =>
      set((state) => ({
        messages: { ...state.messages, [conversationId]: messages },
      })),

    appendMessage: (conversationId, message) =>
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: [...(state.messages[conversationId] ?? []), message],
        },
      })),

    updateMessage: (conversationId, messageId, patch) =>
      set((state) => {
        const msgs = state.messages[conversationId];
        if (!msgs) return state;
        return {
          messages: {
            ...state.messages,
            [conversationId]: msgs.map((m) =>
              m.id === messageId ? { ...m, ...patch, updatedAt: Date.now() } : m,
            ),
          },
        };
      }),

    appendStreamingChunk: (conversationId, messageId, delta) =>
      set((state) => {
        const msgs = state.messages[conversationId];
        if (!msgs) return state;
        return {
          messages: {
            ...state.messages,
            [conversationId]: msgs.map((m) =>
              m.id === messageId
                ? { ...m, content: m.content + delta, updatedAt: Date.now() }
                : m,
            ),
          },
        };
      }),

    removeMessage: (conversationId, messageId) =>
      set((state) => {
        const msgs = state.messages[conversationId];
        if (!msgs) return state;
        return {
          messages: {
            ...state.messages,
            [conversationId]: msgs.filter((m) => m.id !== messageId),
          },
        };
      }),

    // ----- Streaming -----
    setStreamingStatus: (streamingStatus) => set({ streamingStatus }),
    setStreamingSession: (streamingSession) => set({ streamingSession }),
    setThinkingState: (thinkingState) => set({ thinkingState }),

    // ----- Model -----
    setActiveModel: (activeModel) => {
      set({ activeModel });
      try {
        if (activeModel) localStorage.setItem(AI_STORAGE_KEYS.ACTIVE_MODEL, activeModel.id);
      } catch {
        // storage unavailable
      }
    },
    setAvailableModels: (availableModels) => set({ availableModels }),
    setModelStatus: (modelStatus) => set({ modelStatus }),

    // ----- Memory -----
    setMemoryEntries: (memoryEntries) => set({ memoryEntries }),
    appendMemoryEntry: (entry) =>
      set((state) => ({ memoryEntries: [...state.memoryEntries, entry] })),
    removeMemoryEntry: (id) =>
      set((state) => ({ memoryEntries: state.memoryEntries.filter((e) => e.id !== id) })),
    setMemoryStatus: (memoryStatus) => set({ memoryStatus }),

    // ----- RAG / Knowledge -----
    setRAGStatus: (ragStatus) => set({ ragStatus }),
    setDocuments: (documents) => set({ documents }),
    upsertDocument: (document) =>
      set((state) => {
        const idx = state.documents.findIndex((d) => d.id === document.id);
        if (idx >= 0) {
          const updated = [...state.documents];
          updated[idx] = document;
          return { documents: updated };
        }
        return { documents: [...state.documents, document] };
      }),
    removeDocument: (id) =>
      set((state) => ({ documents: state.documents.filter((d) => d.id !== id) })),
    setActiveRAGContext: (activeRAGContext) => set({ activeRAGContext }),

    // ----- Agent -----
    setActiveAgent: (activeAgent) => set({ activeAgent }),
    setAvailableAgents: (availableAgents) => set({ availableAgents }),
    setActiveAgentSession: (activeAgentSession) => set({ activeAgentSession }),

    // ----- Tools -----
    setAvailableTools: (availableTools) => set({ availableTools }),
    setToolRegistryStatus: (toolRegistryStatus) => set({ toolRegistryStatus }),

    // ----- Connection -----
    setConnectionStatus: (connectionStatus) => set({ connectionStatus }),

    // ----- Error -----
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // ----- UI -----
    setSidebarOpen: (sidebarOpen) => {
      set({ sidebarOpen });
      try {
        localStorage.setItem(AI_STORAGE_KEYS.SIDEBAR_OPEN, String(sidebarOpen));
      } catch {
        // storage unavailable
      }
    },
    toggleSidebar: () => {
      const next = !get().sidebarOpen;
      get().setSidebarOpen(next);
    },
    setActivePanel: (activePanel) => {
      set({ activePanel });
      try {
        localStorage.setItem(AI_STORAGE_KEYS.ACTIVE_PANEL, activePanel);
      } catch {
        // storage unavailable
      }
    },

    // ----- Reset -----
    resetStore: () => set({ ...INITIAL_STATE }),
  })),
);
