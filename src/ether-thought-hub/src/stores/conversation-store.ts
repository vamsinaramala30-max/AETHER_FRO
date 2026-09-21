import { create } from "zustand";
import {
  conversationRepository,
  folderRepository,
  messageRepository,
  uid,
} from "@/lib/aether/repositories";
import { deriveTitle } from "@/lib/aether/text";
import type { Conversation, Folder, Message } from "@/lib/aether/types";

interface ConversationState {
  hydrated: boolean;
  conversations: Conversation[];
  folders: Folder[];
  messages: Record<string, Message[]>;
  activeId: string | null;
  search: string;
  showArchived: boolean;

  hydrate: () => Promise<void>;
  setSearch: (value: string) => void;
  setShowArchived: (value: boolean) => void;
  selectConversation: (id: string | null) => Promise<void>;
  createConversation: (init?: Partial<Conversation>) => Promise<Conversation>;
  patchConversation: (id: string, patch: Partial<Conversation>) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;

  createFolder: (name: string) => Promise<Folder>;
  renameFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;

  appendMessage: (message: Message) => Promise<void>;
  patchMessage: (conversationId: string, id: string, patch: Partial<Message>) => void;
  commitMessage: (conversationId: string, id: string) => Promise<void>;
  deleteMessage: (conversationId: string, id: string) => Promise<void>;
  truncateAfter: (conversationId: string, messageId: string, inclusive: boolean) => Promise<void>;
  importConversation: (conversation: Conversation, messages: Message[]) => Promise<void>;
}

const now = () => Date.now();

export const useConversationStore = create<ConversationState>((set, get) => ({
  hydrated: false,
  conversations: [],
  folders: [],
  messages: {},
  activeId: null,
  search: "",
  showArchived: false,

  async hydrate() {
    const [conversations, folders] = await Promise.all([
      conversationRepository.list(),
      folderRepository.list(),
    ]);
    const activeId = get().activeId ?? conversations.find((c) => !c.archived)?.id ?? null;
    set({ conversations, folders, hydrated: true, activeId });
    if (activeId) await get().selectConversation(activeId);
  },

  setSearch: (search) => set({ search }),
  setShowArchived: (showArchived) => set({ showArchived }),

  async selectConversation(id) {
    set({ activeId: id });
    if (!id || get().messages[id]) return;
    const messages = await messageRepository.listByConversation(id);
    set((state) => ({ messages: { ...state.messages, [id]: messages } }));
  },

  async createConversation(init) {
    const timestamp = now();
    const conversation: Conversation = {
      id: uid("cnv"),
      title: "New conversation",
      folderId: null,
      projectId: null,
      pinned: false,
      archived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      messageCount: 0,
      ...init,
    };
    await conversationRepository.save(conversation);
    set((state) => ({
      conversations: [conversation, ...state.conversations],
      messages: { ...state.messages, [conversation.id]: [] },
      activeId: conversation.id,
    }));
    return conversation;
  },

  async patchConversation(id, patch) {
    const existing = get().conversations.find((c) => c.id === id);
    if (!existing) return;
    const next = { ...existing, ...patch, updatedAt: patch.updatedAt ?? now() };
    await conversationRepository.save(next);
    set((state) => ({
      conversations: state.conversations
        .map((c) => (c.id === id ? next : c))
        .sort((a, b) => b.updatedAt - a.updatedAt),
    }));
  },

  async deleteConversation(id) {
    await conversationRepository.remove(id);
    set((state) => {
      const messages = { ...state.messages };
      delete messages[id];
      const conversations = state.conversations.filter((c) => c.id !== id);
      return {
        conversations,
        messages,
        activeId: state.activeId === id ? (conversations[0]?.id ?? null) : state.activeId,
      };
    });
    const nextId = get().activeId;
    if (nextId) await get().selectConversation(nextId);
  },

  async togglePin(id) {
    const existing = get().conversations.find((c) => c.id === id);
    if (existing) await get().patchConversation(id, { pinned: !existing.pinned });
  },

  async toggleArchive(id) {
    const existing = get().conversations.find((c) => c.id === id);
    if (existing) await get().patchConversation(id, { archived: !existing.archived });
  },

  async createFolder(name) {
    const folder: Folder = { id: uid("fld"), name, createdAt: now() };
    await folderRepository.save(folder);
    set((state) => ({ folders: [...state.folders, folder] }));
    return folder;
  },

  async renameFolder(id, name) {
    const folder = get().folders.find((f) => f.id === id);
    if (!folder) return;
    const next = { ...folder, name };
    await folderRepository.save(next);
    set((state) => ({ folders: state.folders.map((f) => (f.id === id ? next : f)) }));
  },

  async deleteFolder(id) {
    await folderRepository.remove(id);
    const affected = get().conversations.filter((c) => c.folderId === id);
    await Promise.all(affected.map((c) => get().patchConversation(c.id, { folderId: null })));
    set((state) => ({ folders: state.folders.filter((f) => f.id !== id) }));
  },

  async appendMessage(message) {
    await messageRepository.save(message);
    set((state) => ({
      messages: {
        ...state.messages,
        [message.conversationId]: [...(state.messages[message.conversationId] ?? []), message],
      },
    }));
    const conversation = get().conversations.find((c) => c.id === message.conversationId);
    if (!conversation) return;
    const count = (get().messages[message.conversationId] ?? []).length;
    const patch: Partial<Conversation> = {
      messageCount: count,
      lastMessagePreview: message.content.slice(0, 140),
    };
    if (
      message.role === "user" &&
      (conversation.title === "New conversation" || !conversation.title)
    ) {
      patch.title = deriveTitle(message.content);
    }
    await get().patchConversation(conversation.id, patch);
  },

  patchMessage(conversationId, id, patch) {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] ?? []).map((m) =>
          m.id === id ? { ...m, ...patch, updatedAt: now() } : m,
        ),
      },
    }));
  },

  async commitMessage(conversationId, id) {
    const message = (get().messages[conversationId] ?? []).find((m) => m.id === id);
    if (message) await messageRepository.save(message);
  },

  async deleteMessage(conversationId, id) {
    await messageRepository.remove(id);
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] ?? []).filter((m) => m.id !== id),
      },
    }));
  },

  async truncateAfter(conversationId, messageId, inclusive) {
    const list = get().messages[conversationId] ?? [];
    const index = list.findIndex((m) => m.id === messageId);
    if (index === -1) return;
    const from = inclusive ? index : index + 1;
    const removed = list.slice(from);
    if (!removed.length) return;
    await messageRepository.removeMany(removed.map((m) => m.id));
    set((state) => ({
      messages: { ...state.messages, [conversationId]: list.slice(0, from) },
    }));
  },

  async importConversation(conversation, messages) {
    await conversationRepository.save(conversation);
    await messageRepository.saveMany(messages);
    set((state) => ({
      conversations: [conversation, ...state.conversations.filter((c) => c.id !== conversation.id)],
      messages: { ...state.messages, [conversation.id]: messages },
      activeId: conversation.id,
    }));
  },
}));
