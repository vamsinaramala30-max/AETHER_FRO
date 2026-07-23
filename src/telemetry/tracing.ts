export interface TraceSpan {
  traceId: string;
  spanId: string;
  name: string;
  startTime: number;
  endTime?: number;
  tags: Record<string, string | number | boolean>;
}

class Tracer {
  private activeSpans: Map<string, TraceSpan> = new Map();

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  public startSpan(name: string, tags: Record<string, string | number | boolean> = {}): TraceSpan {
    const span: TraceSpan = {
      traceId: this.generateId(),
      spanId: this.generateId(),
      name,
      startTime: performance.now(),
      tags,
    };
    this.activeSpans.set(span.spanId, span);
    return span;
  }

  public endSpan(spanId: string): TraceSpan | undefined {
    const span = this.activeSpans.get(spanId);
    if (!span) return undefined;

    span.endTime = performance.now();
    this.activeSpans.delete(spanId);
    return span;
  }

  public traceAsync<T>(name: string, fn: () => Promise<T>, tags: Record<string, string | number | boolean> = {}): Promise<T> {
    const span = this.startSpan(name, tags);
    return fn().finally(() => {
      this.endSpan(span.spanId);
    });
  }
}

export const tracer = new Tracer();