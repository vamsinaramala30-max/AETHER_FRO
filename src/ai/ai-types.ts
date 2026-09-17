// ============================================================================
// AETHER AI — Core Type Definitions
// ============================================================================

// ---------------------------------------------------------------------------
// Error Codes
// ---------------------------------------------------------------------------

export type AIErrorCode =
  | 'MODEL_UNAVAILABLE'
  | 'MODEL_LOAD_FAILED'
  | 'GENERATION_FAILED'
  | 'STREAM_FAILED'
  | 'INVALID_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONTEXT_TOO_LARGE'
  | 'RAG_FAILED'
  | 'MEMORY_FAILED'
  | 'TOOL_FAILED'
  | 'AGENT_FAILED'
  | 'TIMEOUT'
  | 'CANCELLED'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_ERROR'
  | 'VERIFICATION_FAILED'
  | 'PLANNING_FAILED'
  | 'RATE_LIMIT'
  | 'QUOTA_EXCEEDED'
  | 'UNKNOWN_ERROR';

export interface AIError {
  code: AIErrorCode;
  message: string;
  details?: Record<string, unknown>;
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Service Result Pattern
// ---------------------------------------------------------------------------

export type AIResult<T> = { success: true; data: T } | { success: false; error: AIError };

export function aiSuccess<T>(data: T): AIResult<T> {
  return { success: true, data };
}

export function createAIError(
  code: AIErrorCode,
  message: string,
  details?: Record<string, unknown>,
): AIError {
  return { code, message, details, timestamp: Date.now() };
}

export function aiFailure(
  code: AIErrorCode,
  message: string,
  details?: Record<string, unknown>,
): AIResult<never> {
  return { success: false, error: createAIError(code, message, details) };
}

// ---------------------------------------------------------------------------
// AI Connection / Service Status
// ---------------------------------------------------------------------------

export type AIConnectionStatus =
  'connected' | 'connecting' | 'unavailable' | 'error' | 'generating' | 'streaming';

// ---------------------------------------------------------------------------
// Message Types
// ---------------------------------------------------------------------------

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export type MessageStatus = 'sending' | 'sent' | 'streaming' | 'delivered' | 'error' | 'cancelled';

export interface SourceCitationRef {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
  score?: number;
  documentId?: string;
  chunkIndex?: number;
}

export type ActionState =
  | 'PLANNED'
  | 'VALIDATING'
  | 'AUTHORIZED'
  | 'READY'
  | 'BLOCKED'
  | 'NEEDS_CLARIFICATION'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'COMPLETED'
  | 'FAILED'
  | 'TIMED_OUT'
  | 'DENIED'
  | 'CANCELLED'
  | 'REQUESTED'
  | 'SKIPPED'
  | 'EXECUTED'
  | 'SUCCESS'
  | 'pending'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface ToolInvocationRef {
  id: string;
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
  status: ActionState;
  actionState?: ActionState;
  error?: string;
  verified?: boolean;
  verificationDetails?: string;
  riskLevel?:
    | 'READ_ONLY'
    | 'LOW_RISK'
    | 'MODIFY'
    | 'HIGH_IMPACT'
    | 'READ'
    | 'LOW_RISK_WRITE'
    | 'HIGH_RISK_WRITE'
    | 'DESTRUCTIVE';
  startedAt?: number;
  completedAt?: number;
}

export interface ActionInvocationRef {
  actionId: string;
  toolName: string;
  parameters: Record<string, unknown>;
  status: ActionState;
  result?: unknown;
  error?: string;
  verified?: boolean;
  verificationDetails?: string;
  riskLevel?:
    | 'READ_ONLY'
    | 'LOW_RISK'
    | 'MODIFY'
    | 'HIGH_IMPACT'
    | 'READ'
    | 'LOW_RISK_WRITE'
    | 'HIGH_RISK_WRITE'
    | 'DESTRUCTIVE';
  startedAt?: number;
  completedAt?: number;
}

export interface PlanStepRef {
  stepId: string;
  stepNumber: number;
  description: string;
  toolName?: string;
  status: ActionState;
  actionState?: ActionState;
  dependencies?: string[];
  requiresConfirmation?: boolean;
  verified?: boolean;
  verificationDetails?: string;
  error?: string;
}

export interface ActionPlanRef {
  planId: string;
  objective: string;
  status:
    | 'PENDING'
    | 'UNDERSTANDING'
    | 'PLANNING'
    | 'VALIDATING'
    | 'READY'
    | 'HANDED_OFF'
    | 'NEEDS_CLARIFICATION'
    | 'BLOCKED'
    | 'EXECUTING'
    | 'SUCCESS'
    | 'PARTIAL_SUCCESS'
    | 'FAILED'
    | 'CANCELLED';
  steps: PlanStepRef[];
  successfulStepsCount?: number;
  failedStepsCount?: number;
  summary?: string;
  constraints?: string[];
  assumptions?: string[];
  clarificationRequest?: {
    question: string;
    missingInfo: string[];
    suggestedAnswers?: string[];
  };
  planHash?: string;
  version?: number;
}

export type ConfidenceLevel =
  'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE' | 'INSUFFICIENT_INFORMATION';

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'PENDING'
  | 'VERIFIED'
  | 'FAILED'
  | 'PARTIALLY_VERIFIED'
  | 'NOT_VERIFIABLE';

export interface EvidenceItemRef {
  sourceType:
    | 'user_input'
    | 'conversation_context'
    | 'approved_memory'
    | 'retrieved_knowledge'
    | 'tool_result'
    | 'model_knowledge';
  sourceId?: string;
  content: string;
  relevance: number;
  verified: boolean;
  verificationStatus?: VerificationStatus;
  metadata?: Record<string, unknown>;
}

export interface PendingConfirmation {
  actionId: string;
  toolName: string;
  description: string;
  riskLevel:
    | 'READ'
    | 'LOW_RISK_WRITE'
    | 'HIGH_RISK_WRITE'
    | 'DESTRUCTIVE'
    | 'READ_ONLY'
    | 'LOW_RISK'
    | 'MODIFY'
    | 'HIGH_IMPACT';
  args: Record<string, unknown>;
  executionId?: string;
  stepId?: string;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  createdAt: number;
  updatedAt: number;
  error?: string;
  confidence?: ConfidenceLevel;
  verificationStatus?: VerificationStatus;
  evidence?: EvidenceItemRef[];
  turnEvidence?: EvidenceItemRef[];
  confirmationRequest?: PendingConfirmation;
  citations?: SourceCitationRef[];
  toolInvocations?: ToolInvocationRef[];
  plan?: ActionPlanRef;
  canonicalPlan?: ActionPlanRef;
  ragContext?: string[];
  tokens?: {
    prompt?: number;
    completion?: number;
    total?: number;
  };
}

// ---------------------------------------------------------------------------
// Conversation Types
// ---------------------------------------------------------------------------

export interface ConversationMetadata {
  model?: string;
  temperature?: number;
  tags?: string[];
  pinned?: boolean;
  archived?: boolean;
  totalTokens?: number;
  lastMessageSummary?: string;
  agentId?: string;
  promptTemplateId?: string;
}

export interface AIConversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: AIMessage[];
  metadata: ConversationMetadata;
  draft?: string;
}

