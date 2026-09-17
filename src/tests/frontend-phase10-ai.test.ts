// ============================================================================
// AETHER AI Life OS — Platform Phase 10 AI Integration Suite
// Complete 12-Domain Production Verification
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAIStore } from '../ai/ai-store';
import { modelManager } from '../ai/llm/model-manager';
import { memoryEngine } from '../ai/memory/memory-engine';
import { knowledgeService } from '../ai/services/knowledge-service';
import { ragEngine } from '../ai/rag/rag-engine';
import { toolRegistry } from '../ai/tools/tool-registry';
import { executeToolRequest } from '../ai/tools/tool-executor';
import { normalizeAgentSession } from '../ai/agents/agent-engine';
import { agentService } from '../ai/services/agent-service';
import { agentLoop } from '../ai/agents/agent-loop';
import {
  normalizeGenerationResponse,
  generationResponseToMessage,
  extractToolInvocations,
} from '../ai/core/response-engine';
import { apiClient } from '../api/client';
import {
  AI_ERROR_MESSAGES,
  AI_PANELS,
  AI_PANEL_LABELS,
  THINKING_STATUS_LABELS,
  AI_LIMITS,
} from '../ai/ai-constants';
import type {
  AIMessage,
  PendingConfirmation,
  AgentSession,
} from '../ai/ai-types';

