// ============================================================================
// AETHER AI — Planner (Frontend State Representation)
// ============================================================================
// Represents agent planning state safely. Internal plan steps remain on backend.
// ============================================================================

import type { AgentSession, AgentStep } from '../ai-types';

/**
 * Get the current planning step from an agent session.
 * Only returns safe, user-facing step descriptions.
 */
export function getCurrentStep(session: AgentSession): AgentStep | null {
  const running = session.steps.find((s) => s.status === 'running');
  if (running) return running;
  const pending = session.steps.find((s) => s.status === 'pending');
  return pending ?? null;
}

/**
 * Get completed steps count for progress display.
 */
export function getCompletedStepCount(session: AgentSession): number {
  return session.steps.filter((s) => s.status === 'completed').length;
}

/**
 * Get total non-cancelled steps.
 */
export function getTotalStepCount(session: AgentSession): number {
  return session.steps.filter((s) => s.status !== 'failed').length;
}

/**
 * Calculate planning progress percentage.
 */
export function getPlanningProgress(session: AgentSession): number {
  const total = getTotalStepCount(session);
  if (total === 0) return 0;
  const completed = getCompletedStepCount(session);
  return Math.round((completed / total) * 100);
}

/**
 * Build a safe display summary for the planning state.
 * Never exposes internal reasoning or chain-of-thought.
 */
export function buildPlannerSummary(session: AgentSession): string {
  const completed = getCompletedStepCount(session);
  const total = getTotalStepCount(session);
  const current = getCurrentStep(session);

  if (session.status === 'planning') {
    return `Planning how to achieve your goal…`;
  }
  if (session.status === 'running' && current) {
    return `Step ${completed + 1} of ${total}: ${current.description}`;
  }
  if (session.status === 'completed') {
    return `Completed ${completed} step${completed !== 1 ? 's' : ''}`;
  }
  return '';
}

export const planner = {
  getCurrentStep,
  getCompletedStepCount,
  getTotalStepCount,
  getPlanningProgress,
  buildPlannerSummary,
};
