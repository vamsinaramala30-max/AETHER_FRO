import type { AetherStreamChunk } from "./providers/types";
import type { MessageRole, ProviderStatus } from "./types";

/**
 * The single HTTP boundary of the AETHER frontend. No vendor SDKs, no model
 * names, no keys — only these endpoints.
 */

export interface ChatTurn {
  role: MessageRole;
  content: string;
}

export interface ChatStreamOptions {
  messages: ChatTurn[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  signal?: AbortSignal;
  onChunk: (chunk: AetherStreamChunk) => void;
}

export class AetherApiError extends Error {
  constructor(
    message: string,
    readonly code: string = "request_failed",
    readonly status = 500,
  ) {
    super(message);
    this.name = "AetherApiError";
  }
}

async function readError(response: Response): Promise<AetherApiError> {
  try {
    const body = (await response.json()) as { error?: { code?: string; message?: string } };
    return new AetherApiError(
      body.error?.message ?? `AETHER request failed (${response.status})`,
      body.error?.code ?? "request_failed",
      response.status,
    );
  } catch {
    return new AetherApiError(`AETHER request failed (${response.status})`, "request_failed", response.status);
  }
}

export const aetherApi = {
  async getModels(signal?: AbortSignal): Promise<ProviderStatus> {
    const res = await fetch("/api/models", { signal: signal ?? null });
    if (!res.ok) throw await readError(res);
    return (await res.json()) as ProviderStatus;
  },

  async embed(input: string[], signal?: AbortSignal): Promise<number[][]> {
    const res = await fetch("/api/rag/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
      signal: signal ?? null,
    });
    if (!res.ok) throw await readError(res);
    const body = (await res.json()) as { vectors: number[][] };
    return body.vectors;
  },

  /** Streams a completion, translating SSE payloads into normalised chunks. */
  async streamChat({ onChunk, signal, ...payload }: ChatStreamOptions): Promise<void> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: signal ?? null,
    });
    if (!res.ok) throw await readError(res);
    if (!res.body) throw new AetherApiError("Empty AETHER stream");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const handleLine = (line: string) => {
      if (!line.startsWith("data:")) return;
      const payloadText = line.slice(5).trim();
      if (!payloadText) return;
      let parsed: AetherStreamChunk | { type: "error"; code: string; message: string };
      try {
        parsed = JSON.parse(payloadText);
      } catch {
        return;
      }
      if (parsed.type === "error") {
        throw new AetherApiError(parsed.message, parsed.code, 502);
      }
      onChunk(parsed);
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let index = buffer.indexOf("\n");
      while (index !== -1) {
        handleLine(buffer.slice(0, index).trim());
        buffer = buffer.slice(index + 1);
        index = buffer.indexOf("\n");
      }
    }
    if (buffer.trim()) handleLine(buffer.trim());
  },
};
