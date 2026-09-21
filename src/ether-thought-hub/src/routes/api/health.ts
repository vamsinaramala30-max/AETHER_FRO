import { createFileRoute } from "@tanstack/react-router";
import {
  invalidateDiscoveryCache,
  probeAllRuntimes,
} from "@/lib/aether/providers/discovery.server";
import { readProviderConfigOrNull } from "@/lib/aether/providers/registry.server";

/**
 * GET /api/health — health monitoring for every self-hosted runtime AETHER
 * knows about. Returns reachability, latency and the models each runtime
 * currently serves. No credentials or endpoints of hosted vendors are leaked
 * beyond the local endpoint list the operator configured.
 */
export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.get("refresh") === "1") invalidateDiscoveryCache();
        const explicit = readProviderConfigOrNull();
        const runtimes = await probeAllRuntimes(request.signal);
        return Response.json(
          {
            mode: explicit ? "configured" : "discovery",
            configuredProvider: explicit?.provider ?? null,
            healthy: runtimes.filter((r) => r.reachable && r.models.length).length,
            runtimes: runtimes.map((r) => ({
              provider: r.provider,
              label: r.label,
              endpoint: r.baseUrl,
              reachable: r.reachable,
              latencyMs: r.latencyMs,
              modelCount: r.models.length,
              models: r.models.slice(0, 24),
              error: r.error,
            })),
            checkedAt: Date.now(),
          },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
