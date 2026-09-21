import { assertOk, readSseData } from "./http.server";
import {
  type AetherChatRequest,
  type AetherProviderAdapter,
  type AetherProviderConfig,
  type AetherStreamChunk,
} from "./types";

/** Google Gemini (generativelanguage) adapter. */
export function createGeminiAdapter(config: AetherProviderConfig): AetherProviderAdapter {
  const base = (config.baseUrl || "https://generativelanguage.googleapis.com/v1beta").replace(
    /\/+$/,
    "",
  );
  const label = "AETHER · gemini";
  const key = () => `key=${encodeURIComponent(config.apiKey)}`;

  return {
    id: "gemini",
    label,

    async listModels(signal) {
      const res = await fetch(`${base}/models?${key()}`, { signal: signal ?? null });
      await assertOk(res, label);
      const json = (await res.json()) as {
        models?: Array<{ name?: string; displayName?: string; inputTokenLimit?: number }>;
      };
      return (json.models ?? [])
        .filter((m) => typeof m.name === "string")
        .map((m) => {
          const id = m.name!.replace(/^models\//, "");
          return {
            id,
            label: m.displayName ?? id,
            ...(m.inputTokenLimit ? { contextWindow: m.inputTokenLimit } : {}),
          };
        });
    },

    async *streamChat(request: AetherChatRequest): AsyncIterable<AetherStreamChunk> {
      const model = request.model || config.defaultModel;
      const systemText = request.messages
        .filter((m) => m.role === "system")
        .map((m) => m.content)
        .join("\n\n");
      const contents = request.messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

      const res = await fetch(
        `${base}/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&${key()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: request.signal ?? null,
          body: JSON.stringify({
            contents,
            ...(systemText ? { systemInstruction: { parts: [{ text: systemText }] } } : {}),
            generationConfig: {
              temperature: request.temperature,
              topP: request.topP,
              maxOutputTokens: request.maxTokens,
            },
          }),
        },
      );
      await assertOk(res, label);

      for await (const payload of readSseData(res)) {
        let event: {
          candidates?: Array<{
            content?: { parts?: Array<{ text?: string }> };
            finishReason?: string;
          }>;
          usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
        };
        try {
          event = JSON.parse(payload);
        } catch {
          continue;
        }
        const parts = event.candidates?.[0]?.content?.parts ?? [];
        for (const part of parts) if (part.text) yield { type: "delta", text: part.text };
        if (event.usageMetadata) {
          yield {
            type: "usage",
            promptTokens: event.usageMetadata.promptTokenCount,
            completionTokens: event.usageMetadata.candidatesTokenCount,
          };
        }
        const finish = event.candidates?.[0]?.finishReason;
        if (finish) yield { type: "done", finishReason: finish };
      }
      yield { type: "done" };
    },

    async embed(input, model, signal) {
      const embedModel = model || config.embeddingModel || "text-embedding-004";
      const res = await fetch(
        `${base}/models/${encodeURIComponent(embedModel)}:batchEmbedContents?${key()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: signal ?? null,
          body: JSON.stringify({
            requests: input.map((text) => ({
              model: `models/${embedModel}`,
              content: { parts: [{ text }] },
            })),
          }),
        },
      );
      await assertOk(res, label);
      const json = (await res.json()) as { embeddings?: Array<{ values?: number[] }> };
      return (json.embeddings ?? []).map((e) => e.values ?? []);
    },
  };
}