// ---------------------------------------------------------------------------
// Model Types
// ---------------------------------------------------------------------------

export type ModelRuntimeType = 'local' | 'remote' | 'unknown';

export type ModelStatus =
  'available' | 'loading' | 'loaded' | 'unloading' | 'unavailable' | 'error';

export interface AIModelInfo {
  id: string;
  name: string;
  description?: string;
  runtime: ModelRuntimeType;
  status: ModelStatus;
  contextWindow?: number;
  maxTokens?: number;
  supportsStreaming?: boolean;
  supportsTools?: boolean;
  supportsRAG?: boolean;
  supportsVision?: boolean;
  parametersB?: number;
  quantization?: string;
  family?: string;
  loadedAt?: number;
}

// ---------------------------------------------------------------------------
// Streaming Types
// ---------------------------------------------------------------------------

export type StreamingStatus =
  | 'idle'
  | 'starting'
  | 'streaming'
  | 'completing'
  | 'completed'
  | 'cancelled'
  | 'failed'
  | 'timeout';

export interface StreamingChunk {
  id: string;
  delta: string;
  index: number;
  done: boolean;
  finishReason?: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'cancelled';
  metadata?: Record<string, unknown>;
}

export interface StreamingSession {
  sessionId: string;
  conversationId: string;
  messageId: string;
  status: StreamingStatus;
  startedAt: number;
  completedAt?: number;
  totalChunks: number;
  abortController: AbortController;
}

// ---------------------------------------------------------------------------
// RAG Types
// ---------------------------------------------------------------------------

