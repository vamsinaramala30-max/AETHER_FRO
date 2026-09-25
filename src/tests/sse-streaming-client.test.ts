import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../api/client';
import { assistantService } from '../ai/assistant/assistantservice';
import { assistantStore } from '../ai/assistant/assistantstore';

// Helper to create a ReadableStream with given chunks
function createMockStream(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let index = 0;
  return new ReadableStream({
    pull(controller) {
      if (index < chunks.length) {
        controller.enqueue(encoder.encode(chunks[index++]));
      } else {
        controller.close();
      }
    },
  });
}

describe('Frontend SSE Streaming Reliability & Lifecycle (Batch 4)', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    localStorage.clear();
  });

  // ─── 1. API CLIENT STREAM PARSER INVARIANTS ─────────────────────────────────

  it('FRO-SSE-01: Correctly parses SSE data blocks delimited by double newline', async () => {
    const ssePayload = [
      'data: {"delta":"Hello"}\n\n',
      'data: {"delta":" world!"}\n\n',
      'data: [DONE]\n\n',
    ];

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/event-stream' }),
      body: createMockStream(ssePayload),
    } as unknown as Response);

    const received: string[] = [];
    for await (const chunk of apiClient.stream('/ai/stream', { skipAuth: true })) {
      received.push(chunk);
    }

    expect(received).toHaveLength(3);
    expect(JSON.parse(received[0])).toEqual({ delta: 'Hello' });
    expect(JSON.parse(received[1])).toEqual({ delta: ' world!' });
    expect(received[2]).toBe('[DONE]');
  });

  it('FRO-SSE-02: Ignores SSE comments/heartbeats and supports multi-line data fields', async () => {
    const ssePayload = [
      ': heartbeat ping\n',
      'data: {"step":1,\n',
      'data: "status":"planning"}\n\n',
      ': another comment\n\n',
      'data: {"isLast":true}\r\n\r\n',
    ];

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/event-stream' }),
      body: createMockStream(ssePayload),
    } as unknown as Response);

    const received: string[] = [];
    for await (const chunk of apiClient.stream('/ai/stream', { skipAuth: true })) {
      received.push(chunk);
    }

    expect(received).toHaveLength(2);
    expect(JSON.parse(received[0])).toEqual({ step: 1, status: 'planning' });
    expect(JSON.parse(received[1])).toEqual({ isLast: true });
  });

  it('FRO-SSE-03: Aborting signal cleanly stops stream generator and cancels reader', async () => {
    let readerCancelled = false;
    const encoder = new TextEncoder();
    const abortController = new AbortController();

    const mockStream = new ReadableStream({
      pull(controller) {
        controller.enqueue(encoder.encode('data: {"delta":"token"}\n\n'));
      },
      cancel() {
        readerCancelled = true;
      },
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/event-stream' }),
      body: mockStream,
    } as unknown as Response);

    const streamGen = apiClient.stream('/ai/stream', {
      signal: abortController.signal,
      skipAuth: true,
    });

    // Read first chunk, then abort
    const first = await streamGen.next();
    expect(first.done).toBe(false);
    expect(first.value).toBeDefined();
    expect(JSON.parse(first.value as string)).toEqual({ delta: 'token' });

    // Abort controller
    abortController.abort();

    // Next iteration should terminate
    const next = await streamGen.next();
    expect(next.done).toBe(true);
    expect(readerCancelled).toBe(true);
  });

  // ─── 2. ASSISTANT SERVICE STREAMING INVARIANTS ───────────────────────────────

  it('FRO-SSE-04: Normal stream invokes onChunk and onComplete with assembled message', async () => {
    const ssePayload = [
      'data: {"delta":"Alpha "}\n\n',
      'data: {"delta":"Beta "}\n\n',
      'data: {"delta":"Gamma","isLast":true,"status":"completed"}\n\n',
      'data: [DONE]\n\n',
    ];

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/event-stream' }),
      body: createMockStream(ssePayload),
    } as unknown as Response);

    const chunks: string[] = [];
    const onChunk = vi.fn((chunk: string) => chunks.push(chunk));
    const onComplete = vi.fn();
    const onError = vi.fn();

    const result = await assistantService.streamMessage(
      'conv_test_1',
      'Test prompt',
      { onChunk, onComplete, onError },
    );

    expect(result).toBe('Alpha Beta Gamma');
    expect(chunks).toEqual(['Alpha ', 'Beta ', 'Gamma']);
    expect(onComplete).toHaveBeenCalledWith('Alpha Beta Gamma');
    expect(onError).not.toHaveBeenCalled();
  });

  it('FRO-SSE-05: Stream failure invokes onError and NEVER calls onComplete (Zero False Success)', async () => {
    const ssePayload = [
      'data: {"delta":"Partial text before failure "}\n\n',
      'data: {"isLast":true,"status":"failed","error":"Inference provider offline (HTTP 503)"}\n\n',
    ];

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/event-stream' }),
      body: createMockStream(ssePayload),
    } as unknown as Response);

    const onChunk = vi.fn();
    const onComplete = vi.fn();
    const onError = vi.fn();

    await expect(
      assistantService.streamMessage(
        'conv_test_2',
        'Should fail truthfully',
        { onChunk, onComplete, onError },
      ),
    ).rejects.toThrow();

    expect(onError).toHaveBeenCalled();
    const errorPassed = onError.mock.calls[0][0];
    expect(errorPassed.message).toContain('Inference provider offline');
    // Invariant: ZERO false success
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('FRO-SSE-06: Cancelled stream throws AbortError and NEVER calls onComplete', async () => {
    const ssePayload = [
      'data: {"delta":"Starting calculation..."}\n\n',
      'data: {"isLast":true,"status":"cancelled"}\n\n',
    ];

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/event-stream' }),
      body: createMockStream(ssePayload),
    } as unknown as Response);

    const onChunk = vi.fn();
    const onComplete = vi.fn();
    const onError = vi.fn();

    await expect(
      assistantService.streamMessage(
        'conv_test_3',
        'Should be cancelled',
        { onChunk, onComplete, onError },
      ),
    ).rejects.toThrow('Stream execution was cancelled');

    expect(onComplete).not.toHaveBeenCalled();
  });

  // ─── 3. STORE STREAM CANCELLATION & DUPLICATE SAFETY ─────────────────────────

  it('FRO-SSE-07: cancelStreaming cleanly marks message as error/cancelled and halts generation', async () => {
    // Mock stream responsive to AbortSignal
    globalThis.fetch = vi.fn().mockImplementation((_url: string, options: any) => {
      const signal = options?.signal as AbortSignal | undefined;
      const mockStream = new ReadableStream({
        start(controller) {
          if (signal?.aborted) {
            controller.error(new DOMException('Aborted', 'AbortError'));
            return;
          }
          signal?.addEventListener('abort', () => {
            controller.error(new DOMException('Aborted', 'AbortError'));
          });
        },
        pull() {},
      });
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/event-stream' }),
        body: mockStream,
      } as unknown as Response);
    });

    // Start sending message
    const sendPromise = assistantStore.sendMessage('Hello');

    // Wait small tick for store to enter streaming
    await new Promise((r) => setTimeout(r, 20));

    expect(assistantStore.getState().isStreaming).toBe(true);

    // Cancel streaming
    assistantStore.cancelStreaming();

    // Await sendPromise to finish handling the abort
    await sendPromise;

    const state = assistantStore.getState();
    expect(state.isStreaming).toBe(false);
    const activeConv = state.conversations[state.activeConversationId!];
    const assistantMsg = activeConv.messages.find((m) => m.role === 'assistant');
    expect(assistantMsg?.status).toBe('error');
    expect(assistantMsg?.error).toBe('Generation cancelled');
  });
});
