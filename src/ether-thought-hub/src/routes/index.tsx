import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { AetherApp } from "@/components/aether/aether-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AETHER — Vendor-neutral AI assistant workspace" },
      {
        name: "description",
        content:
          "AETHER is a production-grade AI assistant with pluggable LLM providers, hybrid RAG over your own documents, and layered long-term memory.",
      },
      { property: "og:title", content: "AETHER — Vendor-neutral AI assistant workspace" },
      {
        property: "og:description",
        content:
          "AETHER is a production-grade AI assistant with pluggable LLM providers, hybrid RAG over your own documents, and layered long-term memory.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={<div className="h-[100dvh] bg-background" />}>
      <AetherApp />
    </ClientOnly>
  );
}
