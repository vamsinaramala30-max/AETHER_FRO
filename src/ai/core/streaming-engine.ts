// ============================================================================
// AETHER AI — Streaming Engine
// ============================================================================
// Manages the full lifecycle of a streaming response from the AETHER backend.
// Never simulates streaming — all data must come from the backend.
// ============================================================================

import type { StreamingChunk, StreamingSession, AIError } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';
import { createAIError } from '../ai-types';
import { authConfig } from '../../config/auth.config';

export type StreamingChunkHandler = (chunk: StreamingChunk) => void;
export type StreamingCompleteHandler = (
  finalContent: string,
  metadata?: Record<string, unknown>,
) => void;
export type StreamingErrorHandler = (error: AIError) => void;

export interface StreamingRequest {
  sessionId: string;
  conversationId: string;
  messageId: string;
  endpoint: string;
  payload: Record<string, unknown>;
  signal: AbortSignal;
  onChunk: StreamingChunkHandler;
  onComplete: StreamingCompleteHandler;
  onError: StreamingErrorHandler;
}

/**
 * Parses a Server-Sent Event data line into a StreamingChunk or error.
 * Returns null if the line should be skipped (heartbeat, comment, etc.)
 */
function parseSseLine(line: string): { chunk?: StreamingChunk; error?: AIError } | null {
  if (!line.startsWith('data:')) return null;
  const raw = line.slice(5).trim();
  if (raw === '[DONE]') {
    return { chunk: { id: '', delta: '', index: -1, done: true, finishReason: 'stop' } };
  }
  try {
    const parsed = JSON.parse(raw) as {
      id?: string;
      delta?: string | { content?: string };
      index?: number;
      done?: boolean;
      isLast?: boolean;
      finish_reason?: string;
      error?: { code?: string; message?: string } | string;
    };

    if (parsed.error) {
      const errObj =
        typeof parsed.error === 'object' && parsed.error !== null
          ? parsed.error
          : { message: String(parsed.error) };
      return {
        error: createAIError(
          (errObj.code as any) || 'STREAM_FAILED',
          errObj.message || 'An error occurred during response streaming.',
        ),
      };
    }

    const delta =
      typeof parsed.delta === 'string'
        ? parsed.delta
        : typeof parsed.delta === 'object' && parsed.delta !== null
          ? (parsed.delta.content ?? '')
          : '';
    const done = parsed.done ?? parsed.isLast ?? false;

    let metadata: Record<string, unknown> | undefined;
    if (
      (parsed as any).plan ||
      (parsed as any).evidence ||
      (parsed as any).citations ||
      (parsed as any).toolInvocations ||
      (parsed as any).tool_invocations ||
      (parsed as any).confirmationRequest ||
      (parsed as any).confirmation_request ||
      (parsed as any).verificationStatus ||
      (parsed as any).verification_status ||
      (parsed as any).confidence
    ) {
      metadata = {
        plan: (parsed as any).plan,
        evidence: (parsed as any).evidence,
        citations: (parsed as any).citations,
        toolInvocations: (parsed as any).toolInvocations ?? (parsed as any).tool_invocations,
        confirmationRequest:
          (parsed as any).confirmationRequest ?? (parsed as any).confirmation_request,
        verificationStatus:
          (parsed as any).verificationStatus ?? (parsed as any).verification_status,
        confidence: (parsed as any).confidence,
      };
    }

    return {
      chunk: {
        id: parsed.id ?? '',
        delta,
        index: parsed.index ?? 0,
        done,
        finishReason: parsed.finish_reason as StreamingChunk['finishReason'],
        metadata,
      },
    };
  } catch {
    return null;
  }
}

/**
 * StreamingEngine manages a single SSE streaming session.
 * Uses the Fetch API + ReadableStream for streaming.
 */
export class StreamingEngine {
  private readonly config = DEFAULT_AI_CONFIG.streaming;

