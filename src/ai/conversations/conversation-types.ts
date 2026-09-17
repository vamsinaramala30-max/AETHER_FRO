// ============================================================================
// AETHER AI — Conversation Types
// ============================================================================

export type {
  AIConversation,
  AIMessage,
  MessageRole,
  MessageStatus,
  ConversationMetadata,
  SourceCitationRef,
  ToolInvocationRef,
} from '../ai-types';

import type { AIConversation, AIMessage } from '../ai-types';

/**
 * Build a new empty conversation with a generated ID.
 */
export function createNewConversation(title = 'New Conversation'): AIConversation {
  const now = Date.now();
  return {
    id: `conv_${now}_${Math.random().toString(36).slice(2, 9)}`,
    title,
    createdAt: now,
    updatedAt: now,
    messages: [],
    metadata: {},
  };
}

/**
 * Build a new user message.
 */
export function createUserMessage(conversationId: string, content: string): AIMessage {
  const now = Date.now();
  return {
    id: `msg_${now}_${Math.random().toString(36).slice(2, 9)}`,
    conversationId,
    role: 'user',
    content,
    status: 'sending',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Format conversation date for display.
 */
export function formatConversationDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: 'long' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}
