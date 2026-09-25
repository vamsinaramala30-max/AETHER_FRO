import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError, apiClient } from '@/api/client';
import { StreamingEngine } from '@/ai/core/streaming-engine';
import { documentsService } from '@/knowledge/documents/documentservice';
import { automationApi } from '@/automation/automation-api';

describe('Batch 8: UI Trust, State Accuracy & Error Sanitization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Error Sanitization (ApiError)', () => {
    it('sanitizes raw SQL syntax and database errors', () => {
      const rawError = 'error: syntax error at or near "SELECT" in SELECT * FROM "User"';
      const err = new ApiError({ status: 500, message: rawError });
      expect(err.message).toBe('The server encountered an error processing your request. Please try again.');
      expect(err.message).not.toContain('SELECT');
      expect(err.message).not.toContain('syntax error');
    });

    it('sanitizes Prisma unique constraint or schema errors', () => {
      const rawError = 'PrismaClientKnownRequestError: Unique constraint failed on the fields: (`email`)';
      const err = new ApiError({ status: 409, message: rawError });
      expect(err.message).toBe('A resource conflict occurred. Please refresh and try again.');
      expect(err.message).not.toContain('PrismaClientKnownRequestError');
      expect(err.message).not.toContain('fields: (`email`)');
    });

    it('strips absolute filesystem paths and stack traces', () => {
      const rawError = 'Failed to load file at C:\\Users\\Admin\\OneDrive\\Desktop\\AETHERN\\secret.key at Object.<anonymous> (C:\\file.ts:12:4)';
      const err = new ApiError({ status: 500, message: rawError });
      expect(err.message).not.toContain('C:\\Users\\Admin');
      expect(err.message).not.toContain('secret.key');
      expect(err.message).not.toContain('at Object.<anonymous>');
      expect(err.message).toBe('The server encountered an error processing your request. Please try again.');
    });

    it('preserves clean, actionable user error messages', () => {
      const safeMessage = 'The requested schedule conflicts with an existing event.';
      const err = new ApiError({ status: 409, message: safeMessage });
      expect(err.message).toBe(safeMessage);
      expect(err.status).toBe(409);
    });

    it('handles authentication and authorization status codes appropriately', () => {
      const err401 = new ApiError({ status: 401, message: 'Unauthorized' });
      expect(err401.status).toBe(401);

      const err403 = new ApiError({ status: 403, message: 'Forbidden workspace access' });
      expect(err403.status).toBe(403);
    });
  });

  describe('AI Assistant Streaming & Terminal States', () => {
    it('terminates with error and never completes when stream receives failure event', async () => {
      const engine = new StreamingEngine();
      const onChunk = vi.fn();
      const onError = vi.fn();
      const onComplete = vi.fn();

      // Mock fetch with failed stream line
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode('data: {"status":"failed","error":"Upstream inference timeout"}\n\n'),
          );
          controller.close();
        },
      });

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        body: mockStream,
      } as any);

      await engine.startStream({
        sessionId: 'sess-1',
        conversationId: 'conv-1',
        messageId: 'msg-1',
        endpoint: '/api/v1/ai/stream',
        payload: { message: 'Test message' },
        signal: new AbortController().signal,
        onChunk,
        onError,
        onComplete,
      });

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'STREAM_FAILED',
          message: 'Upstream inference timeout',
        }),
      );
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('terminates with CANCELLED error immediately when abort signal is triggered', async () => {
      const engine = new StreamingEngine();
      const controller = new AbortController();
      const onChunk = vi.fn();
      const onError = vi.fn();
      const onComplete = vi.fn();

      // Mock pending stream
      const mockStream = new ReadableStream({
        start(streamController) {
          streamController.enqueue(new TextEncoder().encode('data: {"content":"Partial"}\n\n'));
        },
      });

      vi.spyOn(globalThis, 'fetch').mockImplementationOnce(async () => {
        controller.abort();
        return {
          ok: true,
          body: mockStream,
        } as any;
      });

      await engine.startStream({
        sessionId: 'sess-2',
        conversationId: 'conv-2',
        messageId: 'msg-2',
        endpoint: '/api/v1/ai/stream',
        payload: { message: 'Aborted message' },
        signal: controller.signal,
        onChunk,
        onError,
        onComplete,
      });

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'CANCELLED',
        }),
      );
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('Knowledge Documents: No False Success', () => {
    it('rejects empty file uploads before making backend requests', async () => {
      const emptyFile = new File([], 'empty.txt', { type: 'text/plain' });
      await expect(documentsService.uploadDocument(emptyFile, ['test'])).rejects.toThrow(
        'Cannot upload an empty file.',
      );
    });

    it('uploads physical file to /uploads/single and attaches file ID to document', async () => {
      const testFile = new File(['file contents'], 'report.pdf', { type: 'application/pdf' });
      const postSpy = vi.spyOn(apiClient, 'post');

      postSpy.mockResolvedValueOnce({
        id: 'upload-uuid-123',
        filename: 'report.pdf',
        size: 13,
      } as any);

      postSpy.mockResolvedValueOnce({
        id: 'doc-uuid-456',
        title: 'report.pdf',
        category: 'Project Documents',
        status: 'READY',
      } as any);

      const result = await documentsService.uploadDocument(testFile, ['finance']);

      expect(postSpy).toHaveBeenCalledTimes(2);
      expect(postSpy).toHaveBeenNthCalledWith(
        1,
        '/uploads/single',
        expect.any(FormData),
        expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } }),
      );
      expect(result.id).toBe('doc-uuid-456');
      expect(result.attachedFileIds).toEqual(['upload-uuid-123']);
    });

    it('rethrows server failure on createDocument instead of generating synthetic local records', async () => {
      vi.spyOn(apiClient, 'post').mockRejectedValueOnce(
        new ApiError({ status: 500, message: 'Server write error' }),
      );

      await expect(
        documentsService.createDocument({
          title: 'Unsaved Document',
          category: 'Reports',
        }),
      ).rejects.toThrow('Server write error');
    });

    it('throws error on deleteDocument failure instead of falsely pretending deletion succeeded', async () => {
      vi.spyOn(apiClient, 'delete').mockRejectedValueOnce(
        new ApiError({ status: 403, message: 'Permission denied' }),
      );

      await expect(documentsService.deleteDocument('doc-999')).rejects.toThrow('Permission denied');
    });
  });

  describe('Automation: Truthful Status & Execution Visibility', () => {
    it('reports failure when executeAutomation backend response indicates FAILED status', async () => {
      vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
        status: 'FAILED',
        error: 'Execution step timed out',
        executionId: 'exec-fail-1',
      } as any);

      const result = await automationApi.executeAutomation('rule-1');
      expect(result.success).toBe(false);
      expect(result.status).toBe('FAILED');
      expect(result.executionId).toBe('exec-fail-1');
    });

    it('reports success when executeAutomation backend response succeeds', async () => {
      vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
        status: 'COMPLETED',
        executionId: 'exec-ok-2',
      } as any);

      const result = await automationApi.executeAutomation('rule-2');
      expect(result.success).toBe(true);
      expect(result.status).toBe('COMPLETED');
    });

    it('deleteAutomation rethrows errors when backend deletion fails', async () => {
      vi.spyOn(apiClient, 'delete').mockRejectedValueOnce(
        new ApiError({ status: 500, message: 'Deletion constraint error' }),
      );

      await expect(automationApi.deleteAutomation('rule-3')).rejects.toThrow(
        'Deletion constraint error',
      );
    });
  });
});
