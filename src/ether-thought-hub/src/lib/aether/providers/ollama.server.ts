import { assertOk, readJsonLines } from "./http.server";
import {
  type AetherChatRequest,
  type AetherProviderAdapter,
  type AetherProviderConfig,
  type AetherStreamChunk,
} from "./types";

/** Ollama native API adapter (also works for any Ollama-compatible runtime). */
export function createOllamaAdapter(config: AetherProviderConfig): AetherProviderAdapter {
  const base = (config.baseUrl || "http://localhost:11434").replace(/\/+$/, "");
  const label = "AETHER · ollama";

  return {
    id: "ollama",
    label,

    async listModels(signal) {
      const res = await fetch(`${base}/api/tags`, { signal: signal ?? null });
      await assertOk(res, label);
      const json = (await res.json()) as { models?: Array<{ name?: string; model?: string }> };
      return (json.models ?? [])
        .map((m) => m.name ?? m.model)
        .filter((id): id is string => typeof id === "string")
        .map((id) => ({ id, label: id }));
    },

    async *streamChat(request: AetherChatRequest): AsyncIterable<AetherStreamChunk> {
      const res = await fetch(`${base}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: request.signal ?? null,
        body: JSON.stringify({
          model: request.model || config.defaultModel,
          messages: request.messages.map((m) => ({
            role: m.role === "tool" ? "assistant" : m.role,
            content: m.content,
          })),
          stream: true,
          options: {
            temperature: request.temperature,
            top_p: request.topP,
            num_predict: request.maxTokens,
          },
        }),
      });
      await assertOk(res, label);

      for await (const raw of readJsonLines(res)) {
        const event = raw as {
          message?: { content?: string };
          done?: boolean;
          prompt_eval_count?: number;
          eval_count?: number;
          done_reason?: string;
        };
        if (event.message?.content) yield { type: "delta", text: event.message.content };
        if (event.done) {
          yield {
            type: "usage",
            promptTokens: event.prompt_eval_count,
            completionTokens: event.eval_count,
          };
          yield { type: "done", finishReason: event.done_reason };
          return;
        }
      }
      yield { type: "done" };
    },

    async embed(input, model, signal) {
      const res = await fetch(`${base}/api/embed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: signal ?? null,
        body: JSON.stringify({
          model: model || config.embeddingModel || "nomic-embed-text",
          input,
        }),
      });
      await assertOk(res, label);
      const json = (await res.json()) as { embeddings?: number[][] };
      return json.embeddings ?? [];
    },
  };
}
