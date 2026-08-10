// ============================================================================
// AETHER AI — Response Engine
// ============================================================================
// Normalizes and validates AI response payloads from the AETHER backend.
// ============================================================================

import type {
  GenerationResponse,
  AIMessage,
  SourceCitationRef,
  ToolInvocationRef,
  AIResult,
} from '../ai-types';
import { aiSuccess, aiFailure } from '../ai-types';

/**
 * Raw backend response shape before normalization.
 * The backend may return various shapes — this engine normalizes them.
 */
export interface RawBackendResponse {
  id?: string;
  message_id?: string;
  conversation_id?: string;
  content?: string;
  text?: string;
  role?: string;
  finish_reason?: string;
  citations?: unknown[];
  tool_invocations?: unknown[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  model?: string;
  created_at?: number;
}

function normalizeCitation(raw: unknown): SourceCitationRef | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r['id'] !== 'string') return null;
  return {
    id: r['id'],
    title: typeof r['title'] === 'string' ? r['title'] : 'Untitled',
    url: typeof r['url'] === 'string' ? r['url'] : undefined,
    snippet: typeof r['snippet'] === 'string' ? r['snippet'] : undefined,
    score: typeof r['score'] === 'number' ? r['score'] : undefined,
    documentId: typeof r['document_id'] === 'string' ? r['document_id'] : undefined,
    chunkIndex: typeof r['chunk_index'] === 'number' ? r['chunk_index'] : undefined,
  };
}

function normalizeToolInvocation(raw: unknown): ToolInvocationRef | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r['id'] !== 'string' || typeof r['tool_name'] !== 'string') return null;
  const status = r['status'];
  const validStatuses = ['pending', 'executing', 'completed', 'failed'] as const;
  const resolvedStatus: ToolInvocationRef['status'] = validStatuses.includes(
    status as ToolInvocationRef['status'],
  )
    ? (status as ToolInvocationRef['status'])
    : 'pending';

  return {
    id: r['id'],
    toolName: r['tool_name'],
    args: typeof r['args'] === 'object' && r['args'] !== null
      ? (r['args'] as Record<string, unknown>)
      : {},
    result: r['result'],
    status: resolvedStatus,
    error: typeof r['error'] === 'string' ? r['error'] : undefined,
    startedAt: typeof r['started_at'] === 'number' ? r['started_at'] : undefined,
    completedAt: typeof r['completed_at'] === 'number' ? r['completed_at'] : undefined,
  };
}

/**
 * Normalize a raw backend response into a typed GenerationResponse.
 */
export function normalizeGenerationResponse(
  raw: RawBackendResponse,
  conversationId: string,
): AIResult<GenerationResponse> {
  const content = raw.content ?? raw.text;
  if (typeof content !== 'string') {
    return aiFailure('GENERATION_FAILED', 'Backend response missing content field.');
  }

  const messageId = raw.id ?? raw.message_id ?? `msg_${Date.now()}`;
  const citations: SourceCitationRef[] = Array.isArray(raw.citations)
    ? raw.citations.flatMap((c) => {
        const n = normalizeCitation(c);
        return n ? [n] : [];
      })
    : [];

  const toolInvocations: ToolInvocationRef[] = Array.isArray(raw.tool_invocations)
    ? raw.tool_invocations.flatMap((t) => {
        const n = normalizeToolInvocation(t);
        return n ? [n] : [];
      })
    : [];

  const finishReason = raw.finish_reason;
  const validFinish = ['stop', 'length', 'tool_calls', 'content_filter'] as const;
  const resolvedFinish = validFinish.includes(finishReason as (typeof validFinish)[number])
    ? (finishReason as GenerationResponse['finishReason'])
    : undefined;

  return aiSuccess<GenerationResponse>({
    messageId,
    conversationId,
    content,
    role: 'assistant',
    finishReason: resolvedFinish,
    citations: citations.length > 0 ? citations : undefined,
    toolInvocations: toolInvocations.length > 0 ? toolInvocations : undefined,
    usage: raw.usage
      ? {
          promptTokens: raw.usage.prompt_tokens ?? 0,
          completionTokens: raw.usage.completion_tokens ?? 0,
          totalTokens: raw.usage.total_tokens ?? 0,
        }
      : undefined,
    modelId: raw.model,
    generatedAt: raw.created_at ?? Date.now(),
  });
}

/**
 * Build an AIMessage from a GenerationResponse.
 */
export function generationResponseToMessage(response: GenerationResponse): AIMessage {
  return {
    id: response.messageId,
    conversationId: response.conversationId,
    role: 'assistant',
    content: response.content,
    status: 'delivered',
    createdAt: response.generatedAt,
    updatedAt: response.generatedAt,
    citations: response.citations,
    toolInvocations: response.toolInvocations,
    tokens: response.usage
      ? {
          prompt: response.usage.promptTokens,
          completion: response.usage.completionTokens,
          total: response.usage.totalTokens,
        }
      : undefined,
  };
}

/**
 * Build a placeholder streaming message shell.
 */
export function buildStreamingMessageShell(
  messageId: string,
  conversationId: string,
): AIMessage {
  return {
    id: messageId,
    conversationId,
    role: 'assistant',
    content: '',
    status: 'streaming',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export const responseEngine = {
  normalizeGenerationResponse,
  generationResponseToMessage,
  buildStreamingMessageShell,
};
