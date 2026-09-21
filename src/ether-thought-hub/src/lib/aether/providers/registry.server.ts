import { createAnthropicAdapter } from "./anthropic.server";
import { discoverLocalRuntime, type RuntimeHealth } from "./discovery.server";
import { createGeminiAdapter } from "./gemini.server";
import { createOllamaAdapter } from "./ollama.server";
import { createOpenAICompatibleAdapter } from "./openai-compatible.server";
import {
  AetherNotConfiguredError,
  type AetherProviderAdapter,
  type AetherProviderConfig,
} from "./types";

/**
 * Provider registry — self-hosted first.
 *
 * Everything is driven by environment configuration, so a provider swap never
 * touches a single line of UI code. When AETHER_PROVIDER is not set, the
 * backend auto-discovers a locally running open-source runtime (Ollama,
 * llama.cpp, vLLM, LM Studio, LocalAI, TGI) and adopts it.
 *
 *   AETHER_PROVIDER            ollama | llamacpp | vllm | lmstudio | localai | tgi |
 *                              openai-compatible | openai | deepseek | anthropic | gemini
 *   AETHER_BASE_URL            endpoint root (optional when a default exists)
 *   AETHER_API_KEY             credential (optional for local runtimes)
 *   AETHER_MODEL               default chat model id
 *   AETHER_EMBEDDING_MODEL     default embedding model id
 *   AETHER_EMBEDDING_BASE_URL  optional dedicated OpenAI-compatible embedding endpoint
 *   AETHER_EMBEDDING_API_KEY   optional credential for that endpoint
 *   AETHER_DISCOVERY_ENDPOINTS extra runtimes to probe, e.g. "ollama@http://gpu:11434"
 */

const DEFAULT_BASE_URLS: Record<string, string> = {
  // Self-hosted / open-source runtimes.
  ollama: "http://127.0.0.1:11434",
  llamacpp: "http://127.0.0.1:8080/v1",
  vllm: "http://127.0.0.1:8000/v1",
  lmstudio: "http://127.0.0.1:1234/v1",
  localai: "http://127.0.0.1:8081/v1",
  tgi: "http://127.0.0.1:8085/v1",
  "openai-compatible": "",
  // Optional hosted endpoints, never required by AETHER.
  openai: "https://api.openai.com/v1",
  deepseek: "https://api.deepseek.com/v1",
  anthropic: "https://api.anthropic.com/v1",
  gemini: "https://generativelanguage.googleapis.com/v1beta",
};

const KEY_REQUIRED = new Set(["openai", "deepseek", "anthropic", "gemini"]);

export const SUPPORTED_PROVIDERS = Object.keys(DEFAULT_BASE_URLS);
export const SELF_HOSTED_PROVIDERS = [
  "ollama",
  "llamacpp",
  "vllm",
  "lmstudio",
  "localai",
  "tgi",
  "openai-compatible",
];

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

/** Returns null when no provider is explicitly configured (discovery mode). */
export function readProviderConfigOrNull(): AetherProviderConfig | null {
  const provider = env("AETHER_PROVIDER").toLowerCase();
  if (!provider) return null;
  if (!(provider in DEFAULT_BASE_URLS)) {
    throw new AetherNotConfiguredError(
      `unknown provider "${provider}". Supported: ${SUPPORTED_PROVIDERS.join(", ")}`,
    );
  }
  const baseUrl = env("AETHER_BASE_URL") || DEFAULT_BASE_URLS[provider] || "";
  if (!baseUrl) {
    throw new AetherNotConfiguredError("set AETHER_BASE_URL for this provider");
  }
  const apiKey = env("AETHER_API_KEY");
  if (!apiKey && KEY_REQUIRED.has(provider)) {
    throw new AetherNotConfiguredError(`set AETHER_API_KEY for provider "${provider}"`);
  }
  return {
    provider,
    baseUrl,
    apiKey,
    defaultModel: env("AETHER_MODEL"),
    embeddingModel: env("AETHER_EMBEDDING_MODEL"),
  };
}

export function readProviderConfig(): AetherProviderConfig {
  const config = readProviderConfigOrNull();
  if (!config) {
    throw new AetherNotConfiguredError(
      "set AETHER_PROVIDER to one of: " + SUPPORTED_PROVIDERS.join(", "),
    );
  }
  return config;
}

export function createAdapter(config: AetherProviderConfig): AetherProviderAdapter {
  switch (config.provider) {
    case "anthropic":
      return createAnthropicAdapter(config);
    case "gemini":
      return createGeminiAdapter(config);
    case "ollama":
      return createOllamaAdapter(config);
    default:
      // llama.cpp, vLLM, LM Studio, LocalAI and TGI all speak the
      // OpenAI-compatible chat/completions + embeddings dialect.
      return createOpenAICompatibleAdapter(config);
  }
}

export interface ResolvedProvider {
  adapter: AetherProviderAdapter;
  config: AetherProviderConfig;
  /** True when the runtime was auto-detected rather than configured. */
  discovered: boolean;
  health?: RuntimeHealth | undefined;
}

const NO_RUNTIME_HINT =
  "no local LLM runtime detected. Start a self-hosted runtime (e.g. `ollama serve`, " +
  "`llama-server --port 8080`, vLLM on :8000, LM Studio on :1234, LocalAI on :8081, TGI on :8085) " +
  "or set AETHER_PROVIDER and AETHER_BASE_URL";

/**
 * Resolves the active chat runtime: explicit configuration wins, otherwise
 * AETHER discovers a healthy local runtime.
 */
export async function resolveChatRuntime(signal?: AbortSignal): Promise<ResolvedProvider> {
  const explicit = readProviderConfigOrNull();
  if (explicit) {
    return { adapter: createAdapter(explicit), config: explicit, discovered: false };
  }
  const found = await discoverLocalRuntime(signal);
  if (!found) throw new AetherNotConfiguredError(NO_RUNTIME_HINT);
  return {
    adapter: createAdapter(found.config),
    config: found.config,
    discovered: true,
    health: found.health,
  };
}

/** Synchronous variant for callers that require explicit configuration. */
export function resolveChatAdapter(): {
  adapter: AetherProviderAdapter;
  config: AetherProviderConfig;
} {
  const config = readProviderConfig();
  return { adapter: createAdapter(config), config };
}

/**
 * Embeddings can come from a dedicated endpoint (common when the chat runtime
 * is a llama.cpp server without an embedding model loaded).
 */
export async function resolveEmbeddingRuntime(signal?: AbortSignal): Promise<ResolvedProvider> {
  const dedicatedBase = env("AETHER_EMBEDDING_BASE_URL");
  if (dedicatedBase) {
    const config: AetherProviderConfig = {
      provider: "openai-compatible",
      baseUrl: dedicatedBase,
      apiKey: env("AETHER_EMBEDDING_API_KEY") || env("AETHER_API_KEY"),
      defaultModel: "",
      embeddingModel: env("AETHER_EMBEDDING_MODEL"),
    };
    return { adapter: createOpenAICompatibleAdapter(config), config, discovered: false };
  }
  return resolveChatRuntime(signal);
}

export function providerErrorResponse(error: unknown): Response {
  const status =
    typeof error === "object" && error && "status" in error
      ? Number((error as { status: unknown }).status) || 502
      : 502;
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code: unknown }).code)
      : "provider_error";
  const message = error instanceof Error ? error.message : "Unexpected AETHER provider failure";
  return Response.json({ error: { code, message } }, { status });
}
