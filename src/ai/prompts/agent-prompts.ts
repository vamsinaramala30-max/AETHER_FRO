// ============================================================================
// AETHER AI — Agent Prompts
// ============================================================================
// Prompt templates for agent-driven interactions.
// Private chain-of-thought is NEVER exposed to the frontend.
// ============================================================================

import type { AgentDefinition } from '../ai-types';

/**
 * Build the system prompt for an agent session.
 * The agent's internal reasoning is kept private on the backend.
 */
export function buildAgentSystemPrompt(agent: AgentDefinition): string {
  const toolList = agent.tools.length > 0
    ? `You have access to the following tools: ${agent.tools.join(', ')}.`
    : '';

  const basePrompt = agent.systemPrompt?.trim()
    ?? `You are ${agent.name}, an AI agent within the AETHER workspace.`;

  return [basePrompt, toolList].filter(Boolean).join('\n\n');
}

/**
 * Build a planning request description sent to the backend.
 * Internal plan details remain on the backend.
 */
export function buildAgentGoalDescription(goal: string, agentName: string): string {
  return `Agent "${agentName}" is working on the following goal:\n${goal}`;
}

/**
 * Format a safe agent status message for display.
 * Never exposes private reasoning or intermediate steps.
 */
export function formatAgentStatusMessage(
  agentName: string,
  stepDescription: string,
): string {
  return `${agentName}: ${stepDescription}`;
}

export const agentPrompts = {
  buildAgentSystemPrompt,
  buildAgentGoalDescription,
  formatAgentStatusMessage,
};
