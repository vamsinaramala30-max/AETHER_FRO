// ============================================================================
// AETHER AI — Constants
// ============================================================================

import type { AIErrorCode, AIPanel, ThinkingStatus } from './ai-types';

// ---------------------------------------------------------------------------
// Sidebar navigation panels
// ---------------------------------------------------------------------------

export const AI_PANELS: AIPanel[] = [
  'assistant',
  'conversations',
  'memory',
  'knowledge',
  'prompts',
  'models',
  'agents',
];

export const AI_PANEL_LABELS: Record<AIPanel, string> = {
  assistant: 'Assistant',
  conversations: 'Conversations',
  memory: 'Memory',
  knowledge: 'Knowledge',
  prompts: 'Prompts',
  models: 'Models',
  agents: 'Agents',
};

// ---------------------------------------------------------------------------
// Thinking status labels (safe public-facing only)
// ---------------------------------------------------------------------------

export const THINKING_STATUS_LABELS: Record<ThinkingStatus, string> = {
  idle: '',
  analyzing: 'Understanding your request…',
  thinking: 'Reasoning…',
  retrieving: 'Checking relevant context…',
  planning: 'Preparing a plan…',
  waiting_confirmation: 'Waiting for your confirmation…',
  executing_action: 'Executing action…',
  verifying: 'Verifying the result…',
  generating: 'Preparing response…',
  using_tool: 'Executing tool…',
};

// ---------------------------------------------------------------------------
// Error messages (user-friendly)
// ---------------------------------------------------------------------------

export const AI_ERROR_MESSAGES: Record<AIErrorCode, string> = {
  MODEL_UNAVAILABLE: 'The AI model is currently unavailable. Please try again shortly.',
  MODEL_LOAD_FAILED: 'Failed to load the AI model. Check your configuration.',
  GENERATION_FAILED: 'Response generation failed. Please retry.',
  STREAM_FAILED: 'Streaming was interrupted. Please retry.',
  INVALID_REQUEST: 'Your request could not be processed. Please rephrase.',
  UNAUTHORIZED: 'You are not authorized to use the AI service.',
  FORBIDDEN: 'Access to this AI feature is restricted.',
  CONTEXT_TOO_LARGE: 'Your conversation context is too large. Start a new conversation.',
  RAG_FAILED: 'Failed to retrieve context from your knowledge base.',
  MEMORY_FAILED: 'Failed to access memory. Your query will proceed without memory context.',
  TOOL_FAILED: 'The requested tool encountered an error.',
  AGENT_FAILED: 'The agent was unable to complete the task.',
  TIMEOUT: 'The request timed out. Please check your connection and retry.',
  CANCELLED: 'Generation was cancelled.',
  SERVICE_UNAVAILABLE: 'The AETHER AI service is currently unreachable.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again.',
  VERIFICATION_FAILED: 'Action verification failed safety constraints. Operation aborted safely.',
  PLANNING_FAILED: 'Could not generate a viable execution plan for this goal.',
  RATE_LIMIT: 'Too many requests. Please wait a moment before trying again.',
  QUOTA_EXCEEDED: 'AI usage limit reached. Please check your workspace quota.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// ---------------------------------------------------------------------------
// Maximum limits
// ---------------------------------------------------------------------------

export const AI_LIMITS = {
  MAX_INPUT_CHARS: 32_000,
  MAX_CONVERSATION_MESSAGES: 200,
  MAX_CONVERSATION_TITLE_LENGTH: 80,
  MAX_MEMORY_CONTENT_LENGTH: 1_000,
  MAX_TOOL_RESULT_DISPLAY_LENGTH: 2_000,
  MIN_QUERY_LENGTH: 1,
} as const;

// ---------------------------------------------------------------------------
// Local storage keys
// ---------------------------------------------------------------------------

export const AI_STORAGE_KEYS = {
  ACTIVE_CONVERSATION: 'aether_ai_active_conv',
  SIDEBAR_OPEN: 'aether_ai_sidebar',
  ACTIVE_PANEL: 'aether_ai_panel',
  ACTIVE_MODEL: 'aether_ai_model',
} as const;

// ---------------------------------------------------------------------------
// Default values
// ---------------------------------------------------------------------------

export const AI_DEFAULTS = {
  DEFAULT_PANEL: 'assistant' as AIPanel,
  SIDEBAR_OPEN_DESKTOP: true,
  SIDEBAR_OPEN_MOBILE: false,
  BREAKPOINT_TABLET_PX: 768,
  BREAKPOINT_DESKTOP_PX: 1024,
} as const;

// ---------------------------------------------------------------------------
// Streaming
// ---------------------------------------------------------------------------

export const STREAMING_CONSTANTS = {
  CHUNK_RENDER_DEBOUNCE_MS: 16, // ~60fps
  COMPLETION_DELAY_MS: 100,
} as const;

// ---------------------------------------------------------------------------
// Version label
// ---------------------------------------------------------------------------

export const AETHER_AI_VERSION = '1.0.0' as const;
