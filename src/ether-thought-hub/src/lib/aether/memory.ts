import { aetherApi } from "./api";
import { memoryRepository, uid } from "./repositories";
import { estimateTokens, tokenize, truncateToTokens } from "./text";
import type { MemoryKind, MemoryRecord, MemoryScope, Message } from "./types";
import { cosineSimilarity } from "./vector-store";

/**
 * Layered memory: conversation (short-term) → project → workspace → user.
 * Retrieval ranks by lexical overlap, optional semantic similarity, recency
 * and importance; pruning keeps the store bounded.
 */

const MAX_RECORDS_PER_SCOPE: Record<MemoryScope, number> = {
  conversation: 60,
  project: 200,
  workspace: 300,
  user: 120,
};

export interface CreateMemoryInput {
  scope: MemoryScope;
  kind: MemoryKind;
  content: string;
  scopeRef?: string | null;
  importance?: number;
  embed?: boolean;
}

export async function createMemory(input: CreateMemoryInput): Promise<MemoryRecord> {
  const now = Date.now();
  const content = input.content.trim();
  const record: MemoryRecord = {
    id: uid("mem"),
    scope: input.scope,
    kind: input.kind,
    content,
    scopeRef: input.scopeRef ?? null,
    importance: input.importance ?? 0.5,
    hits: 0,
    createdAt: now,
    updatedAt: now,
    lastAccessedAt: now,
    tokens: estimateTokens(content),
  };
  if (input.embed !== false) {
    try {
      const [vector] = await aetherApi.embed([content]);
      if (vector?.length) record.embedding = vector;
    } catch {
      /* semantic layer optional */
    }
  }
  await memoryRepository.save(record);
  await pruneMemories(input.scope);
  return record;
}

export async function updateMemory(record: MemoryRecord): Promise<MemoryRecord> {
  const next = { ...record, updatedAt: Date.now(), tokens: estimateTokens(record.content) };
  await memoryRepository.save(next);
  return next;
}

export async function deleteMemory(id: string): Promise<void> {
  await memoryRepository.remove(id);
}

export async function listMemories(): Promise<MemoryRecord[]> {
  const all = await memoryRepository.all();
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

/** Least-valuable-first pruning once a scope exceeds its cap. */
export async function pruneMemories(scope: MemoryScope): Promise<void> {
  const all = await memoryRepository.all();
  const scoped = all.filter((r) => r.scope === scope);
  const cap = MAX_RECORDS_PER_SCOPE[scope];
  if (scoped.length <= cap) return;
  const ranked = [...scoped].sort((a, b) => value(a) - value(b));
  const drop = ranked.slice(0, scoped.length - cap).map((r) => r.id);
  await memoryRepository.removeMany(drop);
}

function value(record: MemoryRecord): number {
  const ageDays = (Date.now() - record.lastAccessedAt) / 86_400_000;
  return record.importance * 2 + Math.log1p(record.hits) - ageDays * 0.05;
}

function lexicalOverlap(query: string, content: string): number {
  const q = new Set(tokenize(query));
  if (!q.size) return 0;
  const c = tokenize(content);
  if (!c.length) return 0;
  let hits = 0;
  for (const term of c) if (q.has(term)) hits += 1;
  return hits / Math.sqrt(c.length * q.size);
}

export interface MemoryRetrievalOptions {
  conversationId: string;
  projectId?: string | null;
  tokenBudget: number;
  semantic?: boolean;
}

/** Ranks and compresses memory into a single token-bounded prompt block. */
export async function retrieveMemoryContext(
  query: string,
  options: MemoryRetrievalOptions,
): Promise<{ text: string; used: MemoryRecord[] }> {
  const all = await memoryRepository.all();
  const candidates = all.filter((record) => {
    if (record.scope === "conversation") return record.scopeRef === options.conversationId;
    if (record.scope === "project") {
      return !options.projectId || record.scopeRef === options.projectId;
    }
    return true;
  });
  if (!candidates.length) return { text: "", used: [] };

  let queryVector: number[] | undefined;
  if (options.semantic !== false && candidates.some((c) => c.embedding?.length)) {
    try {
      const [vector] = await aetherApi.embed([query]);
      if (vector?.length) queryVector = vector;
    } catch {
      queryVector = undefined;
    }
  }

  const scopeWeight: Record<MemoryScope, number> = {
    user: 1.15,
    conversation: 1.1,
    project: 1,
    workspace: 0.9,
  };

  const scored = candidates
    .map((record) => {
      const lexical = lexicalOverlap(query, record.content);
      const semantic =
        queryVector && record.embedding?.length
          ? Math.max(0, cosineSimilarity(queryVector, record.embedding))
          : 0;
      const recency = 1 / (1 + (Date.now() - record.updatedAt) / (7 * 86_400_000));
      const score =
        (lexical * 0.45 + semantic * 0.45 + recency * 0.1) *
        scopeWeight[record.scope] *
        (0.6 + record.importance * 0.8);
      return { record, score };
    })
    .filter((entry) => entry.score > 0.01 || entry.record.kind === "summary")
    .sort((a, b) => b.score - a.score);

  const used: MemoryRecord[] = [];
  const lines: string[] = [];
  let spent = 0;
  for (const entry of scored) {
    const line = `- (${entry.record.scope}/${entry.record.kind}) ${entry.record.content}`;
    const cost = estimateTokens(line);
    if (spent + cost > options.tokenBudget) continue;
    spent += cost;
    lines.push(line);
    used.push(entry.record);
    if (lines.length >= 24) break;
  }
  if (!lines.length) return { text: "", used: [] };

  // touch access stats for ranking / pruning
  await memoryRepository.saveMany(
    used.map((record) => ({ ...record, hits: record.hits + 1, lastAccessedAt: Date.now() })),
  );

  return {
    text: `AETHER MEMORY (long-term context, most relevant first):\n${lines.join("\n")}`,
    used,
  };
}

/**
 * Compresses older turns into a rolling summary using the configured provider
 * (no heuristics, no fake text — a real completion call through /api/chat).
 */
export async function summariseMessages(
  messages: Message[],
  model?: string,
): Promise<string> {
  const transcript = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => `${m.role.toUpperCase()}: ${truncateToTokens(m.content, 400)}`)
    .join("\n\n");
  if (!transcript.trim()) return "";

  let summary = "";
  await aetherApi.streamChat({
    ...(model ? { model } : {}),
    temperature: 0.2,
    maxTokens: 400,
    messages: [
      {
        role: "system",
        content:
          "Compress the conversation into durable notes. Output 3-8 terse bullet points capturing decisions, facts, user preferences and open threads. No preamble.",
      },
      { role: "user", content: transcript },
    ],
    onChunk: (chunk) => {
      if (chunk.type === "delta") summary += chunk.text;
    },
  });
  return summary.trim();
}