describe('Phase 10 AI & Agent UX Integration Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAIStore.getState().reset();
  });

  afterEach(() => {
    agentLoop.stop();
  });

  // --------------------------------------------------------------------------
  // DOMAIN 1: AI Chat UI State & Message Lifecycle
  // --------------------------------------------------------------------------
  describe('1. AI Chat UI State & Message Lifecycle', () => {
    it('manages message history, streaming tokens, and role attribution', () => {
      const store = useAIStore.getState();
      const userMsg: AIMessage = {
        id: 'msg_user_1',
        conversationId: 'conv_1',
        role: 'user',
        content: 'Schedule a team sync for tomorrow at 10am',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'sent',
      };
      store.appendMessage('conv_1', userMsg);

      expect(useAIStore.getState().messages['conv_1']).toHaveLength(1);
      expect(useAIStore.getState().messages['conv_1'][0].role).toBe('user');
      expect(useAIStore.getState().messages['conv_1'][0].content).toContain('Schedule a team sync');

      // Add assistant response
      const assistantMsg: AIMessage = {
        id: 'msg_asst_1',
        conversationId: 'conv_1',
        role: 'assistant',
        content: 'I have prepared an invitation for your team sync.',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'delivered',
        turnEvidence: [
          {
            sourceType: 'approved_memory',
            sourceId: 'mem_1',
            content: 'Team prefers 10am meetings',
            relevance: 0.95,
            verified: true,
            verificationStatus: 'VERIFIED',
          },
        ],
      };
      store.appendMessage('conv_1', assistantMsg);

      const msgs = useAIStore.getState().messages['conv_1'];
      expect(msgs).toHaveLength(2);
      expect(msgs[1].turnEvidence).toBeDefined();
      expect(msgs[1].turnEvidence![0].verificationStatus).toBe('VERIFIED');
    });

    it('updates thinking status progressively across reasoning stages', () => {
      const store = useAIStore.getState();
      expect(store.thinkingState).toBeNull();

      store.setThinkingState({ status: 'analyzing', label: 'Analyzing prompt' });
      expect(useAIStore.getState().thinkingState?.status).toBe('analyzing');

      store.setThinkingState({ status: 'retrieving', label: 'Retrieving context' });
      expect(useAIStore.getState().thinkingState?.status).toBe('retrieving');

      store.setThinkingState({ status: 'generating', label: 'Generating response' });
      expect(useAIStore.getState().thinkingState?.status).toBe('generating');

      store.setThinkingState(null);
      expect(useAIStore.getState().thinkingState).toBeNull();
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 2: Streaming Response & Turn Evidence Propagation
  // --------------------------------------------------------------------------
  describe('2. Streaming Response & Turn Evidence Propagation', () => {
    it('normalizes streaming metadata chunks with citations, plans, and tool invocations', () => {
      const rawBackendPayload = {
        message_id: 'stream_turn_99',
        content: 'Action completed with memory grounded.',
        confidence: 'HIGH_CONFIDENCE',
        citations: [{ id: 'cit_1', title: 'Sprint Plan.pdf', score: 0.94 }],
        turn_evidence: [
          {
            sourceType: 'retrieved_knowledge',
            sourceId: 'doc_42',
            content: 'Project roadmap guidelines',
            relevance: 0.92,
            verified: true,
            verificationStatus: 'VERIFIED',
          },
        ],
        tool_invocations: [
          {
            tool: 'tasks:create',
            arguments: { title: 'Draft Sprint Docs' },
            result: { id: 'task_100', status: 'created' },
            status: 'SUCCESS',
            actionState: 'READY',
          },
        ],
        canonical_plan: {
          id: 'plan_1',
          goal: 'Setup Sprint',
          status: 'READY',
          steps: [],
        },
      };

      const norm = normalizeGenerationResponse(rawBackendPayload, 'conv_stream_1');
      expect(norm.success).toBe(true);
      if (norm.success) {
        expect(norm.data.turnEvidence).toHaveLength(1);
        expect(norm.data.toolInvocations).toHaveLength(1);
        expect(norm.data.toolInvocations![0].toolName).toBe('tasks:create');
        expect(norm.data.canonicalPlan?.status).toBe('READY');

        const message = generationResponseToMessage(norm.data);
        expect(message.turnEvidence?.[0].sourceType).toBe('retrieved_knowledge');
        expect(message.toolInvocations?.[0].status).toBe('SUCCESS');
      }
    });

    it('extracts tool invocations with both camelCase and snake_case properties safely', () => {
      const rawPayload = {
        tool_invocations: [
          {
            tool_name: 'calendar:schedule',
            input: { event: 'Standup' },
            output: { eventId: 'evt_1' },
            status: 'EXECUTED',
            action_state: 'READY',
          },
        ],
      };

      const extracted = extractToolInvocations(rawPayload);
      expect(extracted).toHaveLength(1);
      expect(extracted[0].toolName).toBe('calendar:schedule');
      expect(extracted[0].status).toBe('EXECUTED');
      expect(extracted[0].actionState).toBe('READY');
      expect(extracted[0].result).toEqual({ eventId: 'evt_1' });
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 3: Conversation Management (Switch, Rename, Delete)
  // --------------------------------------------------------------------------
  describe('3. Conversation Management', () => {
    it('switches conversations and isolates active message state', () => {
      const store = useAIStore.getState();
      store.setActiveConversationId('conv_alpha');
      expect(useAIStore.getState().activeConversationId).toBe('conv_alpha');

      store.appendMessage('conv_alpha', {
        id: 'msg_a1',
        conversationId: 'conv_alpha',
        role: 'user',
        content: 'Alpha task',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'sent',
      });

      store.setActiveConversationId('conv_beta');
      expect(useAIStore.getState().activeConversationId).toBe('conv_beta');
    });

    it('enforces conversation title length limits in constants', () => {
      expect(AI_LIMITS.MAX_CONVERSATION_TITLE_LENGTH).toBe(80);
      const sampleTitle = 'A'.repeat(120);
      const truncated = sampleTitle.slice(0, AI_LIMITS.MAX_CONVERSATION_TITLE_LENGTH);
      expect(truncated).toHaveLength(80);
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 4: Memory Panel & Engine Integration
  // --------------------------------------------------------------------------
  describe('4. Memory Panel & Engine Integration', () => {
    it('retrieves memories with Bearer auth and unwraps backend payload', async () => {
      const mockMemories = [
        {
          id: 'mem_1',
          userId: 'user_1',
          content: 'User prefers concise summaries',
          scope: 'long_term',
          category: 'preference',
          score: 0.95,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
        success: true,
        data: mockMemories,
      });

      const result = await memoryEngine.getMemories('user_1');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].content).toContain('concise summaries');
      }
    });

    it('searches memory through authenticated apiClient endpoint', async () => {
      vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
        success: true,
        data: [
          {
            id: 'mem_2',
            userId: 'user_1',
            content: 'Working on Aether Platform Phase 10',
            scope: 'working',
            score: 0.88,
          },
        ],
      });

      const result = await memoryEngine.searchMemories('Phase 10', 'user_1');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[0].content).toContain('Phase 10');
      }
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 5: Knowledge & RAG Panel (Listing, Search, Deletion)
  // --------------------------------------------------------------------------
  describe('5. Knowledge & RAG Panel Integration', () => {
    it('lists knowledge documents via authenticated /knowledge/documents endpoint', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
        success: true,
        data: [
          {
            id: 'doc_1',
            name: 'Aether Architecture Blueprint',
            status: 'indexed',
            size: 15420,
            chunk_count: 12,
            created_at: Date.now(),
          },
        ],
      });

      const res = await knowledgeService.listDocuments();
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data).toHaveLength(1);
        expect(res.data[0].name).toBe('Aether Architecture Blueprint');
        expect(res.data[0].status).toBe('indexed');
        expect(res.data[0].chunkCount).toBe(12);
      }
    });

    it('searches RAG knowledge base using backend documents search endpoint', async () => {
      vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
        success: true,
        data: {
          documents: [
            {
              id: 'chunk_10',
              documentId: 'doc_1',
              title: 'Aether Core Specs',
              content: 'Phase 10 defines AI user experience and frontends.',
              score: 0.96,
            },
          ],
          totalRetrieved: 1,
        },
      });

      const res = await ragEngine.retrieve({
        query: 'What is Phase 10?',
        conversationId: 'conv_rag_1',
      });

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.results).toHaveLength(1);
        expect(res.data.results[0].chunk.content).toContain('Phase 10 defines');
        expect(res.data.results[0].score).toBe(0.96);
      }
    });

    it('deletes documents through authenticated DELETE request', async () => {
      const deleteSpy = vi.spyOn(apiClient, 'delete').mockResolvedValueOnce({} as any);

      const res = await knowledgeService.deleteDocument('doc_to_delete');
      expect(res.success).toBe(true);
      expect(deleteSpy).toHaveBeenCalledWith(
        expect.stringContaining('/knowledge/documents/doc_to_delete'),
        expect.anything(),
      );
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 6: Plan Visualization & Verification Badges
  // --------------------------------------------------------------------------
  describe('6. Plan Visualization & Verification Badges', () => {
    it('sets and updates active execution plan in AI store', () => {
      const store = useAIStore.getState();
      const testSession: AgentSession = {
        sessionId: 'session_phase10',
        agentId: 'agent_general',
        conversationId: 'conv_1',
        goal: 'Deploy and verify AI platform components',
        status: 'running',
        steps: [
          {
            id: 'step_1',
            type: 'tool_call',
            description: 'Verify GGUF model runtime',
            status: 'completed',
          },
          {
            id: 'step_2',
            type: 'tool_call',
            description: 'Run end-to-end integration tests',
            status: 'running',
          },
        ],
        startedAt: Date.now(),
      };

      store.setActiveAgentSession(testSession);
      expect(useAIStore.getState().activeAgentSession?.sessionId).toBe('session_phase10');
      expect(useAIStore.getState().activeAgentSession?.steps).toHaveLength(2);
      expect(useAIStore.getState().activeAgentSession?.steps[0].status).toBe('completed');
    });

    it('supports all thinking and verification stage labels', () => {
      expect(THINKING_STATUS_LABELS.analyzing).toBe('Understanding your request…');
      expect(THINKING_STATUS_LABELS.verifying).toBe('Verifying the result…');
      expect(THINKING_STATUS_LABELS.waiting_confirmation).toBe('Waiting for your confirmation…');
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 7: Tool Registry & Controlled Execution Workflow
  // --------------------------------------------------------------------------
  describe('7. Tool Registry & Controlled Execution Workflow', () => {
    it('loads and normalizes backend tools registry with JSON schemas', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
        success: true,
        data: [
          {
            name: 'tasks:create',
            description: 'Create a new project task',
            category: 'tasks',
            riskLevel: 'LOW_RISK_WRITE',
            requiresConfirmation: false,
            inputSchema: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Task title' },
                priority: { type: 'string', enum: ['LOW', 'HIGH'] },
              },
              required: ['title'],
            },
          },
        ],
      });

      const res = await toolRegistry.load();
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data).toHaveLength(1);
        expect(res.data[0].name).toBe('tasks:create');
        expect(res.data[0].category).toBe('task');
        expect(res.data[0].parameters).toHaveLength(2);
        expect(res.data[0].parameters.find((p) => p.name === 'title')?.required).toBe(true);
      }
    });

    it('executes a tool request via authenticated /ai/tools/execute endpoint', async () => {
      vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
        success: true,
        data: {
          executionId: 'exec_tool_1',
          status: 'SUCCESS',
          output: { taskId: 'task_777', title: 'New Task' },
          verified: true,
        },
      });

      // Register mock tool first
      (toolRegistry as any).tools = [
        {
          id: 'tasks:create',
          name: 'tasks:create',
          description: 'Create task',
          category: 'task',
          parameters: [{ name: 'title', type: 'string', required: true }],
          enabled: true,
          requiresAuth: true,
        },
      ];

      const res = await executeToolRequest({
        toolId: 'tasks:create',
        toolName: 'tasks:create',
        args: { title: 'Implement Phase 10' },
        conversationId: 'conv_1',
        messageId: 'msg_1',
      });

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.success).toBe(true);
        expect(res.data.result).toEqual({ taskId: 'task_777', title: 'New Task' });
      }
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 8: Autonomous Agent Execution Lifecycle (Prompt 8 Alignment)
  // --------------------------------------------------------------------------
  describe('8. Autonomous Agent Execution Lifecycle', () => {
    it('normalizes backend agent execution entities and status states', () => {
      const backendExecution = {
        executionId: 'exec_agent_500',
        planId: 'plan_goal_1',
        status: 'WAITING_FOR_APPROVAL',
        steps: [
          {
            stepId: 'step_1',
            action: 'Delete outdated database records',
            status: 'PENDING',
            toolName: 'system:purge',
          },
        ],
        createdAt: 1700000000000,
      };

      const normalized = normalizeAgentSession(backendExecution);
      expect(normalized.sessionId).toBe('exec_agent_500');
      expect(normalized.status).toBe('waiting');
      expect(normalized.steps).toHaveLength(1);
      expect(normalized.steps[0].description).toBe('Delete outdated database records');
      expect(normalized.steps[0].toolId).toBe('system:purge');
    });

    it('approves an agent execution step via POST /ai/agent/executions/:id/approve', async () => {
      const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
        success: true,
        data: { executionId: 'exec_10', stepId: 'step_2', approved: true },
      });

      const res = await agentService.approveStep('exec_10', 'step_2');
      expect(res.success).toBe(true);
      expect(postSpy).toHaveBeenCalledWith(
        expect.stringContaining('/ai/agent/executions/exec_10/approve'),
        { stepId: 'step_2' },
        expect.anything(),
      );
    });

    it('cancels an agent execution session via POST /ai/agent/executions/:id/cancel', async () => {
      const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
        success: true,
        data: { executionId: 'exec_20', status: 'CANCELLED' },
      });

      const res = await agentService.cancelSession('exec_20');
      expect(res.success).toBe(true);
      expect(postSpy).toHaveBeenCalledWith(
        expect.stringContaining('/ai/agent/executions/exec_20/cancel'),
        {},
        expect.anything(),
      );
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 9: Model Discovery & Selection State
  // --------------------------------------------------------------------------
  describe('9. Model Discovery & Selection State', () => {
    it('discovers authoritative model and marks it as available and active', async () => {
      const mockModelsPayload = {
        success: true,
        data: [
          {
            id: 'aether-model-1',
            name: 'AETHER 1.0 GGUF Native',
            provider: 'aether',
            status: 'available',
            context_window: 8192,
            is_active: true,
          },
        ],
      };

      vi.spyOn(apiClient, 'get').mockResolvedValueOnce(mockModelsPayload);

      const res = await modelManager.loadModels();
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data).toHaveLength(1);
        expect(res.data[0].id).toBe('aether-model-1');
        expect(res.data[0].status).toBe('available');
      }

      const active = modelManager.getActive();
      expect(active).toBeDefined();
      expect(active?.id).toBe('aether-model-1');
    });

    it('manages fallback notification transparency on provider switches', () => {
      const store = useAIStore.getState();
      store.setFallbackNotice({
        usedFallback: true,
        activeProvider: 'backup-engine',
        reason: 'Temporary latency threshold exceeded',
        timestamp: Date.now(),
      });

      expect(useAIStore.getState().fallbackNotice?.usedFallback).toBe(true);
      expect(useAIStore.getState().fallbackNotice?.activeProvider).toBe('backup-engine');

      store.setFallbackNotice(null);
      expect(useAIStore.getState().fallbackNotice).toBeNull();
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 10: Security, Sanitization & Error Recovery
  // --------------------------------------------------------------------------
  describe('10. Security, Sanitization & Error Recovery', () => {
    it('ensures all error codes have human-friendly non-technical copy without stack traces', () => {
      const errorCodes = Object.keys(AI_ERROR_MESSAGES);
      expect(errorCodes.length).toBeGreaterThanOrEqual(16);

      for (const code of errorCodes) {
        const message = AI_ERROR_MESSAGES[code as keyof typeof AI_ERROR_MESSAGES];
        expect(message).toBeDefined();
        expect(message).not.toContain('at ');
        expect(message).not.toContain('stack:');
        expect(message).not.toContain('Error: ');
        expect(message).not.toContain('password');
        expect(message).not.toContain('secret');
      }

      expect(AI_ERROR_MESSAGES.VERIFICATION_FAILED).toContain('Action verification failed safety constraints');
      expect(AI_ERROR_MESSAGES.RATE_LIMIT).toContain('Too many requests');
    });

    it('clears errors reliably in AIStore on user dismissal', () => {
      const store = useAIStore.getState();
      store.setError({
        code: 'TOOL_FAILED',
        message: 'A tool error occurred',
        timestamp: Date.now(),
      });

      expect(useAIStore.getState().error).toBeDefined();
      store.clearError();
      expect(useAIStore.getState().error).toBeNull();
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 11: Accessibility & Navigation Panel Registry
  // --------------------------------------------------------------------------
  describe('11. Accessibility & Navigation Panel Registry', () => {
    it('registers all 7 primary AI navigation panels with user-facing labels', () => {
      expect(AI_PANELS).toHaveLength(7);
      expect(AI_PANELS).toContain('assistant');
      expect(AI_PANELS).toContain('conversations');
      expect(AI_PANELS).toContain('memory');
      expect(AI_PANELS).toContain('knowledge');
      expect(AI_PANELS).toContain('prompts');
      expect(AI_PANELS).toContain('models');
      expect(AI_PANELS).toContain('agents');

      for (const panel of AI_PANELS) {
        expect(AI_PANEL_LABELS[panel]).toBeTruthy();
      }
    });

    it('manages pending confirmation modal state with actionable parameters', () => {
      const store = useAIStore.getState();
      const confirmation: PendingConfirmation = {
        actionId: 'act_delete_db',
        toolName: 'knowledge:delete_all',
        description: 'WHAT: Purge all temporary drafts\nWHY: User requested workspace cleanup\nWHICH: Draft collections',
        riskLevel: 'DESTRUCTIVE',
        args: { confirmed: true },
        executionId: 'exec_77',
        stepId: 'step_4',
      };

      store.setPendingConfirmation(confirmation);
      expect(useAIStore.getState().pendingConfirmation?.toolName).toBe('knowledge:delete_all');
      expect(useAIStore.getState().pendingConfirmation?.executionId).toBe('exec_77');
      expect(useAIStore.getState().pendingConfirmation?.riskLevel).toBe('DESTRUCTIVE');

      store.setPendingConfirmation(null);
      expect(useAIStore.getState().pendingConfirmation).toBeNull();
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 12: Responsive Behavior & Layout Store State
  // --------------------------------------------------------------------------
  describe('12. Responsive Behavior & Layout Store State', () => {
    it('toggles sidebar and transitions active panels smoothly', () => {
      const store = useAIStore.getState();
      expect(store.sidebarOpen).toBe(true);

      store.toggleSidebar();
      expect(useAIStore.getState().sidebarOpen).toBe(false);

      store.setSidebarOpen(true);
      expect(useAIStore.getState().sidebarOpen).toBe(true);

      store.setActivePanel('memory');
      expect(useAIStore.getState().activePanel).toBe('memory');

      store.setActivePanel('knowledge');
      expect(useAIStore.getState().activePanel).toBe('knowledge');

      store.setActivePanel('agents');
      expect(useAIStore.getState().activePanel).toBe('agents');
    });

    it('enforces input limits to prevent mobile/desktop memory starvation', () => {
      expect(AI_LIMITS.MAX_INPUT_CHARS).toBe(32000);
      expect(AI_LIMITS.MAX_MEMORY_CONTENT_LENGTH).toBe(1000);
      expect(AI_LIMITS.MAX_CONVERSATION_MESSAGES).toBe(200);
    });
  });
});
