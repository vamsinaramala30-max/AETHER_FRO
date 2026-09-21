/** Text utilities shared by chunking, BM25 indexing and token budgeting. */

const STOPWORDS = new Set(
  "a an the and or but if then than that this these those of in on at to for from with without by as is are was were be been being it its it's do does did doing have has had having i you he she they we not no so such can will just should now about into over after before under above".split(
    " ",
  ),
);

/** ~4 characters per token — good enough for budgeting without a tokenizer dep. */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.max(1, Math.ceil(text.length / 4));
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export function termFrequencies(text: string): { terms: Record<string, number>; length: number } {
  const tokens = tokenize(text);
  const terms: Record<string, number> = {};
  for (const t of tokens) terms[t] = (terms[t] ?? 0) + 1;
  return { terms, length: tokens.length };
}

export interface ChunkSpec {
  content: string;
  index: number;
  heading?: string;
  page?: number;
}

interface ChunkOptions {
  targetTokens?: number;
  overlapTokens?: number;
}

/**
 * Structure-aware chunker: splits on Markdown headings first, then packs
 * paragraphs into overlapping windows so retrieval keeps semantic locality.
 */
export function chunkText(text: string, options: ChunkOptions = {}): ChunkSpec[] {
  const targetTokens = options.targetTokens ?? 320;
  const overlapTokens = options.overlapTokens ?? 48;
  const targetChars = targetTokens * 4;
  const overlapChars = overlapTokens * 4;

  const normalised = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!normalised) return [];

  const sections: Array<{ heading?: string; body: string }> = [];
  const lines = normalised.split("\n");
  let currentHeading: string | undefined;
  let buffer: string[] = [];
  const flush = () => {
    const body = buffer.join("\n").trim();
    if (body) sections.push(currentHeading ? { heading: currentHeading, body } : { body });
    buffer = [];
  };
  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      currentHeading = heading[2]?.trim();
      continue;
    }
    buffer.push(line);
  }
  flush();

  const chunks: ChunkSpec[] = [];
  let index = 0;

  for (const section of sections) {
    const paragraphs = section.body.split(/\n\s*\n/);
    let window = "";
    const push = () => {
      const content = window.trim();
      if (!content) return;
      chunks.push({
        content: section.heading ? `${section.heading}\n\n${content}` : content,
        index: index++,
        ...(section.heading ? { heading: section.heading } : {}),
      });
    };
    for (const paragraph of paragraphs) {
      const piece = paragraph.trim();
      if (!piece) continue;
      if (piece.length > targetChars) {
        // hard-split very long paragraphs on sentence boundaries
        const sentences = piece.split(/(?<=[.!?…])\s+/);
        for (const sentence of sentences) {
          if (window.length + sentence.length > targetChars) {
            push();
            window = window.slice(-overlapChars);
          }
          window += (window ? " " : "") + sentence;
        }
        continue;
      }
      if (window.length + piece.length > targetChars) {
        push();
        window = window.slice(-overlapChars);
      }
      window += (window ? "\n\n" : "") + piece;
    }
    push();
  }

  return chunks;
}

export function truncateToTokens(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars).trimEnd()}…`;
}

export function deriveTitle(text: string): string {
  const firstLine = text.trim().split("\n").find((l) => l.trim().length > 0) ?? "New conversation";
  const clean = firstLine.replace(/^#+\s*/, "").replace(/\s+/g, " ").trim();
  return clean.length > 56 ? `${clean.slice(0, 56)}…` : clean || "New conversation";
}

export function highlightSnippet(content: string, query: string, radius = 140): string {
  const terms = tokenize(query);
  if (!terms.length) return content.slice(0, radius * 2);
  const lower = content.toLowerCase();
  let best = -1;
  for (const term of terms) {
    const at = lower.indexOf(term);
    if (at !== -1 && (best === -1 || at < best)) best = at;
  }
  if (best === -1) return content.slice(0, radius * 2);
  const start = Math.max(0, best - radius);
  const end = Math.min(content.length, best + radius);
  return `${start > 0 ? "…" : ""}${content.slice(start, end).trim()}${end < content.length ? "…" : ""}`;
}
