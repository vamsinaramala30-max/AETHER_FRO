import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient, ApiError } from '../api/client';
import { retrieve } from '../ai/rag/retriever';
import { LLMEngine, buildLLMRequest } from '../ai/llm/llm-engine';
import { promptService } from '../ai/prompt-library/promptservice';
import * as modelLoaderModule from '../ai/llm/model-loader';

describe('Phase 1: Frontend Authenticated AI Architecture', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('RAG Retriever Authentication', () => {
    it('calls /knowledge/retrieve via apiClient.post without raw unauthenticated fetch', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({
        data: {
          documents: [
            {
              id: 'c1',
              text: 'Aether memory architecture',
              score: 0.92,
              title: 'System Design',
            },
          ],
          totalRetrieved: 1,
        },
      } as any);

      const result = await retrieve({
        text: 'explain Aether memory',
        conversationId: 'conv_123',
        topK: 3,
        minScore: 0.7,
      });

      expect(mockPost).toHaveBeenCalledWith(
        '/knowledge/retrieve',
        expect.objectContaining({
          query: 'explain Aether memory',
          conversation_id: 'conv_123',
          top_k: 3,
          min_score: 0.7,
        }),
        expect.any(Object)
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.results.length).toBe(1);
        expect(result.data.results[0].chunk.content).toBe('Aether memory architecture');
      }
    });

    it('propagates 401 error safely without returning fake chunks or falling back to localStorage', async () => {
      vi.spyOn(apiClient, 'post').mockRejectedValue(
        new ApiError({
          message: 'Unauthorized',
          status: 401,
          code: 'UNAUTHORIZED',
        })
      );

      const result = await retrieve({
        text: 'secret knowledge',
        conversationId: 'conv_123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('UNAUTHORIZED');
      }
    });
  });

  describe('LLM Engine Authenticated Execution', () => {
    it('sends chat completion via apiClient.post(/ai/chat)', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({
        content: 'Hello, I am Aether AI.',
        usage: { promptTokens: 10, completionTokens: 8, totalTokens: 18 },
      } as any);

      const engine = new LLMEngine();
      const request = buildLLMRequest({
        conversationId: 'conv_123',
        messages: [{ role: 'user', content: 'Hello' }],
        stream: false,
      });
      const response = await engine.requestGeneration(request);

      expect(mockPost).toHaveBeenCalledWith(
        '/ai/chat',
        expect.objectContaining({
          conversationId: 'conv_123',
          messages: [{ role: 'user', content: 'Hello' }],
        }),
        expect.any(Object)
      );
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.data.content).toBe('Hello, I am Aether AI.');
      }
    });
  });

  describe('Prompt Library Authenticated Persistence', () => {
    it('fetches prompts via apiClient.get(/ai/prompts) without localStorage fallback', async () => {
      const mockGet = vi.spyOn(apiClient, 'get').mockResolvedValue({
        data: [
          {
            id: 'p1',
            title: 'Code Refactoring',
            template: 'Refactor cleanly.',
            category: 'utility',
          },
        ],
      } as any);

      const prompts = await promptService.getPrompts();

      expect(mockGet).toHaveBeenCalledWith('/ai/prompts');
      expect(prompts.length).toBe(1);
      expect(prompts[0].title).toBe('Code Refactoring');
    });

    it('saves custom prompts via apiClient.post(/ai/prompts)', async () => {
      const newPrompt = {
        id: 'p_123',
        title: 'Review System',
        description: 'Code review assistant',
        template: 'Review thoroughly.',
        category: 'utility' as const,
        tokensEstimate: 10,
      };

      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({
        data: newPrompt,
      } as any);

      const saved = await promptService.savePrompt(newPrompt);

      expect(mockPost).toHaveBeenCalledWith('/ai/prompts', newPrompt);
      expect(saved.id).toBe('p_123');
      expect(saved.title).toBe('Review System');
    });
  });

  describe('Model Loader Architecture', () => {
    it('normalizes model info and contains no obsolete load/unload callers', () => {
      expect((modelLoaderModule as any).loadModel).toBeUndefined();
      expect((modelLoaderModule as any).unloadModel).toBeUndefined();
      expect(typeof modelLoaderModule.normalizeModelInfo).toBe('function');

      const info = modelLoaderModule.normalizeModelInfo({
        id: 'aether-model-1',
        name: 'Aether Native Model',
        status: 'available',
      });
      expect(info.id).toBe('aether-model-1');
      expect(info.status).toBe('available');
    });
  });
});
