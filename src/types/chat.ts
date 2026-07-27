import { BaseEntity, ID, Nullable } from './common';
import { TokenUsage } from './ai';

export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMessage extends BaseEntity {
  conversationId: ID;
  role: MessageRole;
  content: string;
  tokens?: TokenUsage;
  isStreaming?: boolean;
  error?: string;
}

export interface Conversation extends BaseEntity {
  title: string;
  assistantId: Nullable<ID>;
  lastMessageAt: string;
  pinned: boolean;
  tags: string[];
}
