// ============================================================================
// AETHER AI — Executor (Frontend State Representation)
// ============================================================================
// Represents agent step execution state for display.
// ============================================================================

import type { AgentSession, AgentStep, ToolInvocationRef } from '../ai-types';

/**
 * Get all completed steps with results.
 */
export function getCompletedSteps(session: AgentSession): AgentStep[] {
  return session.steps.filter((s) => s.status === 'completed');
}

/**
 * Get failed steps.
 */
export function getFailedSteps(session: AgentSession): AgentStep[] {
  return session.steps.filter((s) => s.status === 'failed');
}

/**
 * Build tool invocation references from agent steps (for display).
 */
export function buildToolInvocationsFromSteps(session: AgentSession): ToolInvocationRef[] {
  return session.steps
    .filter((s) => s.type === 'tool_call' && s.toolId)
    .map((s) => ({
      id: s.id,
      toolName: s.toolId ?? 'Unknown Tool',
      args: s.toolArgs ?? {},
      result: s.result,
      status:
        s.status === 'completed'
          ? 'completed'
          : s.status === 'failed'
            ? 'failed'
            : s.status === 'running'
              ? 'executing'
              : 'pending',
      startedAt: s.startedAt,
      completedAt: s.completedAt,
    }));
}

/**
 * Get a user-facing summary of the execution result.
 * Never exposes private intermediate results.
 */
export function getExecutionSummary(session: AgentSession): string {
  if (session.status === 'completed' && session.result) {
    return session.result;
  }
  if (session.status === 'failed') {
    return session.error ?? 'The agent encountered an error.';
  }
  if (session.status === 'cancelled') {
    return 'Agent session was cancelled.';
  }
  return '';
}

export const executor = {
  getCompletedSteps,
  getFailedSteps,
  buildToolInvocationsFromSteps,
  getExecutionSummary,
};
