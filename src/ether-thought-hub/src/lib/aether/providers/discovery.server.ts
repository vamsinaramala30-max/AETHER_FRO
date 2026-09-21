import type { AetherProviderConfig } from "./types";

/**
 * Local runtime discovery + health monitoring.
 *
 * AETHER is self-hosted-first: when no AETHER_PROVIDER is configured the
 * backend probes the well-known endpoints of open-source inference runtimes
 * and adopts the first healthy one. The frontend never learns which runtime
 * or model answered — it only sees `/api/models` and `/api/health`.
 */

export interface RuntimeCandidate {
  /** Provider key understood by the adapter registry. */
  provider: string;
  label: string;
  baseUrl: string;
  /** "openai" = GET {baseUrl}/models, "ollama" = GET {baseUrl}/api/tags */
  probe: "openai" | "ollama";
}

export interface RuntimeHealth extends RuntimeCandidate {
  reachable: boolean;
  latencyMs: number | null;
  models: string[];
  error: string | null;
}

const BUILTIN_CANDIDATES: RuntimeCandidate[] = [
  {
    provider: "ollama",
    label: "Ollama",
    baseUrl: "http://127.0.0.1:11434",
    probe: "ollama",
  },
  {
    provider: "lmstudio",
    label: "LM Studio",
    baseUrl: "http://127.0.0.1:1234/v1",
    probe: "openai",
  },
  {
    provider: "llamacpp",
    label: "llama.cpp server",
    baseUrl: "http://127.0.0.1:8080/v1",
    probe: "openai",
  },
  {
    provider: "vllm",
    label: "vLLM",
    baseUrl: "http://127.0.0.1:8000/v1",
    probe: "openai",
  },
  {
    provider: "localai",
    label: "LocalAI",
    baseUrl: "http://127.0.0.1:8081/v1",
    probe: "openai",
  },
  {
    provider: "tgi",
    label: "Text Generation Inference",
    baseUrl: "http://127.0.0.1:8085/v1",
    probe: "openai",
  },
];

/**
 * Extra endpoints may be declared with
 * AETHER_DISCOVERY_ENDPOINTS="llamacpp@http://gpu-box:8080/v1,ollama@http://gpu-box:11434"
 */
function extraCandidates(): RuntimeCandidate[] {
  const raw = (process.env["AETHER_DISCOVERY_ENDPOINTS"] ?? "").trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const at = entry.indexOf("@");
      const provider = at === -1 ? "openai-compatible" : entry.slice(0, at).trim().toLowerCase();
      const baseUrl = (at === -1 ? entry : entry.slice(at + 1)).trim().replace(/\/+$/, "");
      return {
        provider,
        label: provider,
        baseUrl,
        probe: provider === "ollama" ? ("ollama" as const) : ("openai" as const),
      };
    })
    .filter((c) => !!c.baseUrl);
}

export function runtimeCandidates(): RuntimeCandidate[] {
  const all = [...extraCandidates(), ...BUILTIN_CANDIDATES];
  const seen = new Set<string>();
  return all.filter((c) => {
    const key = `${c.provider}|${c.baseUrl}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const PROBE_TIMEOUT_MS = 1500;

async function probe(candidate: RuntimeCandidate, signal?: AbortSignal): Promise<RuntimeHealth> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);
  const base = candidate.baseUrl.replace(/\/+$/, "");
  const url = candidate.probe === "ollama" ? `${base}/api/tags` : `${base}/models`;
  const apiKey = (process.env["AETHER_API_KEY"] ?? "").trim();

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    });
    if (!res.ok) {
      return {
        ...candidate,
        reachable: false,
        latencyMs: Date.now() - started,
        models: [],
        error: `HTTP ${res.status}`,
      };
    }
    const json = (await res.json()) as {
      data?: Array<{ id?: string }>;
      models?: Array<{ name?: string; model?: string }>;
    };
    const models =
      candidate.probe === "ollama"
        ? (json.models ?? [])
            .map((m) => m.name ?? m.model)
            .filter((id): id is string => typeof id === "string")
        : (json.data ?? [])
            .map((m) => m.id)
            .filter((id): id is string => typeof id === "string");
    return {
      ...candidate,
      reachable: true,
      latencyMs: Date.now() - started,
      models,
      error: null,
    };
  } catch (error) {
    return {
      ...candidate,
      reachable: false,
      latencyMs: null,
      models: [],
      error:
        error instanceof Error
          ? error.name === "AbortError"
            ? "no response (timeout)"
            : error.message
          : "unreachable",
    };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}

/** Probes every candidate concurrently — used by GET /api/health. */
export async function probeAllRuntimes(signal?: AbortSignal): Promise<RuntimeHealth[]> {
  return Promise.all(runtimeCandidates().map((candidate) => probe(candidate, signal)));
}

interface DiscoveryCache {
  at: number;
  health: RuntimeHealth | null;
}

const CACHE_TTL_MS = 15_000;
let cache: DiscoveryCache | null = null;

/** Returns the first healthy local runtime, cached briefly to avoid probe storms. */
export async function discoverLocalRuntime(
  signal?: AbortSignal,
): Promise<{ config: AetherProviderConfig; health: RuntimeHealth } | null> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.health ? { config: configFor(cache.health), health: cache.health } : null;
  }
  const results = await probeAllRuntimes(signal);
  const healthy = results.find((r) => r.reachable && r.models.length) ?? null;
  cache = { at: Date.now(), health: healthy };
  return healthy ? { config: configFor(healthy), health: healthy } : null;
}

export function invalidateDiscoveryCache() {
  cache = null;
}

function configFor(health: RuntimeHealth): AetherProviderConfig {
  const preferred = (process.env["AETHER_MODEL"] ?? "").trim();
  const model = preferred && health.models.includes(preferred) ? preferred : (health.models[0] ?? "");
  const embeddingModel = (process.env["AETHER_EMBEDDING_MODEL"] ?? "").trim();
  return {
    provider: health.provider,
    baseUrl: health.baseUrl,
    apiKey: (process.env["AETHER_API_KEY"] ?? "").trim(),
    defaultModel: model,
    embeddingModel:
      embeddingModel ||
      health.models.find((m) => /embed|bge|minilm|nomic|gte/i.test(m)) ||
      "",
  };
}
