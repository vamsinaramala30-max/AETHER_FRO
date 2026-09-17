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

import { apiClient } from '../../api/client';

function normalizeAgentSession(raw: Record<string, unknown>): AgentSession {
  const validStatuses: AgentStatus[] = [
    'idle',
    'planning',
    'running',
    'waiting',
    'completed',
    'failed',
    'cancelled',
  ];
  const rawStatus = String(raw['status'] || '').toLowerCase();
  let status: AgentStatus = 'idle';
  if (validStatuses.includes(rawStatus as AgentStatus)) {
    status = rawStatus as AgentStatus;
  } else if (rawStatus === 'waiting_for_approval' || rawStatus === 'waiting_for_input') {
    status = 'waiting';
  } else if (rawStatus === 'blocked') {
    status = 'failed';
  } else if (rawStatus === 'partially_completed') {
    status = 'completed';
  } else if (rawStatus === 'pending') {
    status = 'planning';
  }

  const sessionId = typeof raw['sessionId'] === 'string'
    ? raw['sessionId']
    : (typeof raw['session_id'] === 'string'
    ? raw['session_id']
    : (typeof raw['executionId'] === 'string'
    ? raw['executionId']
    : (typeof raw['id'] === 'string' ? raw['id'] : '')));

  const agentId = typeof raw['agentId'] === 'string'
    ? raw['agentId']
    : (typeof raw['agent_id'] === 'string'
    ? raw['agent_id']
    : (typeof raw['planId'] === 'string' ? raw['planId'] : 'agent_default'));

  return {
    sessionId,
    agentId,
    conversationId: typeof raw['conversationId'] === 'string'
      ? raw['conversationId']
      : (typeof raw['conversation_id'] === 'string' ? raw['conversation_id'] : ''),
    status,
    steps: Array.isArray(raw['steps'])
      ? raw['steps'].flatMap((s) => {
          if (typeof s !== 'object' || s === null) return [];
          const sr = s as Record<string, unknown>;
          const stepStatus = String(sr['status'] || '').toLowerCase();
          const mappedStatus = (['pending', 'running', 'completed', 'failed', 'skipped'].includes(stepStatus))
            ? (stepStatus as AgentSession['steps'][number]['status'])
            : 'pending';

          return [
            {
              id: typeof sr['id'] === 'string' ? sr['id'] : (typeof sr['stepId'] === 'string' ? sr['stepId'] : ''),
              type: (sr['type'] as AgentSession['steps'][number]['type']) ?? 'action',
              description: typeof sr['description'] === 'string'
                ? sr['description']
                : (typeof sr['action'] === 'string' ? sr['action'] : ''),
              toolId: typeof sr['tool_id'] === 'string'
                ? sr['tool_id']
                : (typeof sr['toolName'] === 'string' ? sr['toolName'] : undefined),
              toolArgs: typeof sr['tool_args'] === 'object' && sr['tool_args'] !== null
                ? (sr['tool_args'] as Record<string, unknown>)
                : (typeof sr['input'] === 'object' && sr['input'] !== null ? (sr['input'] as Record<string, unknown>) : undefined),
              result: typeof sr['result'] === 'string'
                ? sr['result']
                : (sr['output'] ? (typeof sr['output'] === 'string' ? sr['output'] : JSON.stringify(sr['output'])) : undefined),
              status: mappedStatus,
              startedAt: typeof sr['started_at'] === 'number' ? sr['started_at'] : (typeof sr['startedAt'] === 'number' ? sr['startedAt'] : undefined),
              completedAt: typeof sr['completed_at'] === 'number' ? sr['completed_at'] : (typeof sr['completedAt'] === 'number' ? sr['completedAt'] : undefined),
            },
          ];
        })
      : [],
    goal: typeof raw['goal'] === 'string' ? raw['goal'] : '',
    startedAt: typeof raw['started_at'] === 'number' ? raw['started_at'] : (typeof raw['createdAt'] === 'number' ? raw['createdAt'] : Date.now()),
    completedAt: typeof raw['completed_at'] === 'number' ? raw['completed_at'] : (typeof raw['completedAt'] === 'number' ? raw['completedAt'] : undefined),
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
    try {
      const res = await apiClient.get<Record<string, unknown> | unknown[]>(
        this.config.backend.agentPath,
        { timeout: 10_000 }
      );
      let rawArray: unknown[] = [];
      if (Array.isArray(res)) {
        rawArray = res;
      } else if (res && typeof res === 'object') {
        const payload = res as Record<string, unknown>;
        if (Array.isArray(payload['data'])) {
          rawArray = payload['data'];
        } else if (Array.isArray(payload['agents'])) {
          rawArray = payload['agents'];
        }
      }
      return {
        success: true,
        data: rawArray
          .filter((a): a is Record<string, unknown> => typeof a === 'object' && a !== null)
          .map(normalizeAgentDefinition),
      };
    } catch {
      // Return authoritative default agent definition if backend is running pure execution loops
      return {
        success: true,
        data: [
          {
            id: 'agent_general',
            name: 'Aether Autonomous Agent',
            description: 'Core goal-oriented agent executing verified multistep workflows.',
            tools: [],
            maxSteps: 10,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            enabled: true,
          },
        ],
      };
    }
  }

  async startSession(
    agentId: string,
    goal: string,
    conversationId: string,
  ): Promise<AIResult<AgentSession>> {
    try {
      const res = await apiClient.post<Record<string, unknown>>(
        `${this.config.backend.agentPath}/execute`,
        {
          handoffPayload: {
            planId: `plan_${Date.now()}`,
            version: '1.0.0',
            goal,
            agentId,
          },
          conversationId,
          agent_id: agentId,
          goal,
        },
        { timeout: 30_000 }
      );

      const payload = (res && typeof res === 'object' && 'data' in res && typeof res.data === 'object' && res.data !== null)
        ? (res.data as Record<string, unknown>)
        : (res as Record<string, unknown>);

      return { success: true, data: normalizeAgentSession(payload) };
    } catch {
      return {
        success: false,
        error: {
          code: 'AGENT_FAILED',
          message: 'Cannot start agent session.',
          timestamp: Date.now(),
        },
      };
    }
  }

  async getSession(sessionId: string): Promise<AIResult<AgentSession>> {
    try {
      const res = await apiClient.get<Record<string, unknown>>(
        `${this.config.backend.agentPath}/executions/${encodeURIComponent(sessionId)}`,
        { timeout: 10_000 }
      );
      const payload = (res && typeof res === 'object' && 'data' in res && typeof res.data === 'object' && res.data !== null)
        ? (res.data as Record<string, unknown>)
        : (res as Record<string, unknown>);

      return { success: true, data: normalizeAgentSession(payload) };
    } catch {
      return {
        success: false,
        error: {
          code: 'AGENT_FAILED',
          message: 'Cannot fetch agent session.',
          timestamp: Date.now(),
        },
      };
    }
  }

  async cancelSession(sessionId: string): Promise<AIResult<void>> {
    try {
      await apiClient.post(
        `${this.config.backend.agentPath}/executions/${encodeURIComponent(sessionId)}/cancel`,
        {},
        { timeout: 10_000 }
      );
      return { success: true, data: undefined };
    } catch {
      return {
        success: false,
        error: {
          code: 'AGENT_FAILED',
          message: 'Cannot cancel agent session.',
          timestamp: Date.now(),
        },
      };
    }
  }

  async approveStep(sessionId: string, stepId: string): Promise<AIResult<void>> {
    try {
      await apiClient.post(
        `${this.config.backend.agentPath}/executions/${encodeURIComponent(sessionId)}/approve`,
        { stepId },
        { timeout: 10_000 }
      );
      return { success: true, data: undefined };
    } catch {
      return {
        success: false,
        error: {
          code: 'AGENT_FAILED',
          message: 'Failed to approve agent execution step.',
          timestamp: Date.now(),
        },
      };
    }
  }

  async provideInput(sessionId: string, stepId: string, input: Record<string, unknown>): Promise<AIResult<void>> {
    try {
      await apiClient.post(
        `${this.config.backend.agentPath}/executions/${encodeURIComponent(sessionId)}/input`,
        { stepId, input },
        { timeout: 10_000 }
      );
      return { success: true, data: undefined };
    } catch {
      return {
        success: false,
        error: {
          code: 'AGENT_FAILED',
          message: 'Failed to provide input for agent execution step.',
          timestamp: Date.now(),
        },
      };
    }
  }
}

export { normalizeAgentDefinition, normalizeAgentSession };
export const agentEngine = new AgentEngine();
