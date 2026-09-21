import type { KnowledgeChunk } from "./types";

/**
 * Vector search abstraction. The default implementation runs an exact
 * cosine scan over IndexedDB-resident vectors; swapping in pgvector, Qdrant or
 * Pinecone later means implementing this interface only.
 */
export interface VectorRecord {
  id: string;
  embedding: number[];
  metadata?: Record<string, unknown>;
}

export interface VectorHit {
  id: string;
  score: number;
}

export interface VectorStore {
  readonly id: string;
  search(
    query: number[],
    topK: number,
    filter?: (record: VectorRecord) => boolean,
  ): Promise<VectorHit[]>;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  if (!len) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i += 1) {
    const x = a[i] as number;
    const y = b[i] as number;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/** In-memory exact-scan store built from knowledge chunks. */
export function createMemoryVectorStore(records: VectorRecord[]): VectorStore {
  return {
    id: "aether-exact-scan",
    async search(query, topK, filter) {
      const hits: VectorHit[] = [];
      for (const record of records) {
        if (filter && !filter(record)) continue;
        if (!record.embedding?.length) continue;
        hits.push({ id: record.id, score: cosineSimilarity(query, record.embedding) });
      }
      hits.sort((a, b) => b.score - a.score);
      return hits.slice(0, topK);
    },
  };
}

export function chunksToVectorRecords(chunks: KnowledgeChunk[]): VectorRecord[] {
  return chunks
    .filter((chunk) => chunk.embedding?.length)
    .map((chunk) => ({
      id: chunk.id,
      embedding: chunk.embedding as number[],
      metadata: { documentId: chunk.documentId, page: chunk.page },
    }));
}
