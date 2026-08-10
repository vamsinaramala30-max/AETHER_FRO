// ============================================================================
// AETHER AI — Reranker (Frontend Abstraction)
// ============================================================================
// Represents reranking state. Actual reranking runs on the AETHER backend.
// ============================================================================

import type { RetrievalResult } from '../ai-types';

/**
 * Frontend reranking request shape sent to the backend.
 */
export interface RerankRequest {
  query: string;
  results: RetrievalResult[];
  topK?: number;
}

/**
 * Sort retrieval results by score descending (client-side display only).
 * This is NOT a substitute for backend reranking.
 */
export function sortByScore(results: RetrievalResult[]): RetrievalResult[] {
  return [...results].sort((a, b) => b.score - a.score);
}

/**
 * Filter results above a minimum score threshold.
 */
export function filterByScore(results: RetrievalResult[], minScore: number): RetrievalResult[] {
  return results.filter((r) => r.score >= minScore);
}

/**
 * Truncate results to top-K.
 */
export function topK(results: RetrievalResult[], k: number): RetrievalResult[] {
  return results.slice(0, k);
}

/**
 * Format a retrieval score for display.
 */
export function formatScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

export const reranker = {
  sortByScore,
  filterByScore,
  topK,
  formatScore,
};
