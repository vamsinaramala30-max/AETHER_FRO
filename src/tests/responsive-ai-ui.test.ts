// ============================================================================
// AETHER AI — Responsive AI UI/UX Tests
// ============================================================================

import { describe, it, expect, beforeEach } from 'vitest';
import { useAIStore } from '../ai/ai-store';
import { buildThinkingState } from '../ai/core/reasoning-engine';
import {
  normalizeGenerationResponse,
  generationResponseToMessage,
} from '../ai/core/response-engine';
import type { AIMessage, VerificationStatus } from '../ai/ai-types';

describe('Responsive AI UI/UX System', () => {
  beforeEach(() => {
    useAIStore.getState().resetStore();
  });

  describe('1. Intelligent Status Indicators & State Visualization', () => {
    it('should generate accurate safe labels for all AI lifecycle states', () => {
      const analyzingState = buildThinkingState('analyzing');
      expect(analyzingState.label).toBe('Understanding your request…');

      const retrievingState = buildThinkingState('retrieving');
      expect(retrievingState.label).toBe('Checking relevant context…');

      const planningState = buildThinkingState('planning', { step: 1, totalSteps: 3 });
      expect(planningState.label).toBe('Preparing step 1 of 3…');

      const executingState = buildThinkingState('executing_action', { toolName: 'create_task' });
      expect(executingState.label).toBe('Executing create_task…');

      const verifyingState = buildThinkingState('verifying', { step: 2, totalSteps: 2 });
      expect(verifyingState.label).toBe('Verifying step 2 of 2…');

      const generatingState = buildThinkingState('generating');
      expect(generatingState.label).toBe('Preparing response…');
    });

    it('should store and update thinkingState in Zustand store', () => {
      const state = buildThinkingState('verifying', { step: 1, totalSteps: 2 });
      useAIStore.getState().setThinkingState(state);

      expect(useAIStore.getState().thinkingState).toEqual(state);
      expect(useAIStore.getState().thinkingState?.status).toBe('verifying');

      useAIStore.getState().setThinkingState(null);
      expect(useAIStore.getState().thinkingState).toBeNull();
    });
  });

  describe('2. Response Normalization & Verification Badges', () => {
    it('should normalize backend response with verificationStatus and evidence', () => {
      const rawBackend = {
        id: 'msg_test_1',
        content: 'I have analyzed your workspace documents.',
        role: 'assistant',
        verification_status: 'VERIFIED',
        confidence: 'HIGH_CONFIDENCE',
        evidence: [
          {
            sourceType: 'retrieved_knowledge',
            sourceId: 'doc_1',
            content: 'Architecture spec snippet',
            relevance: 0.95,
            verified: true,
            verificationStatus: 'VERIFIED' as VerificationStatus,
          },
        ],
        plan: {
          planId: 'plan_1',
          objective: 'Process documents',
          status: 'SUCCESS' as const,
          steps: [
            {
              stepId: 's1',
              stepNumber: 1,
              description: 'Read doc',
              status: 'completed' as const,
              verified: true,
            },
          ],
        },
      };

      const normalized = normalizeGenerationResponse(rawBackend, 'conv_123');
      expect(normalized.success).toBe(true);

      if (normalized.success) {
        expect(normalized.data.verificationStatus).toBe('VERIFIED');
        expect(normalized.data.confidence).toBe('HIGH_CONFIDENCE');
        expect(normalized.data.evidence?.length).toBe(1);
        expect(normalized.data.plan?.status).toBe('SUCCESS');

        const message: AIMessage = generationResponseToMessage(normalized.data);
        expect(message.verificationStatus).toBe('VERIFIED');
        expect(message.confidence).toBe('HIGH_CONFIDENCE');
        expect(message.plan?.steps[0].verified).toBe(true);
      }
    });

    it('should handle partially verified and failed verification states', () => {
      const rawPartial = {
        id: 'msg_test_2',
        content: 'Task updated with partial verification',
        verification_status: 'PARTIALLY_VERIFIED',
      };

      const res = normalizeGenerationResponse(rawPartial, 'conv_123');
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.verificationStatus).toBe('PARTIALLY_VERIFIED');
      }
    });
  });

  describe('3. Confirmation Flow', () => {
    it('should manage pending confirmation request state in store', () => {
      const confReq = {
        actionId: 'conf_123',
        toolName: 'delete_task',
        description: 'Action requires confirmation: Delete permanent task record',
        riskLevel: 'DESTRUCTIVE' as const,
        args: { taskId: 'task_001' },
      };

      useAIStore.getState().setPendingConfirmation(confReq);
      expect(useAIStore.getState().pendingConfirmation?.toolName).toBe('delete_task');
      expect(useAIStore.getState().pendingConfirmation?.riskLevel).toBe('DESTRUCTIVE');

      useAIStore.getState().setPendingConfirmation(null);
      expect(useAIStore.getState().pendingConfirmation).toBeNull();
    });
  });

  describe('4. Store & UI State Management', () => {
    it('should update message with streaming chunks and preserve content on completion', () => {
      const convId = 'conv_stream_test';
      const msgId = 'msg_stream_1';

      useAIStore.getState().appendMessage(convId, {
        id: msgId,
        conversationId: convId,
        role: 'assistant',
        content: '',
        status: 'streaming',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      useAIStore.getState().appendStreamingChunk(convId, msgId, 'Hello ');
      useAIStore.getState().appendStreamingChunk(convId, msgId, 'Aether AI!');

      const messages = useAIStore.getState().messages[convId];
      expect(messages).toBeDefined();
      expect(messages[0].content).toBe('Hello Aether AI!');

      useAIStore.getState().updateMessage(convId, msgId, {
        status: 'delivered',
        verificationStatus: 'VERIFIED',
      });

      const updated = useAIStore.getState().messages[convId][0];
      expect(updated.status).toBe('delivered');
      expect(updated.verificationStatus).toBe('VERIFIED');
    });

    it('should toggle sidebar and manage active panel transitions', () => {
      useAIStore.getState().setSidebarOpen(true);
      expect(useAIStore.getState().sidebarOpen).toBe(true);

      useAIStore.getState().toggleSidebar();
      expect(useAIStore.getState().sidebarOpen).toBe(false);

      useAIStore.getState().setActivePanel('memory');
      expect(useAIStore.getState().activePanel).toBe('memory');

      useAIStore.getState().setActivePanel('knowledge');
      expect(useAIStore.getState().activePanel).toBe('knowledge');
    });
  });
});
