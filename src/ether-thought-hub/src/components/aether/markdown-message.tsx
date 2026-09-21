import { lazy, memo, Suspense } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MermaidDiagram = lazy(() => import("./mermaid-diagram"));

function CodeBlock({ className, children }: { className?: string | undefined; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const language = /language-(\w+)/.exec(className ?? "")?.[1] ?? "text";
  const raw = String(children ?? "");

  if (language === "mermaid") {
    return (
      <Suspense fallback={<div className="text-muted-foreground text-sm">Rendering diagram…</div>}>
        <MermaidDiagram chart={raw} />
      </Suspense>
    );
  }

  return (
    <div className="group/code relative my-3 overflow-hidden rounded-lg border bg-muted/40">
      <div className="flex items-center justify-between border-b bg-muted/60 px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          {language}
        </span>
        <button
          type="button"
          aria-label="Copy code"
          onClick={() => {
            void navigator.clipboard.writeText(raw);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-[13px] leading-relaxed">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

/** Markdown + GFM tables + KaTeX math + highlighted code + Mermaid. */
export const MarkdownMessage = memo(function MarkdownMessage({
  content,
  className,
}: {
  content: string;
  className?: string | undefined;
}) {
  return (
    <div
      className={cn(
        "aether-prose text-[15px] leading-7 break-words [&_a]:underline [&_a]:decoration-dotted",
        className,
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: ({ className: cls, children }) =>
            /language-/.test(cls ?? "") ? (
              <CodeBlock className={cls}>{children}</CodeBlock>
            ) : (
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px]">
                {children}
              </code>
            ),
          h1: ({ children }) => <h2 className="mt-4 mb-2 text-xl font-semibold">{children}</h2>,
          h2: ({ children }) => <h3 className="mt-4 mb-2 text-lg font-semibold">{children}</h3>,
          h3: ({ children }) => <h4 className="mt-3 mb-1.5 font-semibold">{children}</h4>,
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-primary/50 pl-3 text-muted-foreground italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-3 w-full overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b bg-muted/60 px-3 py-2 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="border-b px-3 py-2 align-top">{children}</td>,
          img: ({ src, alt }) => (
            <img
              src={typeof src === "string" ? src : ""}
              alt={alt ?? ""}
              loading="lazy"
              className="my-3 max-h-96 rounded-lg border object-contain"
            />
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
});
