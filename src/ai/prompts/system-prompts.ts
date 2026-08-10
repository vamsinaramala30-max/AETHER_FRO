// ============================================================================
// AETHER AI — System Prompts
// ============================================================================
// Defines the base system prompts for the AETHER AI assistant.
// These are sent to the backend as system instructions — NOT hardcoded LLM prompts.
// ============================================================================

/**
 * Base system prompt for the AETHER AI assistant.
 * This provides the assistant's core identity and behavior guidelines.
 * Does NOT expose backend chain-of-thought or private reasoning.
 */
export const AETHER_SYSTEM_PROMPT = `You are AETHER AI, an intelligent workspace assistant integrated into the AETHER platform.

You help users with tasks, projects, knowledge management, and productivity.

Guidelines:
- Provide accurate, helpful, and concise responses.
- When you don't know something, say so clearly rather than guessing.
- When citing information, only cite sources that were actually provided to you.
- Respect user privacy and data boundaries.
- Focus on actionable, practical assistance.`;

/**
 * System prompt for memory-aware responses.
 */
export const MEMORY_AWARE_SYSTEM_PROMPT = `${AETHER_SYSTEM_PROMPT}

You have access to context from the user's memory. Use this context to personalize your responses when relevant.`;

/**
 * System prompt for RAG-enabled responses.
 */
export const RAG_AWARE_SYSTEM_PROMPT = `${AETHER_SYSTEM_PROMPT}

You have been provided with relevant context from the user's knowledge base. 
Only use information from the provided context when answering questions about documents.
Always cite the source documents when using retrieved information.`;

/**
 * System prompt for tool-enabled responses.
 */
export const TOOL_AWARE_SYSTEM_PROMPT = `${AETHER_SYSTEM_PROMPT}

You have access to workspace tools. Use them when the user's request requires taking action in the workspace.
Always confirm actions with the user before making irreversible changes.`;

/**
 * Select the appropriate system prompt based on available capabilities.
 */
export function selectSystemPrompt(options: {
  hasRAGContext: boolean;
  hasMemory: boolean;
  hasTools: boolean;
}): string {
  if (options.hasRAGContext) return RAG_AWARE_SYSTEM_PROMPT;
  if (options.hasMemory) return MEMORY_AWARE_SYSTEM_PROMPT;
  if (options.hasTools) return TOOL_AWARE_SYSTEM_PROMPT;
  return AETHER_SYSTEM_PROMPT;
}

export const systemPrompts = {
  AETHER_SYSTEM_PROMPT,
  MEMORY_AWARE_SYSTEM_PROMPT,
  RAG_AWARE_SYSTEM_PROMPT,
  TOOL_AWARE_SYSTEM_PROMPT,
  selectSystemPrompt,
};
