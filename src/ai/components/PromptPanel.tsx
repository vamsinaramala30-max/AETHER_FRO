// ============================================================================
// AETHER AI — PromptPanel Component
// ============================================================================

import React, { memo, useEffect, useState } from 'react';
import type { PromptTemplate, PromptCategory } from '../ai-types';
import { promptEngine } from '../prompts/prompt-engine';
import { previewPrompt } from '../prompts/prompt-builder';

const CATEGORY_LABELS: Record<PromptCategory, string> = {
  system: 'System',
  rag: 'RAG',
  agent: 'Agent',
  user: 'User',
  custom: 'Custom',
};

interface PromptItemProps {
  template: PromptTemplate;
}

const PromptItem = memo<PromptItemProps>(({ template }) => {
  const [expanded, setExpanded] = useState(false);
  const preview = previewPrompt(template).slice(0, 120);

  return (
    <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-start gap-3 p-3 text-left hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-expanded={expanded}
        id={`prompt-${template.id}`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
              {CATEGORY_LABELS[template.category]}
            </span>
            {template.isBuiltIn && (
              <span className="rounded bg-slate-700 px-1 py-0.5 text-[9px] text-slate-400">Built-in</span>
            )}
          </div>
          <p className="mt-0.5 text-xs font-medium text-slate-200">{template.name}</p>
          {template.description && (
            <p className="text-[10px] text-slate-500">{template.description}</p>
          )}
        </div>
        <svg
          className={`mt-1 h-3 w-3 shrink-0 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div
          className="border-t border-slate-700/40 bg-slate-900/40 p-3"
          role="region"
          aria-labelledby={`prompt-${template.id}`}
        >
          <p className="text-[11px] leading-relaxed text-slate-400">{preview}{preview.length < template.template.length ? '…' : ''}</p>
          {template.variables.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {template.variables.map((v) => (
                <span
                  key={v.name}
                  className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] text-indigo-300"
                >
                  {`{{${v.name}}}`}{v.required ? '*' : ''}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

PromptItem.displayName = 'PromptItem';

/**
 * PromptPanel — Displays available prompt templates from the backend.
 */
export const PromptPanel = memo(() => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const result = await promptEngine.listPrompts();
      if (result.success) setTemplates(result.data);
      setLoading(false);
    })();
  }, []);

  return (
    <section className="flex flex-col gap-4" aria-labelledby="prompt-panel-heading">
      <h2 id="prompt-panel-heading" className="text-sm font-semibold text-slate-200">
        Prompt Library
      </h2>

      {loading ? (
        <div className="py-8 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-400" aria-label="Loading prompts" />
        </div>
      ) : templates.length === 0 ? (
        <div className="rounded-xl border border-slate-700/40 bg-slate-800/20 p-6 text-center">
          <p className="text-xs text-slate-500">No prompt templates available.</p>
        </div>
      ) : (
        <ul className="space-y-2" role="list" aria-label="Prompt templates">
          {templates.map((t) => (
            <li key={t.id}>
              <PromptItem template={t} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});

PromptPanel.displayName = 'PromptPanel';
