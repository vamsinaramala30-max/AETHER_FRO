// ============================================================================
// AETHER AI — Agent Engine (Frontend Coordination)
// ============================================================================
// Coordinates agent session management with the AETHER backend.
// Private agent chain-of-thought is never exposed to the frontend.
// ============================================================================

import type { AgentDefinition, AgentSession, AgentStatus, AIResult } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';

function normalizeAgentDefinition(raw: Record<string, unknown>): AgentDefinition {
  return {
    id: typeof raw['id'] === 'string' ? raw['id'] : `agent_${Date.now()}`,
    name: typeof raw['name'] === 'string' ? raw['name'] : 'Unknown Agent',
    description: typeof raw['description'] === 'string' ? raw['description'] : undefined,
    systemPrompt: typeof raw['system_prompt'] === 'string' ? raw['system_prompt'] : undefined,
    tools: Array.isArray(raw['tools']) ? (raw['tools'] as string[]) : [],
    modelId: typeof raw['model_id'] === 'string' ? raw['model_id'] : undefined,
    maxSteps: typeof raw['max_steps'] === 'number' ? raw['max_steps'] : 10,
    createdAt: typeof raw['created_at'] === 'number' ? raw['created_at'] : Date.now(),
    updatedAt: typeof raw['updated_at'] === 'number' ? raw['updated_at'] : Date.now(),
    enabled: raw['enabled'] !== false,
  };
}

function normalizeAgentSession(raw: Record<string, unknown>): AgentSession {
  const validStatuses: AgentStatus[] = ['idle', 'planning', 'running', 'waiting', 'completed', 'failed', 'cancelled'];
  const rawStatus = raw['status'] as string;
  const status: AgentStatus = validStatuses.includes(rawStatus as AgentStatus)
    ? (rawStatus as AgentStatus)
    : 'idle';

  return {
    sessionId: typeof raw['session_id'] === 'string' ? raw['session_id'] : '',
    agentId: typeof raw['agent_id'] === 'string' ? raw['agent_id'] : '',
    conversationId: typeof raw['conversation_id'] === 'string' ? raw['conversation_id'] : '',
    status,
    steps: Array.isArray(raw['steps'])
      ? raw['steps'].flatMap((s) => {
          if (typeof s !== 'object' || s === null) return [];
          const sr = s as Record<string, unknown>;
          return [{
            id: typeof sr['id'] === 'string' ? sr['id'] : '',
            type: (sr['type'] as AgentSession['steps'][number]['type']) ?? 'observation',
            description: typeof sr['description'] === 'string' ? sr['description'] : '',
            toolId: typeof sr['tool_id'] === 'string' ? sr['tool_id'] : undefined,
            toolArgs: typeof sr['tool_args'] === 'object' ? (sr['tool_args'] as Record<string, unknown>) : undefined,
            result: typeof sr['result'] === 'string' ? sr['result'] : undefined,
            status: (sr['status'] as AgentSession['steps'][number]['status']) ?? 'pending',
            startedAt: typeof sr['started_at'] === 'number' ? sr['started_at'] : undefined,
            completedAt: typeof sr['completed_at'] === 'number' ? sr['completed_at'] : undefined,
          }];
        })
      : [],
    goal: typeof raw['goal'] === 'string' ? raw['goal'] : '',
    startedAt: typeof raw['started_at'] === 'number' ? raw['started_at'] : Date.now(),
    completedAt: typeof raw['completed_at'] === 'number' ? raw['completed_at'] : undefined,
    result: typeof raw['result'] === 'string' ? raw['result'] : undefined,
    error: typeof raw['error'] === 'string' ? raw['error'] : undefined,
  };
}

/**
 * AgentEngine manages agent lifecycle on the frontend.
 */
export class AgentEngine {
  private readonly config = DEFAULT_AI_CONFIG;

  async listAgents(): Promise<AIResult<AgentDefinition[]>> {
    const url = `${this.config.backend.baseUrl}${this.config.backend.agentPath}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'AGENT_FAILED', message: 'Failed to load agents.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as unknown[];
      return {
        success: true,
        data: raw
          .filter((a): a is Record<string, unknown> => typeof a === 'object' && a !== null)
          .map(normalizeAgentDefinition),
      };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot load agents.', timestamp: Date.now() },
      };
    }
  }

  async startSession(
    agentId: string,
    goal: string,
    conversationId: string,
  ): Promise<AIResult<AgentSession>> {
    const url = `${this.config.backend.baseUrl}${this.config.backend.agentPath}/sessions`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId, goal, conversation_id: conversationId }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'AGENT_FAILED', message: 'Failed to start agent session.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as Record<string, unknown>;
      return { success: true, data: normalizeAgentSession(raw) };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot start agent session.', timestamp: Date.now() },
      };
    }
  }

  async getSession(sessionId: string): Promise<AIResult<AgentSession>> {
    const url = `${this.config.backend.baseUrl}${this.config.backend.agentPath}/sessions/${encodeURIComponent(sessionId)}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'AGENT_FAILED', message: 'Agent session not found.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as Record<string, unknown>;
      return { success: true, data: normalizeAgentSession(raw) };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot fetch agent session.', timestamp: Date.now() },
      };
    }
  }

  async cancelSession(sessionId: string): Promise<AIResult<void>> {
    const url = `${this.config.backend.baseUrl}${this.config.backend.agentPath}/sessions/${encodeURIComponent(sessionId)}/cancel`;
    try {
      const res = await fetch(url, { method: 'POST', signal: AbortSignal.timeout(10_000) });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'AGENT_FAILED', message: 'Failed to cancel agent session.', timestamp: Date.now() },
        };
      }
      return { success: true, data: undefined };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot cancel agent session.', timestamp: Date.now() },
      };
    }
  }
}

export { normalizeAgentDefinition, normalizeAgentSession };
export const agentEngine = new AgentEngine();
