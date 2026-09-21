import { aetherApi } from "./api";
import { chunkRepository, documentRepository } from "./repositories";
import { estimateTokens, highlightSnippet, termFrequencies, tokenize } from "./text";
import type { Citation, KnowledgeChunk, KnowledgeDocument, RetrievedContext } from "./types";
import { chunksToVectorRecords, createMemoryVectorStore } from "./vector-store";

/** BM25 parameters. */
const K1 = 1.4;
const B = 0.75;

export interface SearchFilter {
  documentIds?: string[];
  projectId?: string | null;
  tags?: string[];
}

export interface SearchOptions {
  topK?: number;
  /** 0 = pure lexical, 1 = pure semantic. */
  alpha?: number;
  semantic?: boolean;
  filter?: SearchFilter;
  signal?: AbortSignal;
}

function matchesFilter(document: KnowledgeDocument, filter?: SearchFilter): boolean {
  if (!filter) return true;
  if (filter.documentIds?.length && !filter.documentIds.includes(document.id)) return false;
  if (filter.projectId !== undefined && filter.projectId !== null) {
    if (document.projectId !== filter.projectId) return false;
  }
  if (filter.tags?.length && !filter.tags.some((tag) => document.tags.includes(tag))) return false;
  return true;
}

/** Real BM25 over precomputed term frequencies. */
export function bm25(
  query: string,
  chunks: KnowledgeChunk[],
): Map<string, number> {
  const queryTerms = tokenize(query);
  const scores = new Map<string, number>();
  if (!queryTerms.length || !chunks.length) return scores;

  const total = chunks.length;
  const avgLength = chunks.reduce((sum, c) => sum + (c.length || 1), 0) / total;
  const df = new Map<string, number>();
  for (const term of new Set(queryTerms)) {
    let count = 0;
    for (const chunk of chunks) if (chunk.terms[term]) count += 1;
    df.set(term, count);
  }

  for (const chunk of chunks) {
    let score = 0;
    for (const term of new Set(queryTerms)) {
      const tf = chunk.terms[term];
      if (!tf) continue;
      const n = df.get(term) ?? 0;
      const idf = Math.log(1 + (total - n + 0.5) / (n + 0.5));
      const norm = tf * (K1 + 1);
      const denom = tf + K1 * (1 - B + B * ((chunk.length || 1) / (avgLength || 1)));
      score += idf * (norm / denom);
    }
    if (score > 0) scores.set(chunk.id, score);
  }
  return scores;
}

function normalise(scores: Map<string, number>): Map<string, number> {
  let max = 0;
  for (const value of scores.values()) if (value > max) max = value;
  if (!max) return scores;
  const out = new Map<string, number>();
  for (const [key, value] of scores) out.set(key, value / max);
  return out;
}

/**
 * Hybrid retrieval: BM25 lexical + dense cosine, fused with a configurable
 * alpha, then MMR-diversified so a single document cannot dominate context.
 */
export async function hybridSearch(
  query: string,
  options: SearchOptions = {},
): Promise<RetrievedContext[]> {
  const topK = options.topK ?? 6;
  const alpha = options.semantic === false ? 0 : (options.alpha ?? 0.5);

  const [documents, allChunks] = await Promise.all([
    documentRepository.list(),
    chunkRepository.all(),
  ]);
  const docMap = new Map(documents.map((d) => [d.id, d]));
  const chunks = allChunks.filter((chunk) => {
    const doc = docMap.get(chunk.documentId);
    return !!doc && doc.status === "ready" && matchesFilter(doc, options.filter);
  });
  if (!chunks.length) return [];

  const lexical = normalise(bm25(query, chunks));

  let semantic = new Map<string, number>();
  if (alpha > 0) {
    const vectorRecords = chunksToVectorRecords(chunks);
    if (vectorRecords.length) {
      try {
        const [queryVector] = await aetherApi.embed([query], options.signal);
        if (queryVector?.length) {
          const store = createMemoryVectorStore(vectorRecords);
          const hits = await store.search(queryVector, topK * 4);
          semantic = normalise(new Map(hits.map((h) => [h.id, Math.max(0, h.score)])));
        }
      } catch {
        // Embeddings unavailable (provider without embedding model) — the
        // lexical half of hybrid search still returns real results.
        semantic = new Map();
      }
    }
  }

  const chunkMap = new Map(chunks.map((c) => [c.id, c]));
  const effectiveAlpha = semantic.size ? alpha : 0;
  const fused: RetrievedContext[] = [];
  for (const id of new Set([...lexical.keys(), ...semantic.keys()])) {
    const chunk = chunkMap.get(id);
    const document = chunk ? docMap.get(chunk.documentId) : undefined;
    if (!chunk || !document) continue;
    const lexicalScore = lexical.get(id) ?? 0;
    const semanticScore = semantic.get(id) ?? 0;
    fused.push({
      chunk,
      document,
      lexicalScore,
      semanticScore,
      score: (1 - effectiveAlpha) * lexicalScore + effectiveAlpha * semanticScore,
    });
  }
  fused.sort((a, b) => b.score - a.score);

  // Maximal-marginal-relevance style diversification (max 3 chunks/document).
  const perDocument = new Map<string, number>();
  const selected: RetrievedContext[] = [];
  for (const candidate of fused) {
    const used = perDocument.get(candidate.document.id) ?? 0;
    if (used >= 3) continue;
    perDocument.set(candidate.document.id, used + 1);
    selected.push(candidate);
    if (selected.length >= topK) break;
  }
  return selected;
}

/** Packs retrieved chunks into a token-bounded, cited context block. */
export function buildContextBlock(
  results: RetrievedContext[],
  tokenBudget: number,
): { text: string; citations: Citation[] } {
  const citations: Citation[] = [];
  const parts: string[] = [];
  let used = 0;

  results.forEach((result, i) => {
    const label = i + 1;
    const body = result.chunk.content.trim();
    const cost = estimateTokens(body) + 24;
    if (used + cost > tokenBudget) return;
    used += cost;
    parts.push(
      `[${label}] source: ${result.document.name}${result.chunk.page ? ` (p.${result.chunk.page})` : ""}\n${body}`,
    );
    citations.push({
      id: `cit_${result.chunk.id}`,
      documentId: result.document.id,
      documentName: result.document.name,
      chunkId: result.chunk.id,
      snippet: body.slice(0, 400),
      score: Number(result.score.toFixed(4)),
      ...(result.chunk.page ? { page: result.chunk.page } : {}),
    });
  });

  if (!parts.length) return { text: "", citations: [] };
  return {
    text: `KNOWLEDGE CONTEXT (retrieved by AETHER hybrid search — cite as [n]):\n\n${parts.join("\n\n")}`,
    citations,
  };
}

/** Lightweight semantic-ish preview search used by the knowledge panel UI. */
export async function searchKnowledgeSnippets(
  query: string,
  topK = 12,
): Promise<Array<{ documentId: string; documentName: string; snippet: string; score: number }>> {
  const results = await hybridSearch(query, { topK, alpha: 0.5 });
  return results.map((r) => ({
    documentId: r.document.id,
    documentName: r.document.name,
    snippet: highlightSnippet(r.chunk.content, query),
    score: Number(r.score.toFixed(3)),
  }));
}

export function indexChunkContent(content: string) {
  const { terms, length } = termFrequencies(content);
  return { terms, length, tokens: estimateTokens(content) };
}