  async startStream(request: StreamingRequest): Promise<void> {
    let firstChunkReceived = false;
    let fullContent = '';
    let chunkIndex = 0;
    let accumulatedMetadata: Record<string, unknown> = {};

    const internalController = new AbortController();
    let timedOut = false;

    const onExternalAbort = () => {
      clearTimeout(firstChunkTimer);
      internalController.abort();
    };

    if (request.signal.aborted) {
      request.onError(createAIError('CANCELLED', 'Streaming was cancelled by user.'));
      return;
    }

    request.signal.addEventListener('abort', onExternalAbort, { once: true });

    const firstChunkTimer = setTimeout(() => {
      if (!firstChunkReceived && !request.signal.aborted) {
        timedOut = true;
        internalController.abort();
        request.onError(
          createAIError('TIMEOUT', 'No response received from AI service within the expected time.'),
        );
      }
    }, this.config.firstChunkTimeoutMs);

    try {
      let token =
        localStorage.getItem(authConfig.tokenKey) ||
        localStorage.getItem('aether_access_token') ||
        localStorage.getItem('aether_auth_token') ||
        localStorage.getItem('aether-auth-token') ||
        localStorage.getItem('auth_token');

      if (!token) {
        try {
          const store = localStorage.getItem('aether-auth-storage');
          if (store) {
            const parsed = JSON.parse(store);
            if (parsed?.state?.token && typeof parsed.state.token === 'string') {
              token = parsed.state.token;
            }
          }
        } catch {
          // Ignore storage parse error
        }
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      };
      if (token && typeof token === 'string' && token.trim() !== '') {
        headers[authConfig.tokenHeader] = `${authConfig.tokenPrefix}${token.trim()}`;
      }

      const response = await fetch(request.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(request.payload),
        signal: internalController.signal,
      });

      if (!response.ok) {
        clearTimeout(firstChunkTimer);
        if (response.status === 401) {
          request.onError(createAIError('UNAUTHORIZED', 'Unauthorized to access the AI service.'));
        } else if (response.status === 403) {
          request.onError(createAIError('FORBIDDEN', 'Access to the AI service is forbidden.'));
        } else if (response.status === 503) {
          request.onError(createAIError('SERVICE_UNAVAILABLE', 'AI service is unavailable.'));
        } else {
          request.onError(
            createAIError('STREAM_FAILED', `Backend returned HTTP ${response.status}.`),
          );
        }
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        clearTimeout(firstChunkTimer);
        request.onError(createAIError('STREAM_FAILED', 'Backend response body is not readable.'));
        return;
      }

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (request.signal.aborted || internalController.signal.aborted) break;

        if (!firstChunkReceived) {
          firstChunkReceived = true;
          clearTimeout(firstChunkTimer);
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          const parsed = parseSseLine(trimmed);
          if (!parsed) continue;

          if (parsed.error) {
            request.onError(parsed.error);
            return;
          }

          const chunk = parsed.chunk;
          if (!chunk) continue;

          if (chunk.metadata) {
            accumulatedMetadata = { ...accumulatedMetadata, ...chunk.metadata };
          }

          if (chunk.done) {
            request.onComplete(fullContent, accumulatedMetadata);
            return;
          }

          fullContent += chunk.delta;
          request.onChunk({ ...chunk, index: chunkIndex++ });
        }
      }

      // Handle any remaining buffer
      if (buffer.trim()) {
        const parsed = parseSseLine(buffer.trim());
        if (parsed?.error) {
          request.onError(parsed.error);
          return;
        }
        if (parsed?.chunk) {
          if (parsed.chunk.metadata) {
            accumulatedMetadata = { ...accumulatedMetadata, ...parsed.chunk.metadata };
          }
          if (!parsed.chunk.done) {
            fullContent += parsed.chunk.delta;
            request.onChunk({ ...parsed.chunk, index: chunkIndex++ });
          }
        }
      }

      request.onComplete(fullContent, accumulatedMetadata);
    } catch (err: unknown) {
      if (timedOut) {
        return;
      }
      if (request.signal.aborted) {
        request.onError(createAIError('CANCELLED', 'Streaming was cancelled by user.'));
      } else if (err instanceof TypeError && err.message.includes('fetch')) {
        request.onError(
          createAIError('SERVICE_UNAVAILABLE', 'Cannot connect to the AETHER AI backend.'),
        );
      } else {
        request.onError(createAIError('STREAM_FAILED', 'Streaming failed unexpectedly.'));
      }
    } finally {
      clearTimeout(firstChunkTimer);
      request.signal.removeEventListener('abort', onExternalAbort);
    }
  }

  /**
   * Create a new AbortController for a streaming session.
   */
  createAbortController(): AbortController {
    return new AbortController();
  }

  /**
   * Build a new StreamingSession descriptor.
   */
  createSession(
    sessionId: string,
    conversationId: string,
    messageId: string,
    abortController: AbortController,
  ): StreamingSession {
    return {
      sessionId,
      conversationId,
      messageId,
      status: 'starting',
      startedAt: Date.now(),
      totalChunks: 0,
      abortController,
    };
  }
}

export const streamingEngine = new StreamingEngine();
