import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  BrainCircuit,
  Check,
  Copy,
  Database,
  Loader2,
  MessageSquarePlus,
  Moon,
  Paperclip,
  Pencil,
  Pin,
  RefreshCw,
  Search,
  Send,
  Settings2,
  Square,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownMessage } from "./markdown-message";
import { useAetherChat } from "@/hooks/use-aether-chat";
import { useProviderStatus } from "@/hooks/use-provider-status";
import { useRuntimeHealth, useRuntimeRefresh } from "@/hooks/use-runtime-health";
import { useHydrated } from "@/hooks/use-hydrated";
import { useConversationStore } from "@/stores/conversation-store";
import { useKnowledgeStore } from "@/stores/knowledge-store";
import { useMemoryStore } from "@/stores/memory-store";
import { useSettingsStore } from "@/stores/settings-store";
import { extractFile, isSupportedFile, fileToDataUrl, isImage } from "@/lib/aether/ingest";
import { uid } from "@/lib/aether/repositories";
import type { Attachment, Message } from "@/lib/aether/types";
import { cn } from "@/lib/utils";

export function AetherApp() {
  const hydrated = useHydrated();
  const settings = useSettingsStore();
  const store = useConversationStore();
  const knowledge = useKnowledgeStore();
  const memory = useMemoryStore();
  const provider = useProviderStatus();
  const chat = useAetherChat();

  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dragging, setDragging] = useState(false);
  const [editing, setEditing] = useState<{ id: string; value: string } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hydrated) return;
    void store.hydrate();
    void knowledge.hydrate();
    void memory.hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", settings.theme !== "light");
  }, [settings.theme]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat.messages.length, chat.phase]);

  const filtered = useMemo(() => {
    const query = store.search.trim().toLowerCase();
    return store.conversations
      .filter((c) => (store.showArchived ? c.archived : !c.archived))
      .filter(
        (c) =>
          !query ||
          c.title.toLowerCase().includes(query) ||
          (c.lastMessagePreview ?? "").toLowerCase().includes(query),
      )
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt);
  }, [store.conversations, store.search, store.showArchived]);

  const addFiles = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        if (!isSupportedFile(file)) {
          toast.error(`Unsupported file: ${file.name}`);
          continue;
        }
        try {
          const extraction = await extractFile(file);
          const attachment: Attachment = {
            id: uid("att"),
            name: file.name,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            textContent: extraction.text,
            ...(isImage(file) ? { previewUrl: await fileToDataUrl(file) } : {}),
          };
          setAttachments((prev) => [...prev, attachment]);
        } catch (error) {
          toast.error(`Could not read ${file.name}`, {
            description: error instanceof Error ? error.message : undefined,
          });
        }
      }
    },
    [],
  );

  const submit = useCallback(() => {
    if (chat.isBusy) return;
    const content = draft;
    setDraft("");
    const list = attachments;
    setAttachments([]);
    void chat.send({ content, attachments: list });
  }, [attachments, chat, draft]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("aether-search")?.focus();
      } else if (meta && event.shiftKey && event.key.toLowerCase() === "o") {
        event.preventDefault();
        void store.createConversation();
      } else if (event.key === "Escape" && chat.isBusy) {
        chat.stop();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chat, store]);

  const activeConversation = store.conversations.find((c) => c.id === store.activeId);
  const notConfigured = provider.data && provider.data.configured === false;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-r bg-sidebar md:flex">
        <SidebarBody
          filtered={filtered}
          onNew={() => void store.createConversation()}
        />
      </aside>

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 border-b px-3 py-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Conversations">
                <MessageSquarePlus className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="px-4 pt-4">
                <SheetTitle>AETHER</SheetTitle>
              </SheetHeader>
              <SidebarBody filtered={filtered} onNew={() => void store.createConversation()} />
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold">
              {activeConversation?.title ?? "AETHER"}
            </h1>
            <p className="truncate text-[11px] text-muted-foreground">
              {provider.isLoading
                ? "Checking provider…"
                : notConfigured
                  ? "Provider not configured"
                  : (provider.data?.runtime ?? "AETHER runtime")}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => settings.update("theme", settings.theme === "light" ? "dark" : "light")}
          >
            {settings.theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
          <KnowledgeSheet />
          <MemorySheet />
          <SettingsSheet />
        </header>

        {notConfigured && (
          <div className="border-b bg-destructive/10 px-4 py-2 text-xs text-destructive-foreground">
            <strong>No local model runtime reachable.</strong>{" "}
            {provider.data?.error?.message ??
              "Start a self-hosted runtime — Ollama (:11434), llama.cpp server (:8080), vLLM (:8000), LM Studio (:1234), LocalAI (:8081) or TGI (:8085). AETHER detects it automatically; AETHER_PROVIDER/AETHER_BASE_URL pin a specific one."}
          </div>
        )}


        <ScrollArea className="flex-1">
          <div className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-5">
            {!hydrated ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-2/3" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : chat.messages.length === 0 ? (
              <EmptyState onPick={(text) => setDraft(text)} />
            ) : (
              chat.messages.map((message) => (
                <MessageRow
                  key={message.id}
                  message={message}
                  editing={editing?.id === message.id ? editing.value : null}
                  onEditStart={() => setEditing({ id: message.id, value: message.content })}
                  onEditChange={(value) => setEditing({ id: message.id, value })}
                  onEditCancel={() => setEditing(null)}
                  onEditSave={() => {
                    if (editing) void chat.editAndResend(editing.id, editing.value);
                    setEditing(null);
                  }}
                  onRegenerate={() => void chat.regenerate(message.id)}
                  onContinue={() => void chat.continueGeneration(message.id)}
                  onDelete={() =>
                    store.activeId && void store.deleteMessage(store.activeId, message.id)
                  }
                />
              ))
            )}
            {chat.phase === "retrieving" && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" /> Retrieving knowledge and memory…
              </p>
            )}
            {chat.phase === "thinking" && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" /> Thinking…
              </p>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Composer */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void addFiles(Array.from(e.dataTransfer.files));
          }}
          className={cn("border-t px-3 py-3 transition-colors", dragging && "bg-accent/40")}
        >
          <div className="mx-auto w-full max-w-3xl">
            {attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {attachments.map((attachment) => (
                  <Badge key={attachment.id} variant="secondary" className="gap-1">
                    {attachment.previewUrl && (
                      <img
                        src={attachment.previewUrl}
                        alt={attachment.name}
                        className="size-4 rounded object-cover"
                      />
                    )}
                    <span className="max-w-40 truncate">{attachment.name}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${attachment.name}`}
                      onClick={() =>
                        setAttachments((prev) => prev.filter((a) => a.id !== attachment.id))
                      }
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2 rounded-2xl border bg-card p-2">
              <input
                ref={fileInput}
                type="file"
                multiple
                hidden
                onChange={(e) => {
                  void addFiles(Array.from(e.target.files ?? []));
                  e.target.value = "";
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Attach files"
                onClick={() => fileInput.current?.click()}
              >
                <Paperclip className="size-4" />
              </Button>
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && settings.sendOnEnter) {
                    e.preventDefault();
                    submit();
                  }
                }}
                rows={1}
                placeholder="Message AETHER…  (⌘K search · ⌘⇧O new chat · Esc stop)"
                aria-label="Message AETHER"
                className="max-h-48 min-h-10 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              {chat.isBusy ? (
                <Button variant="destructive" size="icon" aria-label="Stop generating" onClick={chat.stop}>
                  <Square className="size-4" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  aria-label="Send message"
                  disabled={!draft.trim() && attachments.length === 0}
                  onClick={submit}
                >
                  <Send className="size-4" />
                </Button>
              )}
            </div>
            {chat.error && (
              <div className="mt-2 flex items-center justify-between gap-2 text-xs text-destructive">
                <span className="truncate">{chat.error}</span>
                <Button size="sm" variant="outline" onClick={() => void chat.retryLast()}>
                  <RefreshCw className="mr-1 size-3" /> Retry
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ------------------------------- sub-components ----------------------------- */

function SidebarBody({
  filtered,
  onNew,
}: {
  filtered: ReturnType<typeof useConversationStore.getState>["conversations"];
  onNew: () => void;
}) {
  const store = useConversationStore();
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-2 p-3">
        <Button className="w-full justify-start" onClick={onNew}>
          <MessageSquarePlus className="mr-2 size-4" /> New conversation
        </Button>
        <a
          href="/cognitive-lab"
          className="flex items-center justify-start rounded-md border border-cyan-800/40 bg-cyan-950/30 px-3 py-2 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-900/50"
        >
          <BrainCircuit className="mr-2 size-4 text-cyan-400" /> AETHER Cognitive Lab
        </a>
        <div className="relative">
          <Search className="pointer-events-none absolute top-2.5 left-2.5 size-3.5 text-muted-foreground" />
          <Input
            id="aether-search"
            value={store.search}
            onChange={(e) => store.setSearch(e.target.value)}
            placeholder="Search conversations"
            className="pl-8"
          />
        </div>
        <label className="flex items-center justify-between text-xs text-muted-foreground">
          Show archived
          <Switch checked={store.showArchived} onCheckedChange={store.setShowArchived} />
        </label>
      </div>
      <ScrollArea className="min-h-0 flex-1 px-2 pb-4">
        {filtered.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">No conversations yet.</p>
        )}
        {filtered.map((conversation) => (
          <div
            key={conversation.id}
            className={cn(
              "group mb-1 flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent",
              store.activeId === conversation.id && "bg-accent",
            )}
          >
            <button
              type="button"
              className="min-w-0 flex-1 truncate text-left"
              onClick={() => void store.selectConversation(conversation.id)}
            >
              {conversation.pinned && <Pin className="mr-1 inline size-3" />}
              {conversation.title}
            </button>
            <div className="flex opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <IconAction
                label="Rename"
                onClick={() => {
                  const name = window.prompt("Rename conversation", conversation.title);
                  if (name) void store.patchConversation(conversation.id, { title: name });
                }}
              >
                <Pencil className="size-3" />
              </IconAction>
              <IconAction label="Pin" onClick={() => void store.togglePin(conversation.id)}>
                <Pin className="size-3" />
              </IconAction>
              <IconAction label="Archive" onClick={() => void store.toggleArchive(conversation.id)}>
                <Archive className="size-3" />
              </IconAction>
              <IconAction
                label="Delete"
                onClick={() => void store.deleteConversation(conversation.id)}
              >
                <Trash2 className="size-3" />
              </IconAction>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

function IconAction({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground"
    >
      {children}
    </button>
  );
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  const prompts = [
    "Summarise the documents in my knowledge base",
    "Explain hybrid retrieval with a Mermaid diagram",
    "Draft a TypeScript adapter interface for a new provider",
  ];
  return (
    <div className="py-16 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">AETHER</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        A vendor-neutral AI workspace: pluggable providers, hybrid RAG over your own documents, and
        layered long-term memory — all stored locally on this device.
      </p>
      <div className="mx-auto mt-6 grid max-w-lg gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPick(prompt)}
            className="rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageRow({
  message,
  editing,
  onEditStart,
  onEditChange,
  onEditCancel,
  onEditSave,
  onRegenerate,
  onContinue,
  onDelete,
}: {
  message: Message;
  editing: string | null;
  onEditStart: () => void;
  onEditChange: (value: string) => void;
  onEditCancel: () => void;
  onEditSave: () => void;
  onRegenerate: () => void;
  onContinue: () => void;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  return (
    <article className={cn("group mb-6", isUser ? "flex justify-end" : "")}>
      <div className={cn("min-w-0", isUser ? "max-w-[85%]" : "w-full")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser ? "bg-primary text-primary-foreground" : "bg-card border",
          )}
        >
          {editing !== null ? (
            <div className="space-y-2">
              <Textarea
                value={editing}
                onChange={(e) => onEditChange(e.target.value)}
                className="min-h-24 bg-background text-foreground"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={onEditSave}>
                  Save & resend
                </Button>
                <Button size="sm" variant="outline" onClick={onEditCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : isUser ? (
            <p className="whitespace-pre-wrap text-[15px] leading-7">{message.content}</p>
          ) : (
            <>
              {message.content ? (
                <MarkdownMessage content={message.content} />
              ) : message.status === "streaming" ? (
                <span className="inline-block h-4 w-2 animate-pulse rounded bg-foreground/60" />
              ) : null}
              {message.status === "error" && (
                <p className="text-sm text-destructive">{message.error}</p>
              )}
            </>
          )}

          {message.attachments?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {message.attachments.map((attachment) =>
                attachment.previewUrl ? (
                  <img
                    key={attachment.id}
                    src={attachment.previewUrl}
                    alt={attachment.name}
                    className="max-h-40 rounded-lg border object-contain"
                  />
                ) : (
                  <Badge key={attachment.id} variant="secondary">
                    {attachment.name}
                  </Badge>
                ),
              )}
            </div>
          ) : null}

          {message.citations?.length ? (
            <div className="mt-3 space-y-1 border-t pt-2">
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Sources
              </p>
              {message.citations.map((citation, index) => (
                <details key={citation.id} className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground">
                    [{index + 1}] {citation.documentName}
                    {citation.page ? ` · p.${citation.page}` : ""} · {citation.score}
                  </summary>
                  <p className="mt-1 rounded bg-muted/50 p-2 whitespace-pre-wrap">
                    {citation.snippet}
                  </p>
                </details>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <IconAction
            label="Copy"
            onClick={() => {
              void navigator.clipboard.writeText(message.content);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
          >
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          </IconAction>
          {isUser && (
            <IconAction label="Edit" onClick={onEditStart}>
              <Pencil className="size-3" />
            </IconAction>
          )}
          {!isUser && (
            <>
              <IconAction label="Regenerate" onClick={onRegenerate}>
                <RefreshCw className="size-3" />
              </IconAction>
              <IconAction label="Continue" onClick={onContinue}>
                <Send className="size-3" />
              </IconAction>
            </>
          )}
          <IconAction label="Delete" onClick={onDelete}>
            <Trash2 className="size-3" />
          </IconAction>
        </div>
      </div>
    </article>
  );
}

function KnowledgeSheet() {
  const knowledge = useKnowledgeStore();
  const input = useRef<HTMLInputElement>(null);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Knowledge base">
          <Database className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Knowledge base</SheetTitle>
        </SheetHeader>
        <div className="space-y-3 p-4">
          <input
            ref={input}
            type="file"
            multiple
            hidden
            accept=".pdf,.docx,.txt,.md,.csv,.tsv,.json,image/*"
            onChange={(e) => {
              void knowledge.ingest(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
          <Button className="w-full" onClick={() => input.current?.click()}>
            Upload documents
          </Button>
          <p className="text-xs text-muted-foreground">
            PDF, DOCX, TXT, Markdown, CSV, JSON and images (OCR). Chunked, indexed for BM25 and
            embedded when an embedding model is configured.
          </p>
          {knowledge.ingesting.map((name) => (
            <p key={name} className="flex items-center gap-2 text-xs">
              <Loader2 className="size-3 animate-spin" /> Ingesting {name}…
            </p>
          ))}
          {knowledge.documents.map((document) => (
            <div key={document.id} className="rounded-lg border p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="min-w-0 flex-1 truncate font-medium">{document.name}</span>
                <IconAction label="Delete document" onClick={() => void knowledge.remove(document.id)}>
                  <Trash2 className="size-3" />
                </IconAction>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {document.status}
                {document.chunkCount ? ` · ${document.chunkCount} chunks` : ""}
                {document.vectorised ? " · vectorised" : " · lexical only"}
              </p>
              {document.error && <p className="text-xs text-destructive">{document.error}</p>}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MemorySheet() {
  const memory = useMemoryStore();
  const [value, setValue] = useState("");
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Memory">
          <BrainCircuit className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Memory layers</SheetTitle>
        </SheetHeader>
        <div className="space-y-3 p-4">
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Remember that…"
            />
            <Button
              onClick={() => {
                if (!value.trim()) return;
                void memory.add({
                  scope: "user",
                  kind: "preference",
                  content: value.trim(),
                  importance: 0.9,
                });
                setValue("");
              }}
            >
              Add
            </Button>
          </div>
          {memory.records.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No memories yet. AETHER writes conversation, workspace and user memory automatically.
            </p>
          )}
          {memory.records.map((record) => (
            <div key={record.id} className="rounded-lg border p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 flex-1">{record.content}</p>
                <IconAction label="Forget" onClick={() => void memory.remove(record.id)}>
                  <Trash2 className="size-3" />
                </IconAction>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {record.scope} · {record.kind} · importance {record.importance.toFixed(2)} ·{" "}
                {record.hits} hits
              </p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SettingsSheet() {
  const settings = useSettingsStore();
  const provider = useProviderStatus();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings2 className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="space-y-5 p-4 text-sm">
          <div className="space-y-2">
            <Label htmlFor="aether-model">Model</Label>
            <Input
              id="aether-model"
              value={settings.model}
              placeholder={provider.data?.defaultModel || "provider default"}
              onChange={(e) => settings.update("model", e.target.value)}
            />
            {provider.data?.models?.length ? (
              <div className="flex flex-wrap gap-1">
                {provider.data.models.slice(0, 12).map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => settings.update("model", model.id)}
                    className="rounded border px-2 py-0.5 text-[11px] hover:bg-accent"
                  >
                    {model.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="aether-system">System prompt</Label>
            <Textarea
              id="aether-system"
              value={settings.systemPrompt}
              onChange={(e) => settings.update("systemPrompt", e.target.value)}
              className="min-h-28"
            />
          </div>

          <SliderRow
            label={`Temperature · ${settings.temperature.toFixed(2)}`}
            value={settings.temperature}
            min={0}
            max={2}
            step={0.05}
            onChange={(v) => settings.update("temperature", v)}
          />
          <SliderRow
            label={`Max tokens · ${settings.maxTokens}`}
            value={settings.maxTokens}
            min={256}
            max={32_000}
            step={256}
            onChange={(v) => settings.update("maxTokens", v)}
          />
          <SliderRow
            label={`Hybrid alpha (lexical ↔ semantic) · ${settings.hybridAlpha.toFixed(2)}`}
            value={settings.hybridAlpha}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => settings.update("hybridAlpha", v)}
          />
          <SliderRow
            label={`Retrieved chunks · ${settings.ragTopK}`}
            value={settings.ragTopK}
            min={1}
            max={16}
            step={1}
            onChange={(v) => settings.update("ragTopK", v)}
          />

          <ToggleRow
            label="Retrieval-augmented generation"
            checked={settings.ragEnabled}
            onChange={(v) => settings.update("ragEnabled", v)}
          />
          <ToggleRow
            label="Semantic vector search"
            checked={settings.semanticSearch}
            onChange={(v) => settings.update("semanticSearch", v)}
          />
          <ToggleRow
            label="Long-term memory"
            checked={settings.memoryEnabled}
            onChange={(v) => settings.update("memoryEnabled", v)}
          />
          <ToggleRow
            label="Automatic summarisation"
            checked={settings.autoSummarise}
            onChange={(v) => settings.update("autoSummarise", v)}
          />
          <ToggleRow
            label="Show citations"
            checked={settings.showCitations}
            onChange={(v) => settings.update("showCitations", v)}
          />
          <ToggleRow
            label="Enter sends message"
            checked={settings.sendOnEnter}
            onChange={(v) => settings.update("sendOnEnter", v)}
          />

          <div className="rounded-lg border p-3 text-xs text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">Runtime</p>
            <p>{provider.data?.runtime ?? "not configured"}</p>
            <p>adapter: {provider.data?.adapter ?? "—"}</p>
            <p>embeddings: {provider.data?.embeddingModel || "not configured"}</p>
          </div>

          <RuntimeHealthPanel />

        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Live health of every self-hosted runtime AETHER can reach. */
function RuntimeHealthPanel() {
  const health = useRuntimeHealth();
  const refresh = useRuntimeRefresh();
  return (
    <div className="rounded-lg border p-3 text-xs">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-medium">Local runtime health</p>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-[11px]"
          disabled={refresh.isPending}
          onClick={() => refresh.mutate()}
        >
          {refresh.isPending ? (
            <Loader2 className="mr-1 size-3 animate-spin" />
          ) : (
            <RefreshCw className="mr-1 size-3" />
          )}
          Re-scan
        </Button>
      </div>
      {health.isLoading ? (
        <Skeleton className="h-16 w-full" />
      ) : health.error ? (
        <p className="text-muted-foreground">Health check unavailable.</p>
      ) : (
        <ul className="space-y-1.5">
          {health.data?.runtimes.map((runtime) => (
            <li key={`${runtime.provider}-${runtime.endpoint}`} className="flex items-start gap-2">
              <span
                aria-hidden
                className={cn(
                  "mt-1 size-2 shrink-0 rounded-full",
                  runtime.reachable && runtime.modelCount
                    ? "bg-emerald-500"
                    : runtime.reachable
                      ? "bg-amber-500"
                      : "bg-muted-foreground/40",
                )}
              />
              <div className="min-w-0">
                <p className="truncate font-medium">{runtime.label}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {runtime.endpoint} ·{" "}
                  {runtime.reachable
                    ? `${runtime.modelCount} model${runtime.modelCount === 1 ? "" : "s"}${
                        runtime.latencyMs !== null ? ` · ${runtime.latencyMs}ms` : ""
                      }`
                    : (runtime.error ?? "offline")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[11px] text-muted-foreground">
        Mode: {health.data?.mode ?? "—"}
        {health.data?.configuredProvider ? ` · pinned to ${health.data.configuredProvider}` : ""}
      </p>
    </div>
  );
}



function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(next ?? value)}
      />
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
