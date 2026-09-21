import { useQuery } from "@tanstack/react-query";
import { aetherApi } from "@/lib/aether/api";
import type { ProviderStatus } from "@/lib/aether/types";

/** Runtime status of the pluggable AETHER provider adapter. */
export function useProviderStatus() {
  return useQuery<ProviderStatus>({
    queryKey: ["aether", "provider-status"],
    queryFn: ({ signal }) => aetherApi.getModels(signal),
    staleTime: 60_000,
    retry: 1,
  });
}
