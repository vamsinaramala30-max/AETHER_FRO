import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  providerErrorResponse,
  resolveEmbeddingRuntime,
} from "@/lib/aether/providers/registry.server";

const bodySchema = z.object({
  input: z.array(z.string().min(1).max(32_000)).min(1).max(128),
  model: z.string().max(200).optional(),
});

/**
 * POST /api/rag/embed — vendor-neutral embedding endpoint used by the AETHER
 * vector-search abstraction. Returns dense vectors; the caller stores them in
 * whichever vector backend is registered on the client.
 */
export const Route = createFileRoute("/api/rag/embed")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed: z.infer<typeof bodySchema>;
        try {
          parsed = bodySchema.parse(await request.json());
        } catch {
          return Response.json(
            { error: { code: "invalid_request", message: "Malformed embedding request" } },
            { status: 400 },
          );
        }
        try {
          const { adapter, config } = await resolveEmbeddingRuntime(request.signal);
          const model = parsed.model || config.embeddingModel;
          if (!model) {
            return Response.json(
              {
                error: {
                  code: "embedding_model_missing",
                  message:
                    "AETHER embedding model not configured — set AETHER_EMBEDDING_MODEL to enable semantic vector search.",
                },
              },
              { status: 503 },
            );
          }
          const vectors = await adapter.embed(parsed.input, model, request.signal);
          return Response.json({
            model,
            dimensions: vectors[0]?.length ?? 0,
            vectors,
          });
        } catch (error) {
          return providerErrorResponse(error);
        }
      },
    },
  },
});
