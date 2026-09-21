import { assertOk, readSseData } from "./http.server";
import {
  AetherProviderError,
  type AetherChatRequest,
  type AetherProviderAdapter,
  type AetherProviderConfig,
  type AetherStreamChunk,
} from "./types";

/** Anthropic Messages API adapter. */
export function createAnthropicAdapter(config: AetherProviderConfig): AetherProviderAdapter {
  const base = (config.baseUrl || "https://api.anthropic.com/v1").replace(/\/+$/, "");
  const label = "AETHER · anthropic";

  const headers = (): Record<string, string> => ({
    "Content-Type": "application/json",
    "x-api-key": config.apiKey,
    "anthropic-version": "2023-06-01",
  });

  return {
    id: "anthropic",
    label,

    async listModels(signal) {
      const res = await fetch(`${base}/models`, { headers: headers(), signal: signal ?? null });
      await assertOk(res, label);
      const json = (await res.json()) as {
        data?: Array<{ id?: string; display_name?: string }>;
      };
      return (json.data ?? [])
        .filter((m): m is { id: string; display_name?: string } => typeof m.id === "string")
        .map((m) => ({ id: m.id, label: m.display_name ?? m.id }));
    },

    async *streamChat(request: AetherChatRequest): AsyncIterable<AetherStreamChunk> {
      const system = request.messages
        .filter((m) => m.role === "system")
        .map((m) => m.content)
        .join("\n\n");
      const messages = request.messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        }));

      const res = await fetch(`${base}/messages`, {
        method: "POST",
        headers: headers(),
        signal: request.signal ?? null,
        body: JSON.stringify({
          model: request.model || config.defaultModel,
          system: system || undefined,
          messages,
          max_tokens: request.maxTokens ?? 4096,
          temperature: request.temperature,
          top_p: request.topP,
          stream: true,
        }),
      });
      await assertOk(res, label);

      for await (const payload of readSseData(res)) {
        let event: {
          type?: string;
          delta?: { type?: string; text?: string; thinking?: string; stop_reason?: string };
          usage?: { input_tokens?: number; output_tokens?: number };
          message?: { usage?: { input_tokens?: number; output_tokens?: number } };
        };
        try {
          event = JSON.parse(payload);
        } catch {
          continue;
        }
        if (event.type === "content_block_delta") {
          if (event.delta?.text) yield { type: "delta", text: event.delta.text };
          if (event.delta?.thinking) yield { type: "reasoning", text: event.delta.thinking };
        } else if (event.type === "message_delta") {
          if (event.usage) {
            yield {
              type: "usage",
              promptTokens: event.usage.input_tokens,
              completionTokens: event.usage.output_tokens,
            };
          }
        } else if (event.type === "message_stop") {
          yield { type: "done" };
          return;
        } else if (event.type === "error") {
          throw new AetherProviderError("Anthropic stream error");
        }
      }
      yield { type: "done" };
    },

    async embed() {
      throw new AetherProviderError(
        "Anthropic exposes no embeddings endpoint — configure AETHER_EMBEDDING_BASE_URL with an OpenAI-compatible embedding service.",
        501,
        "embeddings_unsupported",
      );
    },
  };
}
