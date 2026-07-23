export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export type MessageStatus = 'sending' | 'sent' | 'streaming' | 'delivered' | 'error';

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Citation {
  id: string;
  title: string;
  url: string;
  snippet?: string;
}

export interface ToolInvocation {
  id: string;
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  error?: string;
}

export interface MemoryReference {
  id: string;
  content: string;
  score: number;
  source?: string;
}

export interface ContextModel {
  systemInstruction?: string;
  activeDocumentId?: string;
  memoryReferences?: MemoryReference[];
  ragSources?: Citation[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  createdAt: number;
  updatedAt: number;
  error?: string;
  attachments?: Attachment[];
  citations?: Citation[];
  toolInvocations?: ToolInvocation[];
  tokens?: {
    prompt?: number;
    completion?: number;
    total?: number;
  };
}

export interface ConversationMetadata {
  model?: string;
  temperature?: number;
  tags?: string[];
  pinned?: boolean;
  archived?: boolean;
  totalTokens?: number;
  lastMessageSummary?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  metadata: ConversationMetadata;
  draft?: string;
}

export interface AssistantState {
  conversations: Record<string, Conversation>;
  activeConversationId: string | null;
  isStreaming: boolean;
  isTyping: boolean;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  sidebarOpen: boolean;
  abortController: AbortController | null;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AssistantError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}