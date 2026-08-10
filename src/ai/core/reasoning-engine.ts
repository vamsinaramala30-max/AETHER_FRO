// ============================================================================
// AETHER AI — Reasoning Engine
// ============================================================================
// Provides safe, public-facing reasoning status representation.
// Private chain-of-thought is NEVER exposed to the UI.
// ============================================================================

import type { ThinkingState, ThinkingStatus, AgentStatus } from '../ai-types';
import { THINKING_STATUS_LABELS } from '../ai-constants';

/**
 * Build a ThinkingState for display — only safe public labels.
 * Internal reasoning steps, prompts, and chain-of-thought are never included.
 */
export function buildThinkingState(
  status: ThinkingStatus,
  toolName?: string,
): ThinkingState {
  let label = THINKING_STATUS_LABELS[status];
  if (status === 'using_tool' && toolName) {
    label = `Using ${toolName}…`;
  }
  return { status, toolName, label };
}

/**
 * Map an AgentStatus to a safe ThinkingStatus for display.
 */
export function agentStatusToThinkingStatus(agentStatus: AgentStatus): ThinkingStatus {
  switch (agentStatus) {
    case 'planning':
      return 'planning';
    case 'running':
      return 'generating';
    case 'waiting':
      return 'thinking';
    case 'completed':
    case 'failed':
    case 'cancelled':
    case 'idle':
      return 'idle';
    default:
      return 'idle';
  }
}

/**
 * Determines whether a thinking indicator should be visible.
 */
export function isThinkingVisible(state: ThinkingState | null): boolean {
  if (!state) return false;
  return state.status !== 'idle';
}

/**
 * Get a user-friendly label for the current reasoning status.
 * Never exposes internal reasoning.
 */
export function getReasoningLabel(state: ThinkingState | null): string {
  if (!state || state.status === 'idle') return '';
  return state.label;
}

export const reasoningEngine = {
  buildThinkingState,
  agentStatusToThinkingStatus,
  isThinkingVisible,
  getReasoningLabel,
};