export type DocumentStatus = 'pending' | 'parsing' | 'chunking' | 'embedding' | 'indexed' | 'error';

export interface AIDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  status: DocumentStatus;
  chunkCount?: number;
  createdAt: number;
  updatedAt: number;
  error?: string;
  collectionId?: string;
}

export interface RAGChunk {
  id: string;
  documentId: string;
  content: string;
  index: number;
  tokenCount?: number;
  embedding?: number[];
}

export interface RetrievalResult {
  chunk: RAGChunk;
  score: number;
  documentName: string;
}

export interface RAGContext {
  query: string;
  results: RetrievalResult[];
  totalRetrieved: number;
  retrievedAt: number;
  rerankApplied: boolean;
}

export interface RAGStatus {
  enabled: boolean;
  documentCount: number;
  indexedCount: number;
  pendingCount: number;
  errorCount: number;
  lastIndexedAt?: number;
}

// ---------------------------------------------------------------------------
// Memory Types
// ---------------------------------------------------------------------------

export type MemoryScope = 'working' | 'conversation' | 'long_term';

export type MemoryEntryType = 'fact' | 'preference' | 'context' | 'instruction' | 'summary';

export interface MemoryEntry {
  id: string;
  scope: MemoryScope;
  type: MemoryEntryType;
  content: string;
  userId: string;
  conversationId?: string;
  score?: number;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
  tags?: string[];
}

export interface MemoryStatus {
  workingEntries: number;
  conversationEntries: number;
  longTermEntries: number;
  totalEntries: number;
  lastUpdatedAt?: number;
}

// ---------------------------------------------------------------------------
// Prompt Types
// ---------------------------------------------------------------------------

export type PromptCategory = 'system' | 'rag' | 'agent' | 'user' | 'custom';

export interface PromptVariable {
  name: string;
  description?: string;
  required: boolean;
  defaultValue?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  category: PromptCategory;
  template: string;
  variables: PromptVariable[];
  createdAt: number;
  updatedAt: number;
  isBuiltIn: boolean;
}

export interface BuiltPrompt {
  systemPrompt: string;
  userPrompt?: string;
  templateId?: string;
}

// ---------------------------------------------------------------------------
// Tool Types
// ---------------------------------------------------------------------------

export type ToolCategory = 'task' | 'project' | 'knowledge' | 'workspace' | 'system';

export type ToolStatus =
  'available' | 'pending' | 'executing' | 'completed' | 'failed' | 'disabled';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  parameters: ToolParameterSchema[];
  requiresAuth: boolean;
  enabled: boolean;
}

export interface ToolParameterSchema {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  required: boolean;
  enum?: string[];
}

export interface ToolExecutionRequest {
  toolId: string;
  toolName: string;
  args: Record<string, unknown>;
  conversationId: string;
  messageId: string;
}

export interface ToolExecutionResult {
  toolId: string;
  success: boolean;
  result?: unknown;
  error?: string;
  durationMs?: number;
}

export interface ToolRegistryStatus {
  totalTools: number;
  enabledTools: number;
  disabledTools: number;
  categories: ToolCategory[];
}

// ---------------------------------------------------------------------------
// Agent Types
// ---------------------------------------------------------------------------

export type AgentStatus =
  'idle' | 'planning' | 'running' | 'waiting' | 'completed' | 'failed' | 'cancelled';

export type AgentStepType = 'plan' | 'tool_call' | 'observation' | 'synthesis' | 'final_answer';

export interface AgentStep {
  id: string;
  type: AgentStepType;
  description: string;
  toolId?: string;
  toolArgs?: Record<string, unknown>;
  result?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: number;
  completedAt?: number;
}

export interface AgentDefinition {
  id: string;
  name: string;
  description?: string;
  systemPrompt?: string;
  tools: string[];
  modelId?: string;
  maxSteps?: number;
  createdAt: number;
  updatedAt: number;
  enabled: boolean;
}

