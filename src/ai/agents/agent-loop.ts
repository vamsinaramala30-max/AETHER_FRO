// ============================================================================
// AETHER AI — Agent Loop (Frontend Polling State)
// ============================================================================
// Manages the frontend polling loop for agent session status updates.
// ============================================================================

import type { AgentSession } from '../ai-types';
import { agentEngine } from './agent-engine';
import { isAgentActive } from './agent-types';

export type AgentLoopUpdateHandler = (session: AgentSession) => void;
export type AgentLoopCompleteHandler = (session: AgentSession) => void;
export type AgentLoopErrorHandler = (error: string) => void;

export interface AgentLoopOptions {
  sessionId: string;
  pollIntervalMs?: number;
  maxDurationMs?: number;
  onUpdate: AgentLoopUpdateHandler;
  onComplete: AgentLoopCompleteHandler;
  onError: AgentLoopErrorHandler;
}

/**
 * AgentLoop polls the backend for agent session status updates.
 * The frontend does NOT run the agent — it only observes backend state.
 */
export class AgentLoop {
  private timerId: ReturnType<typeof setInterval> | null = null;
  private startedAt = 0;
  private active = false;

  start(opts: AgentLoopOptions): void {
    if (this.active) return;
    this.active = true;
    this.startedAt = Date.now();

    const pollInterval = opts.pollIntervalMs ?? 2_000;
    const maxDuration = opts.maxDurationMs ?? 300_000;

    const poll = async (): Promise<void> => {
      if (!this.active) return;

      const elapsed = Date.now() - this.startedAt;
      if (elapsed > maxDuration) {
        this.stop();
        opts.onError('Agent session timed out.');
        return;
      }

      const result = await agentEngine.getSession(opts.sessionId);
      if (!result.success) {
        // Transient error — keep polling
        return;
      }

      const session = result.data;
      opts.onUpdate(session);

      if (!isAgentActive(session.status)) {
        this.stop();
        opts.onComplete(session);
      }
    };

    // Initial poll immediately
    void poll();
    this.timerId = setInterval(() => { void poll(); }, pollInterval);
  }

  stop(): void {
    this.active = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  get isActive(): boolean {
    return this.active;
  }
}

export const agentLoop = new AgentLoop();
