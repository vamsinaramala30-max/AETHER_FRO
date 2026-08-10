// ============================================================================
// AETHER AI — useAgent Hook
// ============================================================================

import { useCallback, useEffect } from 'react';
import { useAIStore } from '../ai-store';
import { agentService } from '../services/agent-service';
import type { AgentDefinition, AgentSession, AgentStatus } from '../ai-types';

export interface UseAgentReturn {
  availableAgents: AgentDefinition[];
  activeAgent: AgentDefinition | null;
  activeSession: AgentSession | null;
  agentStatus: AgentStatus | null;
  isActive: boolean;

  loadAgents: () => Promise<void>;
  setActiveAgent: (agent: AgentDefinition | null) => void;
  startSession: (agentId: string, goal: string, conversationId: string) => Promise<void>;
  cancelSession: () => Promise<void>;
}

/**
 * useAgent — agent state and session management hook.
 */
export function useAgent(): UseAgentReturn {
  const availableAgents = useAIStore((s) => s.availableAgents);
  const activeAgent = useAIStore((s) => s.activeAgent);
  const activeSession = useAIStore((s) => s.activeAgentSession);

  const setAvailableAgents = useAIStore((s) => s.setAvailableAgents);
  const setActiveAgentStore = useAIStore((s) => s.setActiveAgent);
  const setActiveAgentSession = useAIStore((s) => s.setActiveAgentSession);
  const setError = useAIStore((s) => s.setError);

  const agentStatus = activeSession?.status ?? null;
  const isActive =
    agentStatus === 'planning' || agentStatus === 'running' || agentStatus === 'waiting';

  const loadAgents = useCallback(async () => {
    const result = await agentService.listAgents();
    if (!result.success) {
      setError(result.error);
      return;
    }
    setAvailableAgents(result.data);
  }, [setAvailableAgents, setError]);

  useEffect(() => {
    void loadAgents();
  }, [loadAgents]);

  const setActiveAgent = useCallback(
    (agent: AgentDefinition | null) => {
      setActiveAgentStore(agent);
    },
    [setActiveAgentStore],
  );

  const startSession = useCallback(
    async (agentId: string, goal: string, conversationId: string) => {
      const result = await agentService.startSession(agentId, goal, conversationId);
      if (!result.success) {
        setError(result.error);
        return;
      }

      setActiveAgentSession(result.data);

      // Watch for updates
      agentService.watchSession(result.data.sessionId, {
        onUpdate: (session) => {
          setActiveAgentSession(session);
        },
        onComplete: (session) => {
          setActiveAgentSession(session);
        },
        onError: (errorMessage) => {
          setError({
            code: 'AGENT_FAILED',
            message: errorMessage,
            timestamp: Date.now(),
          });
        },
      });
    },
    [setActiveAgentSession, setError],
  );

  const cancelSession = useCallback(async () => {
    const sessionId = activeSession?.sessionId;
    if (!sessionId) return;

    agentService.stopWatching();
    const result = await agentService.cancelSession(sessionId);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setActiveAgentSession(null);
  }, [activeSession, setActiveAgentSession, setError]);

  return {
    availableAgents,
    activeAgent,
    activeSession,
    agentStatus,
    isActive,
    loadAgents,
    setActiveAgent,
    startSession,
    cancelSession,
  };
}
