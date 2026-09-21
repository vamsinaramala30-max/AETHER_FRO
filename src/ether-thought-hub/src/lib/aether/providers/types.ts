/**
 * AETHER provider adapter contract.
 *
 * Every LLM vendor is reduced to this interface. The frontend never imports
 * this file and never learns which provider is active — it only talks to the
 * AETHER backend endpoints (/api/chat, /api/models, /api/rag/embed).
 */

export type AetherRole = "system" | "user" | "assistant" | "tool";

export interface AetherProviderMessage {
  role: AetherRole;
  content: string;
  name?: string | undefined;
}

export interface AetherChatRequest {
  model?: string | undefined;
  messages: AetherProviderMessage[];
  temperature?: number | undefined;
  maxTokens?: number | undefined;
  topP?: number | undefined;
  signal?: AbortSignal | undefined;
}

/** Normalised stream chunk emitted by every adapter. */
export type AetherStreamChunk =
  | { type: "delta"; text: string }
  | { type: "reasoning"; text: string }
  | { type: "usage"; promptTokens?: number | undefined; completionTokens?: number | undefined }
  | { type: "done"; finishReason?: string | undefined };

export interface AetherModelInfo {
  id: string;
  label: string;
  contextWindow?: number;
}

export interface AetherProviderAdapter {
  /** Stable adapter id, e.g. "openai-compatible" | "anthropic" | "gemini" | "ollama". */
  readonly id: string;
  /** Human label surfaced in the UI ("AETHER · local runtime"). */
  readonly label: string;
  listModels(signal?: AbortSignal): Promise<AetherModelInfo[]>;
  streamChat(request: AetherChatRequest): AsyncIterable<AetherStreamChunk>;
  embed(input: string[], model?: string, signal?: AbortSignal): Promise<number[][]>;
}

export interface AetherProviderConfig {
  provider: string;
  baseUrl: string;
  apiKey: string;
  defaultModel: string;
  embeddingModel: string;
}

export class AetherProviderError extends Error {
  constructor(
    message: string,
    readonly status: number = 502,
    readonly code: string = "provider_error",
  ) {
    super(message);
    this.name = "AetherProviderError";
  }
}

export class AetherNotConfiguredError extends AetherProviderError {
  constructor(detail?: string) {
    super(
      detail
        ? `AETHER provider not configured — ${detail}`
        : "AETHER provider not configured",
      503,
      "provider_not_configured",
    );
    this.name = "AetherNotConfiguredError";
  }
}
