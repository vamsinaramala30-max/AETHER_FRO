// ============================================================================
// AETHER AI — Module Index
// ============================================================================
// Public API for the AETHER AI frontend module.
// Import from here to consume the AI feature in routing/pages.
// ============================================================================

// ── Main Components ──────────────────────────────────────────────────────────
export { AI } from './AI';
export { AIPage } from './AIPage';

// ── Core Components ───────────────────────────────────────────────────────────
export { AIHeader } from './components/AIHeader';
export { AISidebar } from './components/AISidebar';
export { AIChat } from './components/AIChat';
export { AIInput } from './components/AIInput';
export { AIMessage } from './components/AIMessage';
export { AIThinking } from './components/AIThinking';
export { AIWelcome } from './components/AIWelcome';
export { AIStatus } from './components/AIStatus';
export { ConversationList } from './components/ConversationList';
export { MemoryPanel } from './components/MemoryPanel';
export { KnowledgePanel } from './components/KnowledgePanel';
export { PromptPanel } from './components/PromptPanel';
export { ModelPanel } from './components/ModelPanel';
export { AgentPanel } from './components/AgentPanel';
export { SourceCitation } from './components/SourceCitation';
export { ToolExecution } from './components/ToolExecution';

// ── Hooks ─────────────────────────────────────────────────────────────────────
export { useAI } from './hooks/useAI';
export { useChat } from './hooks/useChat';
export { useMemory } from './hooks/useMemory';
export { useKnowledge } from './hooks/useKnowledge';
export { useModel } from './hooks/useModel';
export { useAgent } from './hooks/useAgent';

// ── Store ─────────────────────────────────────────────────────────────────────
export { useAIStore } from './ai-store';

// ── Services ──────────────────────────────────────────────────────────────────
export { aiService } from './services/ai-service';
export { memoryService } from './services/memory-service';
export { knowledgeService } from './services/knowledge-service';
export { modelService } from './services/model-service';
export { agentService } from './services/agent-service';

// ── Types ─────────────────────────────────────────────────────────────────────
export type {
  // Core
  AIError,
  AIErrorCode,
  AIResult,
  AIConnectionStatus,
  AIPanel,
  AIStoreState,

  // Messages
  AIMessage as AIMessageType,
  MessageRole,
  MessageStatus,
  SourceCitationRef,
  ToolInvocationRef,

  // Conversations
  AIConversation,
  ConversationMetadata,

  // Models
  AIModelInfo,
  ModelStatus,
  ModelRuntimeType,

  // Streaming
  StreamingStatus,
  StreamingSession,
  StreamingChunk,

  // RAG
  AIDocument,
  DocumentStatus,
  RAGContext,
  RAGStatus,
  RetrievalResult,

  // Memory
  MemoryEntry,
  MemoryScope,
  MemoryEntryType,
  MemoryStatus,

  // Prompts
  PromptTemplate,
  PromptCategory,
  BuiltPrompt,

  // Tools
  ToolDefinition,
  ToolCategory,
  ToolStatus,
  ToolExecutionRequest,
  ToolExecutionResult,

  // Agents
  AgentDefinition,
  AgentSession,
  AgentStatus,
  AgentStep,

  // Generation
  GenerationRequest,
  GenerationResponse,

  // Context / Intent
  AIContext,
  AIIntent,
  AIIntentType,

  // Thinking
  ThinkingState,
  ThinkingStatus,
} from './ai-types';

// ── Constants ─────────────────────────────────────────────────────────────────
export {
  AI_ERROR_MESSAGES,
  AI_PANEL_LABELS,
  AI_LIMITS,
  AI_STORAGE_KEYS,
  THINKING_STATUS_LABELS,
  AETHER_AI_VERSION,
} from './ai-constants';

// ── Config ────────────────────────────────────────────────────────────────────
export { DEFAULT_AI_CONFIG } from './ai-config';
