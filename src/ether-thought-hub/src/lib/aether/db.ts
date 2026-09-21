import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type {
  Conversation,
  Folder,
  KnowledgeChunk,
  KnowledgeDocument,
  MemoryRecord,
  Message,
} from "./types";

/** AETHER local persistence schema (IndexedDB). */
interface AetherDB extends DBSchema {
  conversations: {
    key: string;
    value: Conversation;
    indexes: { by_updated: number; by_folder: string };
  };
  messages: {
    key: string;
    value: Message;
    indexes: { by_conversation: string; by_created: number };
  };
  folders: { key: string; value: Folder };
  documents: { key: string; value: KnowledgeDocument; indexes: { by_created: number } };
  chunks: { key: string; value: KnowledgeChunk; indexes: { by_document: string } };
  memories: {
    key: string;
    value: MemoryRecord;
    indexes: { by_scope: string; by_scope_ref: string };
  };
  kv: { key: string; value: unknown };
}

const DB_NAME = "aether";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<AetherDB>> | null = null;

export function getDb(): Promise<IDBPDatabase<AetherDB>> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("AETHER storage unavailable in this environment"));
  }
  if (!dbPromise) {
    dbPromise = openDB<AetherDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("conversations")) {
          const s = db.createObjectStore("conversations", { keyPath: "id" });
          s.createIndex("by_updated", "updatedAt");
          s.createIndex("by_folder", "folderId");
        }
        if (!db.objectStoreNames.contains("messages")) {
          const s = db.createObjectStore("messages", { keyPath: "id" });
          s.createIndex("by_conversation", "conversationId");
          s.createIndex("by_created", "createdAt");
        }
        if (!db.objectStoreNames.contains("folders")) {
          db.createObjectStore("folders", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("documents")) {
          const s = db.createObjectStore("documents", { keyPath: "id" });
          s.createIndex("by_created", "createdAt");
        }
        if (!db.objectStoreNames.contains("chunks")) {
          const s = db.createObjectStore("chunks", { keyPath: "id" });
          s.createIndex("by_document", "documentId");
        }
        if (!db.objectStoreNames.contains("memories")) {
          const s = db.createObjectStore("memories", { keyPath: "id" });
          s.createIndex("by_scope", "scope");
          s.createIndex("by_scope_ref", "scopeRef");
        }
        if (!db.objectStoreNames.contains("kv")) {
          db.createObjectStore("kv");
        }
      },
    });
  }
  return dbPromise;
}

export type { AetherDB };
