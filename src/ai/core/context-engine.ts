// ============================================================================
// AETHER AI — Context Engine
// ============================================================================
// Builds the AIContext object passed through the orchestration pipeline.
// ============================================================================

import type {
  AIContext,
  AIMessage,
  AIModelInfo,
  AIIntent,
  RAGContext,
  MemoryEntry,
  AgentDefinition,
  MessageRole,
} from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';

/**
 * Trim the message history to fit within context window limits.
 * Always keeps the system-level context and trims oldest messages first.
 */
function trimMessages(
  messages: AIMessage[],
  maxChars: number,
): AIMessage[] {
  let total = 0;
  const kept: AIMessage[] = [];
  // Traverse in reverse so newest messages are preserved
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const len = msg.content.length;
    if (total + len > maxChars && kept.length > 0) break;
    kept.unshift(msg);
    total += len;
  }
  return kept;
}

/**
 * Detect whether the query likely needs RAG retrieval.
 */
function detectRAGRequired(userQuery: string): boolean {
  const ragKeywords = [
    'document',
    'file',
    'according to',
    'what does',
    'find in',
    'search',
    'lookup',
    'knowledge',
    'reference',
    'source',
    'report',
  ];
  const lower = userQuery.toLowerCase();
  return ragKeywords.some((kw) => lower.includes(kw));
}

/**
 * Detect whether the query likely needs tools.
 */
function detectToolRequired(userQuery: string): boolean {
  const toolKeywords = [
    'create task',
    'create project',
    'add task',
    'update task',
    'delete',
    'move task',
    'search tasks',
    'open file',
    'run',
    'execute',
    'schedule',
    'remind',
    'set',
    'workspace',
  ];
  const lower = userQuery.toLowerCase();
  return toolKeywords.some((kw) => lower.includes(kw));
}

/**
 * Detect whether the query likely needs an agent.
 */
function detectAgentRequired(userQuery: string): boolean {
  const agentKeywords = [
    'plan',
    'research',
    'analyze',
    'step by step',
    'complex',
    'multi-step',
    'agent',
    'workflow',
    'automate',
    'investigate',
    'investigate',
    'comprehensive',
  ];
  const lower = userQuery.toLowerCase();
  return agentKeywords.some((kw) => lower.includes(kw));
}

/**
 * Build an AIIntent from the latest user message.
 */
export function buildIntent(userQuery: string): AIIntent {
  const requiresRAG = detectRAGRequired(userQuery);
  const requiresTools = detectToolRequired(userQuery);
  const requiresAgent = detectAgentRequired(userQuery);

  return {
    type: requiresAgent ? 'plan' : requiresRAG ? 'search' : 'chat',
    confidence: 0.8,
    requiresRAG,
    requiresTools,
    requiresAgent,
    requiresMemory: true, // always try to use memory
  };
}

export interface BuildContextOptions {
  conversationId: string;
  userId: string;
  messages: AIMessage[];
  activeModel: AIModelInfo | null;
  ragContext: RAGContext | null;
  memoryEntries: MemoryEntry[];
  activeAgent: AgentDefinition | null;
  systemPrompt: string | null;
  userQuery: string;
  metadata?: Record<string, unknown>;
}

/**
 * Build the full AIContext for the orchestration pipeline.
 */
export function buildContext(opts: BuildContextOptions): AIContext {
  const maxChars = DEFAULT_AI_CONFIG.rag.maxContextChars * 4; // rough token-to-char ratio
  const trimmedMessages = trimMessages(opts.messages, maxChars);
  const intent = buildIntent(opts.userQuery);

  return {
    conversationId: opts.conversationId,
    userId: opts.userId,
    messages: trimmedMessages,
    activeModel: opts.activeModel,
    intent,
    ragContext: opts.ragContext,
    memoryEntries: opts.memoryEntries,
    activeAgent: opts.activeAgent,
    systemPrompt: opts.systemPrompt,
    metadata: opts.metadata ?? {},
  };
}

/**
 * Extract the formatted history for passing to the backend.
 */
export function formatMessagesForBackend(
  messages: AIMessage[],
): Array<{ role: MessageRole; content: string }> {
  return messages
    .filter((m) => m.status !== 'error' && m.status !== 'cancelled')
    .map((m) => ({ role: m.role, content: m.content }));
}

export const contextEngine = {
  buildIntent,
  buildContext,
  formatMessagesForBackend,
  trimMessages,
};
