import { chunkText } from "./text";
import { indexChunkContent } from "./rag";
import { aetherApi } from "./api";
import { chunkRepository, documentRepository, uid } from "./repositories";
import type { KnowledgeChunk, KnowledgeDocument } from "./types";

/**
 * Document ingestion pipeline: extract → chunk → index → (optionally) embed.
 * Every parser is lazily imported so nothing heavy touches SSR or first paint.
 */

export const SUPPORTED_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".txt",
  ".md",
  ".markdown",
  ".csv",
  ".tsv",
  ".json",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
];

export function isSupportedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return SUPPORTED_EXTENSIONS.some((ext) => name.endsWith(ext)) || file.type.startsWith("text/");
}

export function isImage(file: File | { mimeType: string }): boolean {
  const type = "type" in file ? (file as File).type : file.mimeType;
  return type.startsWith("image/");
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

async function extractPdf(file: File): Promise<{ text: string; pages: number; pageMap: number[] }> {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const parts: string[] = [];
  const pageMap: number[] = [];
  for (let page = 1; page <= doc.numPages; page += 1) {
    const p = await doc.getPage(page);
    const content = await p.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (text) {
      parts.push(text);
      pageMap.push(page);
    }
  }
  return { text: parts.join("\n\n"), pages: doc.numPages, pageMap };
}

async function extractDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth/mammoth.browser");
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value;
}

function csvToMarkdown(raw: string, delimiter: string): string {
  const rows = raw
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => line.split(delimiter).map((cell) => cell.trim().replace(/^"|"$/g, "")));
  if (!rows.length) return "";
  const header = rows[0] as string[];
  const body = rows.slice(1);
  const lines = [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...body.map((row) => `| ${row.join(" | ")} |`),
  ];
  return lines.join("\n");
}

async function extractImageOcr(file: File): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  try {
    const { data } = await worker.recognize(file);
    return data.text.trim();
  } finally {
    await worker.terminate();
  }
}

export interface ExtractionResult {
  text: string;
  pageCount?: number;
  previewUrl?: string;
}

export async function extractFile(file: File): Promise<ExtractionResult> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) {
    const { text, pages } = await extractPdf(file);
    return { text, pageCount: pages };
  }
  if (name.endsWith(".docx")) return { text: await extractDocx(file) };
  if (name.endsWith(".csv")) return { text: csvToMarkdown(await file.text(), ",") };
  if (name.endsWith(".tsv")) return { text: csvToMarkdown(await file.text(), "\t") };
  if (name.endsWith(".json")) {
    const raw = await file.text();
    try {
      return { text: "```json\n" + JSON.stringify(JSON.parse(raw), null, 2) + "\n```" };
    } catch {
      return { text: raw };
    }
  }
  if (isImage(file)) {
    const [previewUrl, text] = await Promise.all([fileToDataUrl(file), extractImageOcr(file)]);
    return { text, previewUrl };
  }
  return { text: await file.text() };
}

export interface IngestCallbacks {
  onUpdate?: (document: KnowledgeDocument) => void;
}

/** Runs the full pipeline for one file and persists the result. */
export async function ingestFile(
  file: File,
  options: { projectId?: string | null; tags?: string[]; embed?: boolean } = {},
  callbacks: IngestCallbacks = {},
): Promise<KnowledgeDocument> {
  const now = Date.now();
  let document: KnowledgeDocument = {
    id: uid("doc"),
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    status: "extracting",
    createdAt: now,
    updatedAt: now,
    chunkCount: 0,
    charCount: 0,
    projectId: options.projectId ?? null,
    tags: options.tags ?? [],
    vectorised: false,
  };
  const persist = async (patch: Partial<KnowledgeDocument>) => {
    document = { ...document, ...patch, updatedAt: Date.now() };
    await documentRepository.save(document);
    callbacks.onUpdate?.(document);
    return document;
  };
  await persist({});

  try {
    const extraction = await extractFile(file);
    const text = extraction.text.trim();
    if (!text) throw new Error("No extractable text found in this file");

    await persist({
      status: "chunking",
      text,
      charCount: text.length,
      ...(extraction.pageCount ? { pageCount: extraction.pageCount } : {}),
      ...(extraction.previewUrl ? { previewUrl: extraction.previewUrl } : {}),
    });

    const specs = chunkText(text);
    const chunks: KnowledgeChunk[] = specs.map((spec) => {
      const stats = indexChunkContent(spec.content);
      return {
        id: uid("chk"),
        documentId: document.id,
        index: spec.index,
        content: spec.content,
        tokens: stats.tokens,
        terms: stats.terms,
        length: stats.length,
        ...(spec.heading ? { heading: spec.heading } : {}),
      };
    });
    await chunkRepository.saveMany(chunks);
    await persist({ status: "embedding", chunkCount: chunks.length });

    let vectorised = false;
    if (options.embed !== false && chunks.length) {
      try {
        const batchSize = 32;
        for (let i = 0; i < chunks.length; i += batchSize) {
          const batch = chunks.slice(i, i + batchSize);
          const vectors = await aetherApi.embed(batch.map((c) => c.content));
          batch.forEach((chunk, j) => {
            const vector = vectors[j];
            if (vector?.length) chunk.embedding = vector;
          });
          await chunkRepository.saveMany(batch);
        }
        vectorised = chunks.some((c) => c.embedding?.length);
      } catch {
        // No embedding provider configured — the document stays fully usable
        // through lexical BM25 retrieval.
        vectorised = false;
      }
    }

    return await persist({ status: "ready", vectorised });
  } catch (error) {
    return await persist({
      status: "error",
      error: error instanceof Error ? error.message : "Ingestion failed",
    });
  }
}
