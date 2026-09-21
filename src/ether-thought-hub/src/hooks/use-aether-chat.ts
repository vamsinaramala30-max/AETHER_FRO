import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { aetherApi, AetherApiError, type ChatTurn } from "@/lib/aether/api";
import { retrieveMemoryContext, summariseMessages, createMemory } from "@/lib/aether/memory";
import { buildContextBlock, hybridSearch } from "@/lib/aether/rag";
import { uid } from "@/lib/aether/repositories";
import { estimateTokens, truncateToTokens } from "@/lib/aether/text";
import type { Attachment, Citation, Message } from "@/lib/aether/types";
import { useConversationStore } from "@/stores/conversation-store";
import { useMemoryStore } from "@/stores/memory-store";
import { useSettingsStore } from "@/stores/settings-store";

export type ChatPhase = "idle" | "retrieving" | "thinking" | "streaming";

interface SendOptions {
  content: string;
  attachments?: Attachment[];
}

const RECENT_TURNS = 16;

export function useAetherChat() {
  const settings = useSettingsStore();
  const store = useConversationStore();
  const refreshMemory = useMemoryStore((s) => s.refresh);
  const [phase, setPhase] = useState<ChatPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activeId = store.activeId;
  const messages = useMemo(
    () => (activeId ? (store.messages[activeId] ?? []) : []),
    [activeId, store.messages],
  );
  const isBusy = phase !== "idle";

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  /** Assembles the final prompt: system → memory → knowledge → summary → turns. */
  const buildPrompt = useCallback(
    async (
      conversationId: string,
      history: Message[],
      query: string,
    ): Promise<{ turns: ChatTurn[]; citations: Citation[] }> => {
      const conversation = useConversationStore
        .getState()
        .conversations.find((c) => c.id === conversationId);
      const systemParts = [conversation?.systemPrompt || settings.systemPrompt];
      let citations: Citation[] = [];

      if (settings.memoryEnabled) {
        const memory = await retrieveMemoryContext(query, {
          conversationId,
          projectId: conversation?.projectId ?? null,
          tokenBudget: settings.memoryTokenBudget,
          semantic: settings.semanticSearch,
        });
        if (memory.text) systemParts.push(memory.text);
      }

      if (settings.ragEnabled) {
        const results = await hybridSearch(query, {
          topK: settings.ragTopK,
          alpha: settings.hybridAlpha,
          semantic: settings.semanticSearch,
        });
        const block = buildContextBlock(results, settings.contextTokenBudget);
        if (block.text) {
          systemParts.push(block.text);
          citations = block.citations;
        }
      }

      if (conversation?.summary) {
        systemParts.push(`CONVERSATION SUMMARY SO FAR:\n${conversation.summary}`);
      }

      const recent = history.slice(-RECENT_TURNS).filter((m) => m.status !== "error");
      const turns: ChatTurn[] = [
        { role: "system", content: systemParts.filter(Boolean).join("\n\n") },
        ...recent.map<ChatTurn>((m) => ({
          role: m.role === "tool" ? "assistant" : m.role,
          content: attachmentAwareContent(m),
        })),
      ];
      return { turns, citations };
    },
    [settings],
  );

  const runCompletion = useCallback(
    async (conversationId: string, history: Message[], query: string) => {
      setError(null);
      setPhase("retrieving");
      const controller = new AbortController();
      abortRef.current = controller;

      const assistant: Message = {
        id: uid("msg"),
        conversationId,
        role: "assistant",
        content: "",
        status: "streaming",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        model: settings.model || undefined,
      };
      await store.appendMessage(assistant);

      try {
        const { turns, citations } = await buildPrompt(conversationId, history, query);
        if (citations.length && settings.showCitations) {
          store.patchMessage(conversationId, assistant.id, { citations });
        }
        setPhase("thinking");

        let content = "";
        let reasoning = "";
        let tokens: { prompt?: number | undefined; completion?: number | undefined } = {};
        let flushTimer: ReturnType<typeof setTimeout> | null = null;
        const flush = () => {
          flushTimer = null;
          store.patchMessage(conversationId, assistant.id, { content, reasoning });
        };

        await aetherApi.streamChat({
          messages: turns,
          ...(settings.model ? { model: settings.model } : {}),
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
          topP: settings.topP,
          signal: controller.signal,
          onChunk: (chunk) => {
            if (chunk.type === "delta") {
              content += chunk.text;
              setPhase("streaming");
            } else if (chunk.type === "reasoning") {
              reasoning += chunk.text;
            } else if (chunk.type === "usage") {
              tokens = { prompt: chunk.promptTokens, completion: chunk.completionTokens };
            }
            if (!flushTimer) flushTimer = setTimeout(flush, 40);
          },
        });
        if (flushTimer) clearTimeout(flushTimer);

        store.patchMessage(conversationId, assistant.id, {
          content,
          reasoning,
          tokens,
          status: content ? "complete" : "error",
          ...(content ? {} : { error: "The provider returned an empty response." }),
        });
        await store.commitMessage(conversationId, assistant.id);
        await store.patchConversation(conversationId, {
          lastMessagePreview: content.slice(0, 140),
        });

        if (settings.memoryEnabled && settings.autoSummarise) {
          void maintainMemory(conversationId, query, content).then(() => refreshMemory());
        }
      } catch (err) {
        const aborted = controller.signal.aborted;
        const message =
          err instanceof AetherApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Unknown AETHER failure";
        store.patchMessage(conversationId, assistant.id, {
          status: aborted ? "aborted" : "error",
          ...(aborted ? {} : { error: message }),
        });
        await store.commitMessage(conversationId, assistant.id);
        if (!aborted) {
          setError(message);
          toast.error("AETHER could not complete the response", { description: message });
        }
      } finally {
        abortRef.current = null;
        setPhase("idle");
      }
    },
    [buildPrompt, refreshMemory, settings, store],
  );

  const send = useCallback(
    async ({ content, attachments }: SendOptions) => {
      const text = content.trim();
      if (!text && !attachments?.length) return;
      let conversationId = store.activeId;
      if (!conversationId) conversationId = (await store.createConversation()).id;

      const userMessage: Message = {
        id: uid("msg"),
        conversationId,
        role: "user",
        content: text,
        status: "complete",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...(attachments?.length ? { attachments } : {}),
      };
      await store.appendMessage(userMessage);
      const history = [
        ...(useConversationStore.getState().messages[conversationId] ?? []),
      ];
      await runCompletion(conversationId, history, text);
    },
    [runCompletion, store],
  );

  const regenerate = useCallback(
    async (messageId: string) => {
      const conversationId = store.activeId;
      if (!conversationId) return;
      const list = useConversationStore.getState().messages[conversationId] ?? [];
      const index = list.findIndex((m) => m.id === messageId);
      if (index === -1) return;
      const priorUser = [...list.slice(0, index)].reverse().find((m) => m.role === "user");
      await store.truncateAfter(conversationId, messageId, true);
      const history = useConversationStore.getState().messages[conversationId] ?? [];
      await runCompletion(conversationId, history, priorUser?.content ?? "");
    },
    [runCompletion, store],
  );

  const editAndResend = useCallback(
    async (messageId: string, nextContent: string) => {
      const conversationId = store.activeId;
      if (!conversationId) return;
      const list = useConversationStore.getState().messages[conversationId] ?? [];
      const target = list.find((m) => m.id === messageId);
      if (!target) return;
      store.patchMessage(conversationId, messageId, {
        content: nextContent,
        revisions: [...(target.revisions ?? []), { content: target.content, at: target.updatedAt }],
      });
      await store.commitMessage(conversationId, messageId);
      await store.truncateAfter(conversationId, messageId, false);
      const history = useConversationStore.getState().messages[conversationId] ?? [];
      await runCompletion(conversationId, history, nextContent);
    },
    [runCompletion, store],
  );

  const continueGeneration = useCallback(
    async (messageId: string) => {
      const conversationId = store.activeId;
      if (!conversationId) return;
      const list = useConversationStore.getState().messages[conversationId] ?? [];
      const target = list.find((m) => m.id === messageId);
      if (!target) return;
      await runCompletion(
        conversationId,
        list,
        "Continue exactly where the previous answer stopped, without repeating it.",
      );
    },
    [runCompletion, store],
  );

  const retryLast = useCallback(async () => {
    const conversationId = store.activeId;
    if (!conversationId) return;
    const list = useConversationStore.getState().messages[conversationId] ?? [];
    const last = [...list].reverse().find((m) => m.role === "assistant");
    if (last) await regenerate(last.id);
  }, [regenerate, store.activeId]);

  return {
    phase,
    isBusy,
    error,
    messages,
    send,
    stop,
    regenerate,
    editAndResend,
    continueGeneration,
    retryLast,
  };
}

