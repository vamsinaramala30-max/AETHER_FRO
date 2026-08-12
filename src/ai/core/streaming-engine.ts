// ============================================================================
// AETHER AI — Streaming Engine
// ============================================================================
// Manages the full lifecycle of a streaming response from the AETHER backend.
// Never simulates streaming — all data must come from the backend.
// ============================================================================

import type { StreamingChunk, StreamingSession, AIError } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';
import { createAIError } from '../ai-types';

export type StreamingChunkHandler = (chunk: StreamingChunk) => void;
export type StreamingCompleteHandler = (finalContent: string) => void;
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
 * Parses a Server-Sent Event data line into a StreamingChunk.
 * Returns null if the line should be skipped (heartbeat, comment, etc.)
 */
function parseSseLine(line: string): StreamingChunk | null {
  if (!line.startsWith('data:')) return null;
  const raw = line.slice(5).trim();
  if (raw === '[DONE]') {
    return { id: '', delta: '', index: -1, done: true, finishReason: 'stop' };
  }
  try {
    const parsed = JSON.parse(raw) as {
      id?: string;
      delta?: string | { content?: string };
      index?: number;
      done?: boolean;
      finish_reason?: string;
    };
    const delta =
      typeof parsed.delta === 'string'
        ? parsed.delta
        : typeof parsed.delta === 'object' && parsed.delta !== null
          ? (parsed.delta.content ?? '')
          : '';
    return {
      id: parsed.id ?? '',
      delta,
      index: parsed.index ?? 0,
      done: parsed.done ?? false,
      finishReason: parsed.finish_reason as StreamingChunk['finishReason'],
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
    const firstChunkTimer = setTimeout(() => {
      request.onError(
        createAIError('TIMEOUT', 'No response received from AI service within the expected time.'),
      );
    }, this.config.firstChunkTimeoutMs);

    let firstChunkReceived = false;
    let fullContent = '';
    let chunkIndex = 0;

    try {
      let token =
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
        headers['Authorization'] = `Bearer ${token.trim()}`;
      }

      const response = await fetch(request.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(request.payload),
        signal: request.signal,
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
          request.onError(createAIError('STREAM_FAILED', `Backend returned HTTP ${response.status}.`));
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
        if (request.signal.aborted) break;

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
          const chunk = parseSseLine(trimmed);
          if (!chunk) continue;

          if (chunk.done) {
            request.onComplete(fullContent);
            return;
          }

          fullContent += chunk.delta;
          request.onChunk({ ...chunk, index: chunkIndex++ });
        }
      }

      // Handle any remaining buffer
      if (buffer.trim()) {
        const chunk = parseSseLine(buffer.trim());
        if (chunk && !chunk.done) {
          fullContent += chunk.delta;
          request.onChunk({ ...chunk, index: chunkIndex++ });
        }
      }

      request.onComplete(fullContent);
    } catch (err: unknown) {
      clearTimeout(firstChunkTimer);
      if (request.signal.aborted) {
        request.onError(createAIError('CANCELLED', 'Streaming was cancelled by user.'));
      } else if (err instanceof TypeError && err.message.includes('fetch')) {
        request.onError(createAIError('SERVICE_UNAVAILABLE', 'Cannot connect to the AETHER AI backend.'));
      } else {
        request.onError(createAIError('STREAM_FAILED', 'Streaming failed unexpectedly.'));
      }
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
