// ============================================================================
// AETHER AI — Tokenizer (Frontend Abstraction)
// ============================================================================
// Frontend estimation of token counts. The real tokenizer runs on the backend.
// These estimates are used for UI display only (e.g., context window fill).
// ============================================================================

/**
 * Rough character-to-token ratio for estimation purposes.
 * Actual tokenization is performed by the backend.
 */
const CHARS_PER_TOKEN = 4;

/**
 * Estimate the approximate token count for a string.
 * This is a heuristic only — not a real tokenizer.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

/**
 * Estimate total tokens for a message array.
 */
export function estimateMessageTokens(messages: Array<{ role: string; content: string }>): number {
  // Each message has ~4 tokens of overhead (role, delimiters)
  const OVERHEAD_PER_MESSAGE = 4;
  return messages.reduce(
    (total, msg) => total + estimateTokens(msg.content) + OVERHEAD_PER_MESSAGE,
    3, // base overhead
  );
}

/**
 * Calculate context window usage as a percentage.
 */
export function contextWindowUsage(
  messages: Array<{ role: string; content: string }>,
  maxContextWindow: number,
): number {
  if (maxContextWindow <= 0) return 0;
  const used = estimateMessageTokens(messages);
  return Math.min(100, Math.round((used / maxContextWindow) * 100));
}

/**
 * Format a token count for display.
 */
export function formatTokenCount(count: number): string {
  if (count < 1000) return `${count}`;
  if (count < 1_000_000) return `${(count / 1000).toFixed(1)}k`;
  return `${(count / 1_000_000).toFixed(2)}M`;
}

export const tokenizer = {
  estimateTokens,
  estimateMessageTokens,
  contextWindowUsage,
  formatTokenCount,
};
