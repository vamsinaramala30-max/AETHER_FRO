import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  providerErrorResponse,
  resolveChatRuntime,
  type ResolvedProvider,
} from "@/lib/aether/providers/registry.server";

const messageSchema = z.object({
  role: z.enum(["system", "user", "assistant", "tool"]),
  content: z.string().max(400_000),
  name: z.string().max(120).optional(),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(400),
  model: z.string().max(200).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(1).max(200_000).optional(),
  topP: z.number().min(0).max(1).optional(),
});

/**
 * POST /api/chat — AETHER streaming chat endpoint.
 * Emits `text/event-stream` with normalised JSON chunks:
 *   {"type":"delta","text":"..."} | {"type":"reasoning",...}
 *   {"type":"usage",...} | {"type":"error",...} | {"type":"done"}
 * The client never learns which vendor produced the tokens.
 */
export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed: z.infer<typeof bodySchema>;
        try {
          parsed = bodySchema.parse(await request.json());
        } catch (error) {
          return Response.json(
            {
              error: {
                code: "invalid_request",
                message:
                  error instanceof z.ZodError
                    ? error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
                    : "Malformed AETHER chat request",
              },
            },
            { status: 400 },
          );
        }

        let resolved: ResolvedProvider;
        try {
          resolved = await resolveChatRuntime(request.signal);
        } catch (error) {
          return providerErrorResponse(error);
        }
        const { adapter, config } = resolved;

        const encoder = new TextEncoder();
        const controller = new AbortController();
        request.signal.addEventListener("abort", () => controller.abort());

        const stream = new ReadableStream<Uint8Array>({
          async start(sink) {
            const send = (payload: unknown) =>
              sink.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
            const request$ = {
              messages: parsed.messages,
              model: parsed.model || config.defaultModel,
              temperature: parsed.temperature,
              maxTokens: parsed.maxTokens,
              topP: parsed.topP,
              signal: controller.signal,
            };
            try {
              // Error recovery: a local runtime that is still loading weights
              // often refuses the first connection. Retry until the first token
              // is emitted; never retry mid-stream (would duplicate output).
              let attempt = 0;
              let emitted = false;
              for (;;) {
                try {
                  for await (const chunk of adapter.streamChat(request$)) {
                    if (chunk.type === "delta" || chunk.type === "reasoning") emitted = true;
                    send(chunk);
                    if (chunk.type === "done") break;
                  }
                  break;
                } catch (streamError) {
                  if (emitted || controller.signal.aborted || attempt >= 2) throw streamError;
                  attempt += 1;
                  await new Promise((r) => setTimeout(r, 400 * attempt));
                }
              }
            } catch (error) {
              if (controller.signal.aborted) {
                send({ type: "done", finishReason: "aborted" });
              } else {
                const message =
                  error instanceof Error ? error.message : "AETHER provider stream failed";
                const code =
                  typeof error === "object" && error && "code" in error
                    ? String((error as { code: unknown }).code)
                    : "provider_error";
                send({ type: "error", code, message });
              }
            } finally {
              sink.close();
            }
          },
          cancel() {
            controller.abort();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
