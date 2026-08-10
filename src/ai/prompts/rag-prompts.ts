// ============================================================================
// AETHER AI — RAG Prompts
// ============================================================================
// Prompt templates for RAG-augmented generation.
// ============================================================================

/**
 * Build a RAG system prompt including retrieved context.
 */
export function buildRAGSystemPrompt(contextBlock: string): string {
  if (!contextBlock.trim()) {
    return `You are AETHER AI. Answer the user's question based on your knowledge.`;
  }

  return `You are AETHER AI, a helpful workspace assistant.

You have been provided with the following context retrieved from the user's knowledge base:

${contextBlock}

Instructions:
- Use the provided context to answer the user's question accurately.
- If the context doesn't contain the answer, say so clearly.
- Always cite which source document you are drawing from using [Source: document name].
- Do not invent information that is not in the context.`;
}

/**
 * Build a RAG query expansion prompt (sent to backend).
 * Used to generate alternative queries for better retrieval coverage.
 */
export function buildQueryExpansionRequest(userQuery: string): string {
  return `Generate 3 alternative search queries for the following user question to improve document retrieval coverage. Return only the queries, one per line.\n\nQuestion: ${userQuery}`;
}

/**
 * Build a summarization prompt for a retrieved context.
 */
export function buildContextSummarizationRequest(contextBlock: string): string {
  return `Summarize the following context into the most important facts:\n\n${contextBlock}`;
}

export const ragPrompts = {
  buildRAGSystemPrompt,
  buildQueryExpansionRequest,
  buildContextSummarizationRequest,
};
