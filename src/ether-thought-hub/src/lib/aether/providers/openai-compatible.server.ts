import { assertOk, readSseData } from "./http.server";
import {
  AetherProviderError,
  type AetherChatRequest,
  type AetherModelInfo,
  type AetherProviderAdapter,
  type AetherProviderConfig,
  type AetherStreamChunk,
} from "./types";

/**
 * Covers every OpenAI-compatible endpoint: OpenAI, DeepSeek, LM Studio,
 * LocalAI, vLLM, Groq, Together, OpenRouter and Ollama's /v1 shim.
 */
export function createOpenAICompatibleAdapter(
  config: AetherProviderConfig,
): AetherProviderAdapter {
  const base = config.baseUrl.replace(/\/+$/, "");
  const label = `AETHER · ${config.provider}`;

  const headers = (): Record<string, string> => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (config.apiKey) h["Authorization"] = `Bearer ${config.apiKey}`;
    return h;
  };

  return {
    id: "openai-compatible",
    label,

    async listModels(signal) {
      const res = await fetch(`${base}/models`, { headers: headers(), signal: signal ?? null });
      await assertOk(res, label);
      const json = (await res.json()) as { data?: Array<{ id?: string }> };
      return (json.data ?? [])
        .map((m) => m.id)
        .filter((id): id is string => typeof id === "string")
        .map<AetherModelInfo>((id) => ({ id, label: id }));
    },

    async *streamChat(request: AetherChatRequest): AsyncIterable<AetherStreamChunk> {
      const res = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: headers(),
        signal: request.signal ?? null,
        body: JSON.stringify({
          model: request.model || config.defaultModel,
          messages: request.messages.map((m) => ({
            role: m.role === "tool" ? "assistant" : m.role,
            content: m.content,
          })),
          stream: true,
          stream_options: { include_usage: true },
          temperature: request.temperature,
          top_p: request.topP,
          max_tokens: request.maxTokens,
        }),
      });
      await assertOk(res, label);

      for await (const payload of readSseData(res)) {
        if (payload === "[DONE]") {
          yield { type: "done" };
          return;
        }
        let parsed: {
          choices?: Array<{
            delta?: { content?: string | null; reasoning_content?: string | null };
            finish_reason?: string | null;
          }>;
          usage?: { prompt_tokens?: number; completion_tokens?: number };
        };
        try {
          parsed = JSON.parse(payload);
        } catch {
          continue;
        }
        const choice = parsed.choices?.[0];
        const reasoning = choice?.delta?.reasoning_content;
        if (reasoning) yield { type: "reasoning", text: reasoning };
        const text = choice?.delta?.content;
        if (text) yield { type: "delta", text };
        if (parsed.usage) {
          yield {
            type: "usage",
            promptTokens: parsed.usage.prompt_tokens,
            completionTokens: parsed.usage.completion_tokens,
          };
        }
        if (choice?.finish_reason) yield { type: "done", finishReason: choice.finish_reason };
      }
      yield { type: "done" };
    },

    async embed(input, model, signal) {
      const res = await fetch(`${base}/embeddings`, {
        method: "POST",
        headers: headers(),
        signal: signal ?? null,
        body: JSON.stringify({ model: model || config.embeddingModel, input }),
      });
      await assertOk(res, label);
      const json = (await res.json()) as { data?: Array<{ embedding?: number[] }> };
      const vectors = (json.data ?? []).map((d) => d.embedding ?? []);
      if (vectors.length !== input.length) {
        throw new AetherProviderError("Embedding count mismatch from provider");
      }
      return vectors;
    },
  };
}
