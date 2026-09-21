/** AETHER domain model — shared by stores, repositories and UI. */

export type MessageRole = "system" | "user" | "assistant" | "tool";
export type MessageStatus = "pending" | "streaming" | "complete" | "error" | "aborted";

export interface Attachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  /** Data URL for images, extracted text for documents. */
  previewUrl?: string | undefined;
  textContent?: string | undefined;
  documentId?: string | undefined;
}

export interface Citation {
  id: string;
  documentId: string;
  documentName: string;
  chunkId: string;
  snippet: string;
  score: number;
  page?: number | undefined;
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  reasoning?: string | undefined;
  status: MessageStatus;
  createdAt: number;
  updatedAt: number;
  model?: string | undefined;
  error?: string | undefined;
  attachments?: Attachment[] | undefined;
  citations?: Citation[] | undefined;
  reactions?: string[] | undefined;
  tokens?: { prompt?: number | undefined; completion?: number | undefined } | undefined;
  /** Set when a message was edited; keeps prior revisions for the version switcher. */
  revisions?: Array<{ content: string; at: number }> | undefined;
}

export interface Conversation {
  id: string;
  title: string;
  folderId: string | null;
  projectId: string | null;
  pinned: boolean;
  archived: boolean;
  createdAt: number;
  updatedAt: number;
  model?: string | undefined;
  systemPrompt?: string | undefined;
  summary?: string | undefined;
  summarisedUpToMessageId?: string | undefined;
  messageCount: number;
  lastMessagePreview?: string | undefined;
}

export interface Folder {
  id: string;
  name: string;
  color?: string | undefined;
  createdAt: number;
}

export type MemoryScope = "conversation" | "project" | "workspace" | "user";
export type MemoryKind = "fact" | "preference" | "summary" | "interaction";

export interface MemoryRecord {
  id: string;
  scope: MemoryScope;
  kind: MemoryKind;
  content: string;
  /** conversationId / projectId — null for workspace + user scope. */
  scopeRef: string | null;
  importance: number;
  hits: number;
  createdAt: number;
  updatedAt: number;
  lastAccessedAt: number;
  embedding?: number[] | undefined;
  tokens: number;
}

export type DocumentStatus = "queued" | "extracting" | "chunking" | "embedding" | "ready" | "error";

export interface KnowledgeDocument {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  status: DocumentStatus;
  error?: string | undefined;
  createdAt: number;
  updatedAt: number;
  chunkCount: number;
  charCount: number;
  pageCount?: number | undefined;
  projectId: string | null;
  tags: string[];
  vectorised: boolean;
  /** Data URL kept for image documents so the reference viewer can show them. */
  previewUrl?: string | undefined;
  text?: string | undefined;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  index: number;
  content: string;
  tokens: number;
  page?: number | undefined;
  heading?: string | undefined;
  embedding?: number[] | undefined;
  /** Lexical term frequencies, precomputed for BM25 hybrid search. */
  terms: Record<string, number>;
  length: number;
}

export interface RetrievedContext {
  chunk: KnowledgeChunk;
  document: KnowledgeDocument;
  score: number;
  lexicalScore: number;
  semanticScore: number;
}

export interface AetherSettings {
  theme: "light" | "dark" | "system";
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
  streaming: boolean;
  ragEnabled: boolean;
  ragTopK: number;
  hybridAlpha: number;
  semanticSearch: boolean;
  memoryEnabled: boolean;
  autoSummarise: boolean;
  memoryTokenBudget: number;
  contextTokenBudget: number;
  showCitations: boolean;
  sendOnEnter: boolean;
  virtualiseMessages: boolean;
}

export interface ProviderStatus {
  configured: boolean;
  runtime?: string | undefined;
  adapter?: string | undefined;
  discovered?: boolean | undefined;
  defaultModel?: string | undefined;
  embeddingModel?: string | undefined;
  models: Array<{ id: string; label: string; contextWindow?: number }>;
  warning?: string | null | undefined;
  error?: { code: string; message: string } | undefined;
}

export interface RuntimeHealthEntry {
  provider: string;
  label: string;
  endpoint: string;
  reachable: boolean;
  latencyMs: number | null;
  modelCount: number;
  models: string[];
  error: string | null;
}

export interface RuntimeHealthReport {
  mode: "configured" | "discovery";
  configuredProvider: string | null;
  healthy: number;
  runtimes: RuntimeHealthEntry[];
  checkedAt: number;
}

export const DEFAULT_SETTINGS: AetherSettings = {
  theme: "dark",
  model: "",
  temperature: 0.7,
  maxTokens: 4096,
  topP: 1,
  systemPrompt:
    "You are AETHER, a precise and helpful AI assistant. Use provided knowledge context and memory when relevant, cite sources as [n], and prefer clear structured Markdown.",
  streaming: true,
  ragEnabled: true,
  ragTopK: 6,
  hybridAlpha: 0.5,
  semanticSearch: true,
  memoryEnabled: true,
  autoSummarise: true,
  memoryTokenBudget: 700,
  contextTokenBudget: 2400,
  showCitations: true,
  sendOnEnter: true,
  virtualiseMessages: true,
};
