// ============================================================================
// AETHER AI — AIMessage Component
// ============================================================================

import React, { memo } from 'react';
import type { AIMessage as AIMessageType } from '../ai-types';
import { SourceCitation } from './SourceCitation';
import { ToolExecution } from './ToolExecution';

interface AIMessageProps {
  message: AIMessageType;
  className?: string;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Render message content with basic code block detection.
 * A full markdown renderer can be substituted here.
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
        <pre
          key={i}
          className="my-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-200"
          aria-label={lang ? `Code block: ${lang}` : 'Code block'}
        >
          <code>{codeLines.join('\n')}</code>
        </pre>,
      );
    } else if (line !== undefined && line.trim()) {
      elements.push(
        <p key={i} className="leading-relaxed">
          {line}
        </p>,
      );
    } else if (line !== undefined) {
      elements.push(<br key={i} />);
    }
    i++;
  }

  return elements;
}

/**
 * AIMessage — Renders a single message with role-appropriate styling.
 * Supports user, assistant, system, and tool messages.
 */
export const AIMessage = memo<AIMessageProps>(({ message, className = '' }) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isError = message.status === 'error';

  return (
    <article
      className={`group flex gap-3 py-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${className}`}
      aria-label={`${message.role} message`}
    >
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isUser
            ? 'bg-indigo-600 text-white'
            : isAssistant
              ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
              : 'bg-slate-700 text-slate-300'
        }`}
        aria-hidden="true"
      >
        {isUser ? 'U' : isAssistant ? 'A' : 'S'}
      </div>

      {/* Content */}
      <div className={`min-w-0 max-w-[80%] flex-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm ${
            isUser
              ? 'rounded-tr-sm bg-indigo-600 text-white'
              : isError
                ? 'rounded-tl-sm border border-red-500/20 bg-red-950/40 text-red-300'
                : 'rounded-tl-sm bg-slate-800/80 text-slate-100'
          }`}
        >
          {isAssistant && message.confidence && (
            <div className="mb-2 flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                  message.confidence === 'HIGH_CONFIDENCE'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : message.confidence === 'MEDIUM_CONFIDENCE'
                      ? 'border-sky-500/30 bg-sky-500/10 text-sky-400'
                      : message.confidence === 'LOW_CONFIDENCE'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                        : 'border-purple-500/30 bg-purple-500/10 text-purple-400'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {message.confidence === 'HIGH_CONFIDENCE'
                  ? 'Verified Evidence'
                  : message.confidence === 'MEDIUM_CONFIDENCE'
                    ? 'Qualified Answer'
                    : message.confidence === 'LOW_CONFIDENCE'
                      ? 'Low Confidence'
                      : 'Insufficient Info'}
              </span>
            </div>
          )}
          {isError ? (
            <p className="text-sm">{message.error ?? 'An error occurred.'}</p>
          ) : (
            <div className="space-y-1">{renderContent(message.content)}</div>
          )}
        </div>

        {/* Citations */}
        {isAssistant && message.citations && message.citations.length > 0 && (
          <SourceCitation citations={message.citations} className="w-full" />
        )}

        {/* Tool executions */}
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <ToolExecution toolInvocations={message.toolInvocations} className="w-full" />
        )}

        {/* Timestamp */}
        <time
          className="mt-1 px-1 text-[10px] text-slate-600 opacity-0 transition-opacity group-hover:opacity-100"
          dateTime={new Date(message.createdAt).toISOString()}
          aria-label={`Sent at ${formatTime(message.createdAt)}`}
        >
          {formatTime(message.createdAt)}
          {message.tokens?.total !== undefined && (
            <span className="ml-1 text-slate-700">· {message.tokens.total} tokens</span>
          )}
        </time>
      </div>
    </article>
  );
});

AIMessage.displayName = 'AIMessage';
