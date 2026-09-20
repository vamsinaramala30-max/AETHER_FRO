// ============================================================================
// AETHER AI — AIMessage Component
// ============================================================================
// High-fidelity semantic rendering for AI Assistant messages.
// Supports markdown lists, bold/italic, tables, code blocks with copy,
// Verification Status badges, Confidence badges, Citations, Tools, and Plans.
// ============================================================================

import React, { memo, useState, useCallback } from 'react';
import type { AIMessage as AIMessageType, VerificationStatus } from '../ai-types';
import { SourceCitation } from './SourceCitation';
import { ToolExecution } from './ToolExecution';
import { PlanView } from './PlanView';

interface AIMessageProps {
  message: AIMessageType;
  onRetry?: (messageId: string) => void;
  className?: string;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="group/code relative my-3 overflow-hidden rounded-xl border border-aether-code-border bg-aether-code shadow-md">
      <div className="flex items-center justify-between border-b border-aether-code-border bg-aether-code-header px-3.5 py-1.5 text-[11px] font-mono text-aether-code-header-text">
        <span className="font-semibold uppercase tracking-wider text-aether-code-header-text">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-aether-code-header-text transition-colors hover:bg-white/10 hover:text-aether-code-text focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
        >
          {copied ? (
            <>
              <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 text-xs leading-relaxed text-aether-code-text">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function renderInlineFormatting(text: string): React.ReactNode[] {
  // Regex splitting for inline code `...`, bold **...**, and italic *...*
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="rounded bg-aether-surface-elevated px-1.5 py-0.5 font-mono text-[12px] text-indigo-600 dark:text-indigo-300 border border-aether-border"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-inherit">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-inherit opacity-90">
          {token.slice(1, -1)}
        </em>,
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * Render message content supporting markdown paragraphs, code blocks, lists, and tables.
 */
function renderContent(content: string): React.ReactNode {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line !== undefined && line.startsWith('```')) {
      // Code block
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && lines[i] !== undefined && !lines[i]!.startsWith('```')) {
        codeLines.push(lines[i]!);
        i++;
      }
      elements.push(
        <CodeBlock key={`code-${i}`} code={codeLines.join('\n')} language={lang} />,
      );
    } else if (line !== undefined && line.startsWith('|') && line.endsWith('|')) {
      // Table detection
      const tableLines: string[] = [line];
      i++;
      while (
        i < lines.length &&
        lines[i] !== undefined &&
        lines[i]!.startsWith('|') &&
        lines[i]!.endsWith('|')
      ) {
        tableLines.push(lines[i]!);
        i++;
      }
      // Render table
      const rows = tableLines
        .filter((l) => !l.match(/^\|?\s*[-:]+[-| :]*\|?$/))
        .map((l) =>
          l
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim()),
        );

      if (rows.length > 0) {
        const headerRow = rows[0];
        const bodyRows = rows.slice(1);
        elements.push(
          <div
            key={`table-${i}`}
            className="my-3 overflow-x-auto rounded-xl border border-aether-table-border bg-aether-surface"
          >
            <table className="min-w-full divide-y divide-aether-table-border text-xs">
              {headerRow && (
                <thead className="bg-aether-table-header">
                  <tr>
                    {headerRow.map((cell, cIdx) => (
                      <th
                        key={cIdx}
                        className="px-3 py-2 text-left font-semibold text-aether-table-text"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-aether-table-border/50">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-aether-hover/30">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-aether-table-text-muted">
                        {renderInlineFormatting(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
      }
      continue;
    } else if (line !== undefined && (line.startsWith('- ') || line.startsWith('* '))) {
      // Unordered list item
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2 my-1 pl-1">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
          <span className="leading-relaxed text-aether-main">
            {renderInlineFormatting(line.slice(2))}
          </span>
        </div>,
      );
    } else if (line !== undefined && /^\d+\.\s/.test(line)) {
      // Ordered list item
      const numMatch = line.match(/^(\d+)\.\s(.*)$/);
      if (numMatch) {
        elements.push(
          <div key={`oli-${i}`} className="flex items-start gap-2 my-1 pl-1">
            <span className="font-mono text-xs font-semibold text-indigo-500 dark:text-indigo-400 shrink-0">
              {numMatch[1]}.
            </span>
            <span className="leading-relaxed text-aether-main">
              {renderInlineFormatting(numMatch[2] ?? '')}
            </span>
          </div>,
        );
      }
    } else if (line !== undefined && line.startsWith('> ')) {
      // Blockquote / Callout
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-2 border-l-2 border-aether-blockquote-border bg-aether-blockquote-bg pl-3 py-1 text-xs italic text-aether-blockquote-text rounded-r"
        >
          {renderInlineFormatting(line.slice(2))}
        </blockquote>,
      );
    } else if (line !== undefined && line.startsWith('### ')) {
      elements.push(
        <h4 key={`h3-${i}`} className="mt-3 mb-1 text-xs font-bold uppercase tracking-wider text-aether-main">
          {line.slice(4)}
        </h4>,
      );
    } else if (line !== undefined && line.startsWith('## ')) {
      elements.push(
        <h3 key={`h2-${i}`} className="mt-4 mb-1.5 text-sm font-bold text-aether-main">
          {line.slice(3)}
        </h3>,
      );
    } else if (line !== undefined && line.startsWith('# ')) {
      elements.push(
        <h2 key={`h1-${i}`} className="mt-4 mb-2 text-base font-extrabold text-aether-main">
          {line.slice(2)}
        </h2>,
      );
    } else if (line !== undefined && line.trim()) {
      elements.push(
        <p key={`p-${i}`} className="leading-relaxed">
          {renderInlineFormatting(line)}
        </p>,
      );
    } else if (line !== undefined) {
      elements.push(<div key={`sp-${i}`} className="h-1.5" />);
    }
    i++;
  }

  return elements;
}

function VerificationBadge({ status }: { status: VerificationStatus }) {
  const configs: Record<
    VerificationStatus,
    { label: string; icon: string; classes: string }
  > = {
    VERIFIED: {
      label: 'Verified Evidence',
      icon: '✓',
      classes: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    PARTIALLY_VERIFIED: {
      label: 'Partially Verified',
      icon: '◐',
      classes: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    FAILED: {
      label: 'Verification Failed',
      icon: '✗',
      classes: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
    },
    PENDING: {
      label: 'Verifying…',
      icon: '○',
      classes: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    NOT_VERIFIABLE: {
      label: 'Unverified Information',
      icon: '·',
      classes: 'border-aether-border bg-aether-subtle text-aether-muted',
    },
    UNVERIFIED: {
      label: 'Unverified',
      icon: '·',
      classes: 'border-aether-border bg-aether-subtle text-aether-muted',
    },
  };

  const c = configs[status] ?? configs.UNVERIFIED;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${c.classes}`}
      title={`Verification status: ${c.label}`}
    >
      <span className="font-bold">{c.icon}</span>
      <span>{c.label}</span>
    </span>
  );
}

/**
 * AIMessage — Renders a single message with role-appropriate styling,
 * rich semantic elements, verification status, citations, tools, and actions.
 */
export const AIMessage = memo<AIMessageProps>(({ message, onRetry, className = '' }) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isError = message.status === 'error';
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = useCallback(() => {
    void navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  const hasRecalledMemory =
    isAssistant &&
    message.evidence?.some((e) => e.sourceType === 'approved_memory');

  const isMemoryStore =
    isAssistant &&
    (/saved to memory|stored in memory|remembered/i.test(message.content) ||
      Boolean(message.evidence?.some((e) => (e.metadata as any)?.action === 'store')));

  const isMemoryForget =
    isAssistant &&
    (/removed from memory|forgotten from memory|memory deleted/i.test(message.content) ||
      Boolean(message.evidence?.some((e) => (e.metadata as any)?.action === 'forget')));

  const hasKnowledge =
    isAssistant &&
    (Boolean(message.evidence?.some((e) => e.sourceType === 'retrieved_knowledge')) ||
      Boolean(message.citations && message.citations.length > 0));

  return (
    <article
      className={`group flex gap-3 py-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${className}`}
      aria-label={`${message.role} message`}
    >
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${
          isUser
            ? 'bg-indigo-600 text-white'
            : isAssistant
              ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
              : 'bg-aether-subtle text-aether-muted'
        }`}
        aria-hidden="true"
      >
        {isUser ? 'U' : isAssistant ? 'A' : 'S'}
      </div>

      {/* Content wrapper */}
      <div
        className={`min-w-0 max-w-[85%] sm:max-w-[80%] flex-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm shadow-sm transition-colors ${
            isUser
              ? 'rounded-tr-sm bg-indigo-600 text-white'
              : isError
                ? 'rounded-tl-sm border border-rose-500/30 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                : 'rounded-tl-sm border border-aether-border bg-aether-surface text-aether-main shadow-xs'
          }`}
        >
          {/* Metadata Header (Confidence + Verification + Memory + Knowledge) */}
          {isAssistant && (
            <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
              {message.verificationStatus && (
                <VerificationBadge status={message.verificationStatus} />
              )}

              {message.confidence && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                    message.confidence === 'HIGH_CONFIDENCE'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : message.confidence === 'MEDIUM_CONFIDENCE'
                        ? 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                        : message.confidence === 'LOW_CONFIDENCE'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {message.confidence === 'HIGH_CONFIDENCE'
                    ? 'High Confidence'
                    : message.confidence === 'MEDIUM_CONFIDENCE'
                      ? 'Medium Confidence'
                      : message.confidence === 'LOW_CONFIDENCE'
                        ? 'Low Confidence'
                        : 'Limited Context'}
                </span>
              )}

              {/* Memory Status Badges (Prompt 4 UX) */}
              {isMemoryStore && (
                <span
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-300"
                  title="Fact successfully saved to persistent memory"
                >
                  <span className="text-[11px]">💾</span>
                  <span>Saved to memory</span>
                </span>
              )}

              {isMemoryForget && (
                <span
                  className="inline-flex items-center gap-1 rounded-full border border-aether-border bg-aether-subtle px-2 py-0.5 text-[10px] font-medium text-aether-muted"
                  title="Memory item removed"
                >
                  <span className="text-[11px]">🗑️</span>
                  <span>Memory removed</span>
                </span>
              )}

              {!isMemoryStore && !isMemoryForget && hasRecalledMemory && (
                <span
                  className="inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[10px] font-medium text-teal-600 dark:text-teal-300"
                  title="Relevant context was recalled from persistent memory"
                >
                  <span className="text-[11px]">🧠</span>
                  <span>Using relevant memory</span>
                </span>
              )}

              {/* Knowledge Status Badge (Prompt 5 UX) */}
              {hasKnowledge && (
                <span
                  className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-600 dark:text-sky-300"
                  title="Evidence retrieved from your workspace knowledge"
                >
                  <span className="text-[11px]">📚</span>
                  <span>Workspace Knowledge</span>
                </span>
              )}
            </div>
          )}

          {/* Message Body */}
          {isError ? (
            <div className="flex items-start gap-2">
              <svg className="h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-rose-600 dark:text-rose-300">{message.error ?? 'An error occurred during response generation.'}</p>
            </div>
          ) : (
            <div className="space-y-1 overflow-hidden break-words text-aether-main">
              {renderContent(message.content)}
            </div>
          )}
        </div>

        {/* Plan View (Action plan steps) */}
        {isAssistant && message.plan && <PlanView plan={message.plan} className="w-full" />}

        {/* Citations (RAG Knowledge references) */}
        {isAssistant && message.citations && message.citations.length > 0 && (
          <SourceCitation citations={message.citations} className="w-full" />
        )}

        {/* Tool executions */}
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <ToolExecution toolInvocations={message.toolInvocations} className="w-full" />
        )}

        {/* Footer actions: Timestamp, Copy, Retry */}
        <div className="mt-1 flex items-center gap-2 px-1 text-[10px] text-aether-muted">
          <time dateTime={new Date(message.createdAt).toISOString()}>
            {formatTime(message.createdAt)}
          </time>

          {message.tokens?.total !== undefined && (
            <span>· {message.tokens.total} tokens</span>
          )}

          {/* Quick Copy Button */}
          {!isError && (
            <button
              type="button"
              onClick={handleCopyMessage}
              aria-label="Copy message content"
              className="rounded p-0.5 text-aether-muted opacity-0 transition-opacity hover:text-aether-main group-hover:opacity-100 focus:opacity-100"
            >
              {copied ? (
                <span className="text-emerald-500 dark:text-emerald-400">Copied</span>
              ) : (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Retry Button on error */}
          {isError && onRetry && (
            <button
              type="button"
              onClick={() => onRetry(message.id)}
              aria-label="Retry generation"
              className="flex items-center gap-1 font-medium text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 hover:underline focus:outline-none"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          )}
        </div>
      </div>
    </article>
  );
});

AIMessage.displayName = 'AIMessage';
