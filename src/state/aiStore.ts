import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  metadata?: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  model: string;
}

interface AIState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, ChatMessage[]>;
  assistantStatus: 'idle' | 'thinking' | 'streaming' | 'error';
  isTyping: boolean;
  error: string | null;

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  setMessages: (conversationId: string, messages: ChatMessage[]) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  appendStreamContent: (conversationId: string, messageId: string, chunk: string) => void;
  setAssistantStatus: (status: AIState['assistantStatus']) => void;
  setIsTyping: (isTyping: boolean) => void;
  setError: (error: string | null) => void;
  clearConversation: (conversationId: string) => void;
}

export const useAIStore = create<AIState>()((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  assistantStatus: 'idle',
  isTyping: false,
  error: null,

  setConversations: (conversations) => {
    set({ conversations });
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
  },

  setMessages: (conversationId, messages) => {
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    }));
  },

  addMessage: (conversationId, message) => {
    set((state) => {
      const existing = state.messages[conversationId] ?? [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existing, message],
        },
      };
    });
  },

  appendStreamContent: (conversationId, messageId, chunk) => {
    set((state) => {
      const convMessages = state.messages[conversationId] ?? [];
      const updated = convMessages.map((msg) =>
        msg.id === messageId ? { ...msg, content: msg.content + chunk, isStreaming: true } : msg,
      );
      return { messages: { ...state.messages, [conversationId]: updated } };
    });
  },

  setAssistantStatus: (assistantStatus) => {
    set({ assistantStatus });
  },
  setIsTyping: (isTyping) => {
    set({ isTyping });
  },
  setError: (error) => {
    set({ error });
  },

  clearConversation: (conversationId) => {
    set((state) => {
      const updatedMessages: Record<string, ChatMessage[]> = {};
      Object.keys(state.messages).forEach((key) => {
        if (key !== conversationId) {
          updatedMessages[key] = state.messages[key];
        }
      });
      return { messages: updatedMessages };
    });
  },
}));