function attachmentAwareContent(message: Message): string {
  if (!message.attachments?.length) return message.content;
  const extras = message.attachments
    .filter((a) => a.textContent)
    .map((a) => `ATTACHED FILE "${a.name}":\n${truncateToTokens(a.textContent ?? "", 1200)}`);
  return [message.content, ...extras].filter(Boolean).join("\n\n");
}

/** Rolling summarisation + durable memory extraction after each exchange. */
async function maintainMemory(conversationId: string, query: string, answer: string) {
  const state = useConversationStore.getState();
  const conversation = state.conversations.find((c) => c.id === conversationId);
  const list = state.messages[conversationId] ?? [];
  if (!conversation) return;

  const exchangeTokens = estimateTokens(query) + estimateTokens(answer);
  if (exchangeTokens > 120) {
    await createMemory({
      scope: "conversation",
      kind: "interaction",
      scopeRef: conversationId,
      content: `User asked: ${truncateToTokens(query, 60)} → AETHER answered: ${truncateToTokens(answer, 90)}`,
      importance: 0.4,
      embed: false,
    });
  }

  const summariseEvery = 8;
  if (list.length >= summariseEvery && list.length % summariseEvery === 0) {
    try {
      const summary = await summariseMessages(list.slice(-summariseEvery * 2));
      if (summary) {
        await useConversationStore.getState().patchConversation(conversationId, {
          summary,
          summarisedUpToMessageId: list[list.length - 1]?.id,
        });
        await createMemory({
          scope: "workspace",
          kind: "summary",
          content: `Conversation "${conversation.title}": ${summary}`,
          importance: 0.7,
        });
      }
    } catch {
      /* summarisation is best-effort */
    }
  }
}
