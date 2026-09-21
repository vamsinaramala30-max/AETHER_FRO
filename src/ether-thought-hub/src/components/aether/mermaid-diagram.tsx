import { useEffect, useId, useRef, useState } from "react";

/** Browser-only Mermaid renderer (lazy-loaded to keep it out of SSR). */
export default function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "strict" });
        const { svg } = await mermaid.render(`aether-${id}`, chart);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Invalid diagram");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre className="my-3 overflow-x-auto rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs">
        {chart}
      </pre>
    );
  }
  return <div ref={ref} className="my-3 overflow-x-auto rounded-lg border bg-muted/30 p-3" />;
}
