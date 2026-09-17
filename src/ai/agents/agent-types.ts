// ============================================================================
// AETHER AI — Agent Types
// ============================================================================

export type {
  AgentStatus,
  AgentStepType,
  AgentStep,
  AgentDefinition,
  AgentSession,
} from '../ai-types';

/**
 * Safe display labels for agent states.
 * Does NOT expose private chain-of-thought.
 */
export const AGENT_STATUS_LABELS: Record<import('../ai-types').AgentStatus, string> = {
  idle: 'Idle',
  planning: 'Planning…',
  running: 'Running',
  waiting: 'Waiting',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

export const AGENT_STATUS_COLORS: Record<import('../ai-types').AgentStatus, string> = {
  idle: 'text-slate-400',
  planning: 'text-blue-400',
  running: 'text-indigo-400',
  waiting: 'text-amber-400',
  completed: 'text-emerald-400',
  failed: 'text-red-400',
  cancelled: 'text-slate-500',
};

/**
 * Check if an agent session is active (not idle/completed/failed/cancelled).
 */
export function isAgentActive(status: import('../ai-types').AgentStatus): boolean {
  return status === 'planning' || status === 'running' || status === 'waiting';
}

/**
 * Check if an agent session has ended.
 */
export function isAgentFinished(status: import('../ai-types').AgentStatus): boolean {
  return status === 'completed' || status === 'failed' || status === 'cancelled';
}