export interface AgentSession {
  sessionId: string;
  agentId: string;
  conversationId: string;
  status: AgentStatus;
  steps: AgentStep[];
  goal: string;
  startedAt: number;
  completedAt?: number;
  result?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// AI Generation Request / Response
// ---------------------------------------------------------------------------

export interface GenerationRequest {
  conversationId: string;
  messages: Array<{ role: MessageRole; content: string }>;
  modelId?: string;
  stream?: boolean;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  ragContext?: RAGContext;
  tools?: ToolDefinition[];
  signal?: AbortSignal;
}

export interface GenerationResponse {
  messageId: string;
  conversationId: string;
  content: string;
  role: 'assistant';
  finishReason?: 'stop' | 'length' | 'tool_calls' | 'content_filter';
  citations?: SourceCitationRef[];
  toolInvocations?: ToolInvocationRef[];
  plan?: ActionPlanRef;
  canonicalPlan?: ActionPlanRef;
  confidence?: ConfidenceLevel;
  verificationStatus?: VerificationStatus;
  evidence?: EvidenceItemRef[];
  turnEvidence?: EvidenceItemRef[];
  confirmationRequest?: PendingConfirmation;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  modelId?: string;
  generatedAt: number;
}

// ---------------------------------------------------------------------------
// AI Intent
// ---------------------------------------------------------------------------

export type AIIntentType =
  | 'chat'
  | 'search'
  | 'summarize'
  | 'analyze'
  | 'create'
  | 'edit'
  | 'delete'
  | 'plan'
  | 'execute'
  | 'unknown';

export interface AIIntent {
  type: AIIntentType;
  confidence: number;
  requiresRAG: boolean;
  requiresTools: boolean;
  requiresAgent: boolean;
  requiresMemory: boolean;
}

// ---------------------------------------------------------------------------
// AI Context (passed through orchestration pipeline)
// ---------------------------------------------------------------------------

export interface AIContext {
  conversationId: string;
  userId: string;
  messages: AIMessage[];
  activeModel: AIModelInfo | null;
  intent: AIIntent | null;
  ragContext: RAGContext | null;
  memoryEntries: MemoryEntry[];
  activeAgent: AgentDefinition | null;
  systemPrompt: string | null;
  metadata: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Thinking / Reasoning Status (safe public representation only)
// ---------------------------------------------------------------------------

export type ThinkingStatus =
  | 'idle'
  | 'analyzing'
  | 'thinking'
  | 'retrieving'
  | 'planning'
  | 'waiting_confirmation'
  | 'executing_action'
  | 'verifying'
  | 'generating'
  | 'using_tool';

export interface ThinkingState {
  status: ThinkingStatus;
  toolName?: string;
  label: string;
  step?: number;
  totalSteps?: number;
  details?: string;
}

// ---------------------------------------------------------------------------
// AI Store State Shape
// ---------------------------------------------------------------------------

export type AIProviderMode = 'auto' | 'aether' | 'gemini' | 'openai' | 'ollama';

export interface ProviderStatusInfo {
  name: 'aether' | 'gemini' | 'openai' | 'ollama';
  status: 'available' | 'unavailable' | 'rate_limited' | 'timeout' | 'config_error';
  message?: string;
  checkedAt?: number;
}

export interface FallbackNotice {
  activeProvider: string;
  usedFallback: boolean;
  reason?: string;
  timestamp: number;
}

export interface AIStoreState {
  // Provider Selection & Fallback
  providerMode: AIProviderMode;
  activeProvider: string;
  fallbackNotice: FallbackNotice | null;
  providerStatuses: Record<string, ProviderStatusInfo>;

  // Conversation
  conversations: Record<string, AIConversation>;
  activeConversationId: string | null;

  // Messages
  messages: Record<string, AIMessage[]>; // keyed by conversationId

  // Streaming
  streamingStatus: StreamingStatus;
  streamingSession: StreamingSession | null;
  thinkingState: ThinkingState | null;

  // Model
  activeModel: AIModelInfo | null;
  availableModels: AIModelInfo[];
  modelStatus: ModelStatus;

  // Memory
  memoryEntries: MemoryEntry[];
  memoryStatus: MemoryStatus | null;

  // RAG / Knowledge
  ragStatus: RAGStatus | null;
  documents: AIDocument[];
  activeRAGContext: RAGContext | null;

  // Agent
  activeAgent: AgentDefinition | null;
  availableAgents: AgentDefinition[];
  activeAgentSession: AgentSession | null;

  // Tools
  availableTools: ToolDefinition[];
  toolRegistryStatus: ToolRegistryStatus | null;

  // Connection
  connectionStatus: AIConnectionStatus;

  // Confirmation Flow
  pendingConfirmation: PendingConfirmation | null;

  // Error
  error: AIError | null;

  // UI
  sidebarOpen: boolean;
  activePanel: AIPanel;
}

export type AIPanel =
  'assistant' | 'conversations' | 'memory' | 'knowledge' | 'prompts' | 'models' | 'agents';
