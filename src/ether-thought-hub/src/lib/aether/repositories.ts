import { getDb } from "./db";
import type {
  Conversation,
  Folder,
  KnowledgeChunk,
  KnowledgeDocument,
  MemoryRecord,
  Message,
} from "./types";

export const uid = (prefix: string): string =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

/* ------------------------------- conversations ------------------------------ */

export const conversationRepository = {
  async list(): Promise<Conversation[]> {
    const db = await getDb();
    const all = await db.getAll("conversations");
    return all.sort((a, b) => b.updatedAt - a.updatedAt);
  },
  async get(id: string): Promise<Conversation | undefined> {
    return (await getDb()).get("conversations", id);
  },
  async save(conversation: Conversation): Promise<Conversation> {
    await (await getDb()).put("conversations", conversation);
    return conversation;
  },
  async remove(id: string): Promise<void> {
    const db = await getDb();
    const tx = db.transaction(["conversations", "messages"], "readwrite");
    await tx.objectStore("conversations").delete(id);
    const store = tx.objectStore("messages");
    const keys = await store.index("by_conversation").getAllKeys(id);
    await Promise.all(keys.map((key) => store.delete(key)));
    await tx.done;
  },
};

/* --------------------------------- messages -------------------------------- */

export const messageRepository = {
  async listByConversation(conversationId: string): Promise<Message[]> {
    const db = await getDb();
    const all = await db.getAllFromIndex("messages", "by_conversation", conversationId);
    return all.sort((a, b) => a.createdAt - b.createdAt);
  },
  async save(message: Message): Promise<Message> {
    await (await getDb()).put("messages", message);
    return message;
  },
  async saveMany(messages: Message[]): Promise<void> {
    const db = await getDb();
    const tx = db.transaction("messages", "readwrite");
    await Promise.all(messages.map((m) => tx.store.put(m)));
    await tx.done;
  },
  async remove(id: string): Promise<void> {
    await (await getDb()).delete("messages", id);
  },
  async removeMany(ids: string[]): Promise<void> {
    const db = await getDb();
    const tx = db.transaction("messages", "readwrite");
    await Promise.all(ids.map((id) => tx.store.delete(id)));
    await tx.done;
  },
  async all(): Promise<Message[]> {
    return (await getDb()).getAll("messages");
  },
};

/* --------------------------------- folders --------------------------------- */

export const folderRepository = {
  async list(): Promise<Folder[]> {
    const all = await (await getDb()).getAll("folders");
    return all.sort((a, b) => a.createdAt - b.createdAt);
  },
  async save(folder: Folder): Promise<Folder> {
    await (await getDb()).put("folders", folder);
    return folder;
  },
  async remove(id: string): Promise<void> {
    await (await getDb()).delete("folders", id);
  },
};

/* -------------------------------- knowledge -------------------------------- */

export const documentRepository = {
  async list(): Promise<KnowledgeDocument[]> {
    const all = await (await getDb()).getAll("documents");
    return all.sort((a, b) => b.createdAt - a.createdAt);
  },
  async get(id: string): Promise<KnowledgeDocument | undefined> {
    return (await getDb()).get("documents", id);
  },
  async save(document: KnowledgeDocument): Promise<KnowledgeDocument> {
    await (await getDb()).put("documents", document);
    return document;
  },
  async remove(id: string): Promise<void> {
    const db = await getDb();
    const tx = db.transaction(["documents", "chunks"], "readwrite");
    await tx.objectStore("documents").delete(id);
    const store = tx.objectStore("chunks");
    const keys = await store.index("by_document").getAllKeys(id);
    await Promise.all(keys.map((key) => store.delete(key)));
    await tx.done;
  },
};

export const chunkRepository = {
  async listByDocument(documentId: string): Promise<KnowledgeChunk[]> {
    const all = await (await getDb()).getAllFromIndex("chunks", "by_document", documentId);
    return all.sort((a, b) => a.index - b.index);
  },
  async all(): Promise<KnowledgeChunk[]> {
    return (await getDb()).getAll("chunks");
  },
  async saveMany(chunks: KnowledgeChunk[]): Promise<void> {
    const db = await getDb();
    const tx = db.transaction("chunks", "readwrite");
    await Promise.all(chunks.map((c) => tx.store.put(c)));
    await tx.done;
  },
  async get(id: string): Promise<KnowledgeChunk | undefined> {
    return (await getDb()).get("chunks", id);
  },
};

/* --------------------------------- memory ---------------------------------- */

export const memoryRepository = {
  async all(): Promise<MemoryRecord[]> {
    return (await getDb()).getAll("memories");
  },
  async save(record: MemoryRecord): Promise<MemoryRecord> {
    await (await getDb()).put("memories", record);
    return record;
  },
  async saveMany(records: MemoryRecord[]): Promise<void> {
    const db = await getDb();
    const tx = db.transaction("memories", "readwrite");
    await Promise.all(records.map((r) => tx.store.put(r)));
    await tx.done;
  },
  async remove(id: string): Promise<void> {
    await (await getDb()).delete("memories", id);
  },
  async removeMany(ids: string[]): Promise<void> {
    const db = await getDb();
    const tx = db.transaction("memories", "readwrite");
    await Promise.all(ids.map((id) => tx.store.delete(id)));
    await tx.done;
  },
};

/* ----------------------------------- kv ------------------------------------ */

export const kvRepository = {
  async get<T>(key: string): Promise<T | undefined> {
    return (await (await getDb()).get("kv", key)) as T | undefined;
  },
  async set(key: string, value: unknown): Promise<void> {
    await (await getDb()).put("kv", value, key);
  },
};
