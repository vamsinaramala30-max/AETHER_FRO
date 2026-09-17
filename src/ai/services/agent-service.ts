// ============================================================================
// AETHER AI — Agent Service
// ============================================================================

import type { AgentDefinition, AgentSession, AIResult } from '../ai-types';
import { agentEngine } from '../agents/agent-engine';
import { agentLoop } from '../agents/agent-loop';
import type {
  AgentLoopCompleteHandler,
  AgentLoopUpdateHandler,
  AgentLoopErrorHandler,
} from '../agents/agent-loop';

/**
 * AgentService isolates all agent backend operations from UI components.
 */
export class AgentService {
  async listAgents(): Promise<AIResult<AgentDefinition[]>> {
    return agentEngine.listAgents();
  }

  async startSession(
    agentId: string,
    goal: string,
    conversationId: string,
  ): Promise<AIResult<AgentSession>> {
    return agentEngine.startSession(agentId, goal, conversationId);
  }

  async getSession(sessionId: string): Promise<AIResult<AgentSession>> {
    return agentEngine.getSession(sessionId);
  }

  async cancelSession(sessionId: string): Promise<AIResult<void>> {
    return agentEngine.cancelSession(sessionId);
  }

  async approveStep(sessionId: string, stepId: string): Promise<AIResult<void>> {
    return agentEngine.approveStep(sessionId, stepId);
  }

  async provideInput(sessionId: string, stepId: string, input: Record<string, unknown>): Promise<AIResult<void>> {
    return agentEngine.provideInput(sessionId, stepId, input);
  }

  /**
   * Start polling for agent session updates.
   */
  watchSession(
    sessionId: string,
    handlers: {
      onUpdate: AgentLoopUpdateHandler;
      onComplete: AgentLoopCompleteHandler;
      onError: AgentLoopErrorHandler;
    },
  ): void {
    agentLoop.start({ sessionId, ...handlers });
  }

  /**
   * Stop the session polling loop.
   */
  stopWatching(): void {
    agentLoop.stop();
  }
}

export const agentService = new AgentService();
