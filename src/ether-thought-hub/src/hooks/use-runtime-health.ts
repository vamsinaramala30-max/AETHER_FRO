import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RuntimeHealthReport } from "@/lib/aether/types";

/** Health monitoring for all self-hosted runtimes AETHER can reach. */
export function useRuntimeHealth(enabled = true) {
  return useQuery<RuntimeHealthReport>({
    queryKey: ["aether", "runtime-health"],
    enabled,
    refetchInterval: 30_000,
    queryFn: async ({ signal }) => {
      const res = await fetch("/api/health", { signal });
      if (!res.ok) throw new Error(`Health check failed (${res.status})`);
      return (await res.json()) as RuntimeHealthReport;
    },
  });
}

/** Forces a fresh probe (bypasses the backend discovery cache). */
export function useRuntimeRefresh() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/health?refresh=1");
      if (!res.ok) throw new Error(`Health check failed (${res.status})`);
      return (await res.json()) as RuntimeHealthReport;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["aether", "runtime-health"], data);
      void queryClient.invalidateQueries({ queryKey: ["aether", "provider-status"] });
    },
  });
}
