import { createFileRoute } from "@tanstack/react-router";
import {
  providerErrorResponse,
  resolveChatRuntime,
} from "@/lib/aether/providers/registry.server";

/** GET /api/models — available models plus AETHER runtime status. */
export const Route = createFileRoute("/api/models")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { adapter, config, discovered } = await resolveChatRuntime(request.signal);
          let models: Array<{ id: string; label: string; contextWindow?: number }> = [];
          let warning: string | null = null;
          try {
            models = await adapter.listModels(request.signal);
          } catch (error) {
            warning =
              error instanceof Error
                ? `Model discovery unavailable: ${error.message}`
                : "Model discovery unavailable";
          }
          if (config.defaultModel && !models.some((m) => m.id === config.defaultModel)) {
            models.unshift({ id: config.defaultModel, label: config.defaultModel });
          }
          return Response.json({
            configured: true,
            runtime: `${adapter.label}${discovered ? " (auto-detected)" : ""}`,
            adapter: adapter.id,
            discovered,
            defaultModel: config.defaultModel || models[0]?.id || "",
            embeddingModel: config.embeddingModel || "",
            models,
            warning,
          });
        } catch (error) {
          const res = providerErrorResponse(error);
          if (res.status === 503) {
            const body = (await res.json()) as { error: { code: string; message: string } };
            return Response.json({ configured: false, models: [], ...body }, { status: 200 });
          }
          return res;
        }
      },
    },
  },
});
