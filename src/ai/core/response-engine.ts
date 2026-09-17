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
  ActionState,
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
  confidence?: string;
  verificationStatus?: string;
  verification_status?: string;
  evidence?: unknown[];
  plan?: unknown;
  confirmationRequest?: unknown;
  confirmation_request?: unknown;
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
  const toolName =
    typeof r['toolName'] === 'string'
      ? r['toolName']
      : typeof r['tool_name'] === 'string'
        ? r['tool_name']
        : typeof r['tool'] === 'string'
          ? r['tool']
          : typeof r['name'] === 'string'
            ? r['name']
            : undefined;
  if (!toolName) return null;

  const id = typeof r['id'] === 'string' ? r['id'] : `tool_${Date.now()}`;

  const validStatuses: readonly string[] = [
    'pending',
    'executing',
    'completed',
    'failed',
    'cancelled',
    'PLANNED',
    'VALIDATING',
    'AUTHORIZED',
    'READY',
    'BLOCKED',
    'NEEDS_CLARIFICATION',
    'EXECUTING',
    'VERIFYING',
    'COMPLETED',
    'FAILED',
    'TIMED_OUT',
    'DENIED',
    'CANCELLED',
    'REQUESTED',
    'SKIPPED',
    'EXECUTED',
    'SUCCESS',
  ];
  const rawStatus = (r['status'] ?? r['actionState'] ?? r['action_state']) as string;
  const resolvedStatus: ToolInvocationRef['status'] =
    typeof rawStatus === 'string' && validStatuses.includes(rawStatus)
      ? (rawStatus as ToolInvocationRef['status'])
      : 'pending';

  const rawArgs =
    typeof r['args'] === 'object' && r['args'] !== null
      ? (r['args'] as Record<string, unknown>)
      : typeof r['arguments'] === 'object' && r['arguments'] !== null
        ? (r['arguments'] as Record<string, unknown>)
        : typeof r['parameters'] === 'object' && r['parameters'] !== null
          ? (r['parameters'] as Record<string, unknown>)
          : typeof r['input'] === 'object' && r['input'] !== null
            ? (r['input'] as Record<string, unknown>)
            : {};

  const result = r['result'] ?? r['output'];

  return {
    id,
    toolName,
    args: rawArgs,
    result,
    status: resolvedStatus,
    actionState: (typeof r['actionState'] === 'string' ? r['actionState'] : (typeof r['action_state'] === 'string' ? r['action_state'] : resolvedStatus)) as ActionState,
    verified: typeof r['verified'] === 'boolean' ? r['verified'] : undefined,
    verificationDetails:
      typeof r['verification_details'] === 'string'
        ? r['verification_details']
        : typeof r['verificationDetails'] === 'string'
          ? r['verificationDetails']
          : undefined,
    error: typeof r['error'] === 'string' ? r['error'] : undefined,
    startedAt:
      typeof r['startedAt'] === 'number'
        ? r['startedAt']
        : typeof r['started_at'] === 'number'
          ? r['started_at']
          : undefined,
    completedAt:
      typeof r['completedAt'] === 'number'
        ? r['completedAt']
        : typeof r['completed_at'] === 'number'
          ? r['completed_at']
          : undefined,
  };
}

export function normalizeGenerationResponse(
  rawInput: RawBackendResponse | Record<string, unknown>,
  conversationId: string,
): AIResult<GenerationResponse> {
  if (!rawInput || typeof rawInput !== 'object') {
    return aiFailure('GENERATION_FAILED', 'Invalid backend response payload.');
  }

  const raw: RawBackendResponse =
    (rawInput as any)?.data?.assistantMessage ||
    (rawInput as any)?.data ||
    rawInput;

  const content =
    raw.content ??
    raw.text ??
    (typeof (raw as any).message === 'string' ? (raw as any).message : undefined);

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

  const rawTools = (raw as any).toolInvocations ?? raw.tool_invocations;
  const toolInvocations: ToolInvocationRef[] = Array.isArray(rawTools)
    ? rawTools.flatMap((t) => {
        const n = normalizeToolInvocation(t);
        return n ? [n] : [];
      })
    : [];

  const finishReason = raw.finish_reason;
  const validFinish = ['stop', 'length', 'tool_calls', 'content_filter'] as const;
  const resolvedFinish = validFinish.includes(finishReason as (typeof validFinish)[number])
    ? (finishReason as GenerationResponse['finishReason'])
    : undefined;

  const confReq = raw.confirmationRequest ?? raw.confirmation_request;
  const rawVerif = (raw.verificationStatus ?? raw.verification_status) as any;
  const validVerif = [
    'UNVERIFIED',
    'PENDING',
    'VERIFIED',
    'FAILED',
    'PARTIALLY_VERIFIED',
    'NOT_VERIFIABLE',
  ];
  const verificationStatus = validVerif.includes(rawVerif) ? rawVerif : undefined;

  const rawEvidence = (raw as any).turnEvidence ?? (raw as any).turn_evidence ?? (raw as any).evidence;
  const parsedEvidence = Array.isArray(rawEvidence) ? (rawEvidence as any) : undefined;
  const rawPlan = (raw as any).canonicalPlan ?? (raw as any).canonical_plan ?? raw.plan;

  return aiSuccess<GenerationResponse>({
    messageId,
    conversationId,
    content,
    role: 'assistant',
    finishReason: resolvedFinish,
    citations: citations.length > 0 ? citations : undefined,
    toolInvocations: toolInvocations.length > 0 ? toolInvocations : undefined,
    plan: rawPlan as any,
    canonicalPlan: rawPlan as any,
    confidence: raw.confidence as any,
    verificationStatus,
    evidence: parsedEvidence,
    turnEvidence: parsedEvidence,
    confirmationRequest: confReq as any,
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
 * Extract tool invocations from a raw response payload.
 */
export function extractToolInvocations(raw: Record<string, unknown>): ToolInvocationRef[] {
  const rawTools = (raw as any).toolInvocations ?? (raw as any).tool_invocations;
  if (!Array.isArray(rawTools)) return [];
  return rawTools.flatMap((t) => {
    const n = normalizeToolInvocation(t);
    return n ? [n] : [];
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
    plan: response.plan,
    canonicalPlan: response.canonicalPlan ?? response.plan,
    confidence: response.confidence,
    verificationStatus: response.verificationStatus,
    evidence: response.evidence,
    turnEvidence: response.turnEvidence ?? response.evidence,
    confirmationRequest: response.confirmationRequest,
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
export function buildStreamingMessageShell(messageId: string, conversationId: string): AIMessage {
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
