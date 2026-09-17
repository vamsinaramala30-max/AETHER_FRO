// ============================================================================
// AETHER AI — AgentPanel Component
// ============================================================================

import React, { memo } from 'react';
import type { AgentDefinition, AgentSession } from '../ai-types';
import { useAgent } from '../hooks/useAgent';
import {
  AGENT_STATUS_LABELS,
  AGENT_STATUS_COLORS,
  isAgentActive,
  isAgentFinished,
} from '../agents/agent-types';
import { buildPlannerSummary, getPlanningProgress } from '../agents/planner';

interface AgentCardProps {
  agent: AgentDefinition;
  activeSession: AgentSession | null;
  onSelect: (agent: AgentDefinition) => void;
  onCancel: () => void;
}

const AgentCard = memo<AgentCardProps>(({ agent, activeSession, onSelect, onCancel }) => {
  const isSessionAgent = activeSession?.agentId === agent.id;
  const status = isSessionAgent ? activeSession.status : 'idle';
  const isActive = isAgentActive(status);
  const isFinished = isSessionAgent && isAgentFinished(status);

  return (
    <div
      className={`rounded-xl border p-3 ${
        isSessionAgent
          ? 'border-indigo-500/40 bg-indigo-500/10'
          : 'border-slate-700/40 bg-slate-800/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700/60 text-xs font-bold text-slate-300"
          aria-hidden="true"
        >
          🤖
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-slate-200">{agent.name}</p>
          {agent.description && <p className="text-[10px] text-slate-500">{agent.description}</p>}

          {/* Status */}
          <p className={`mt-1 text-[10px] font-medium ${AGENT_STATUS_COLORS[status]}`}>
            {AGENT_STATUS_LABELS[status]}
          </p>

          {/* Planning progress */}
          {isSessionAgent && isActive && activeSession && (
            <div className="mt-2">
              <p className="text-[10px] text-slate-400">{buildPlannerSummary(activeSession)}</p>
              <div className="mt-1 h-1 w-full rounded-full bg-slate-700">
                <div
                  className="h-1 rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${getPlanningProgress(activeSession)}%` }}
                  role="progressbar"
                  aria-valuenow={getPlanningProgress(activeSession)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          )}

          {/* Result */}
          {isFinished && activeSession?.result && (
            <p className="mt-1 line-clamp-2 text-[10px] text-slate-400">{activeSession.result}</p>
          )}
        </div>

        {/* Actions */}
        <div className="shrink-0">
          {isActive && isSessionAgent ? (
            <button
              type="button"
              onClick={onCancel}
              aria-label="Cancel agent session"
              className="rounded-lg px-2 py-1 text-[10px] font-medium text-red-400 hover:bg-red-500/10 focus:outline-none"
            >
              Cancel
            </button>
          ) : !isSessionAgent && agent.enabled ? (
            <button
              type="button"
              onClick={() => onSelect(agent)}
              aria-label={`Select agent ${agent.name}`}
              className="rounded-lg px-2 py-1 text-[10px] font-medium text-indigo-400 hover:bg-indigo-500/10 focus:outline-none"
            >
              Select
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
});

AgentCard.displayName = 'AgentCard';

/**
 * AgentPanel — Displays available agents, session status, and execution state.
 * Private chain-of-thought is never exposed.
 */
export const AgentPanel = memo(() => {
  const { availableAgents, activeSession, loadAgents, setActiveAgent, cancelSession } = useAgent();

  return (
    <section className="flex flex-col gap-4" aria-labelledby="agent-panel-heading">
      <div className="flex items-center justify-between">
        <h2 id="agent-panel-heading" className="text-sm font-semibold text-slate-200">
          Agents
        </h2>
        <button
          type="button"
          onClick={() => void loadAgents()}
          aria-label="Refresh agents"
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300 focus:outline-none"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {availableAgents.length === 0 ? (
        <div className="rounded-xl border border-slate-700/40 bg-slate-800/20 p-6 text-center">
          <p className="text-xs text-slate-500">No agents configured.</p>
          <p className="mt-1 text-[11px] text-slate-600">
            Agents are configured via the AETHER backend.
          </p>
        </div>
      ) : (
        <ul className="space-y-2" role="list" aria-label="Available agents">
          {availableAgents.map((agent) => (
            <li key={agent.id}>
              <AgentCard
                agent={agent}
                activeSession={activeSession}
                onSelect={setActiveAgent}
                onCancel={() => void cancelSession()}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});

AgentPanel.displayName = 'AgentPanel';
