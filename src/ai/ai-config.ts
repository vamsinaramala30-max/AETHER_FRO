// ============================================================================
// AETHER AI — Configuration
// ============================================================================

/**
 * Backend endpoint configuration for the AETHER AI system.
 * All AI communication goes through the AETHER backend, never to cloud AI APIs directly.
 */
export interface AIBackendConfig {
  /** Base URL for the AETHER backend AI API */
  baseUrl: string;
  /** Request timeout in milliseconds */
  timeoutMs: number;
  /** Streaming endpoint path */
  streamPath: string;
  /** Chat/completion endpoint path */
  chatPath: string;
  /** Models endpoint path */
  modelsPath: string;
  /** Memory endpoint path */
  memoryPath: string;
  /** Knowledge/RAG endpoint path */
  knowledgePath: string;
  /** Agent endpoint path */
  agentPath: string;
  /** Tools endpoint path */
  toolsPath: string;
  /** Prompts endpoint path */
  promptsPath: string;
  /** Health check endpoint path */
  healthPath: string;
}

export interface AIStreamingConfig {
  /** Maximum time (ms) to wait for the first streaming chunk */
  firstChunkTimeoutMs: number;
  /** Maximum streaming session duration (ms) */
  maxDurationMs: number;
  /** Reconnect attempts on failure */
  maxRetries: number;
  /** Delay between retry attempts (ms) */
  retryDelayMs: number;
}

export interface AIRAGConfig {
  /** Maximum number of chunks to retrieve */
  topK: number;
  /** Minimum similarity score for retrieval */
  minScore: number;
  /** Whether reranking is enabled by default */
  rerankEnabled: boolean;
  /** Maximum characters per chunk for context building */
  maxCharsPerChunk: number;
  /** Maximum total context characters from RAG */
  maxContextChars: number;
}

export interface AIMemoryConfig {
  /** Maximum working memory entries */
  maxWorkingEntries: number;
  /** Maximum conversation memory entries */
  maxConversationEntries: number;
  /** Long-term memory search results limit */
  longTermSearchLimit: number;
}

export interface AIAgentConfig {
  /** Maximum reasoning steps before forced stop */
  maxSteps: number;
  /** Maximum time (ms) for a single agent step */
  stepTimeoutMs: number;
  /** Maximum total agent session duration (ms) */
  maxSessionDurationMs: number;
}

export interface AIConfig {
  backend: AIBackendConfig;
  streaming: AIStreamingConfig;
  rag: AIRAGConfig;
  memory: AIMemoryConfig;
  agent: AIAgentConfig;
}

// ---------------------------------------------------------------------------
// Default Config — reads from Vite env variables (no hardcoded secrets)
// ---------------------------------------------------------------------------

const BACKEND_BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as unknown as Record<string, unknown>).env
    ? ((import.meta as unknown as { env: Record<string, string> }).env['VITE_API_BASE_URL'] ?? '')
    : '') || 'http://localhost:5001/api/v1';

export const DEFAULT_AI_CONFIG: AIConfig = {
  backend: {
    baseUrl: BACKEND_BASE_URL,
    timeoutMs: 60_000,
    streamPath: '/ai/stream',
    chatPath: '/ai/chat',
    modelsPath: '/ai/models',
    memoryPath: '/ai/memory',
    knowledgePath: '/knowledge',
    agentPath: '/ai/agent',
    toolsPath: '/ai/tools',
    promptsPath: '/ai/prompts',
    healthPath: '/ai/health',
  },
  streaming: {
    firstChunkTimeoutMs: 15_000,
    maxDurationMs: 300_000,
    maxRetries: 2,
    retryDelayMs: 1_000,
  },
  rag: {
    topK: 5,
    minScore: 0.6,
    rerankEnabled: true,
    maxCharsPerChunk: 1_500,
    maxContextChars: 8_000,
  },
  memory: {
    maxWorkingEntries: 20,
    maxConversationEntries: 50,
    longTermSearchLimit: 10,
  },
  agent: {
    maxSteps: 10,
    stepTimeoutMs: 30_000,
    maxSessionDurationMs: 300_000,
  },
};
