// ============================================================================
// AETHER AI — ModelPanel Component
// ============================================================================

import React, { memo } from 'react';
import type { AIModelInfo } from '../ai-types';
import { useModel } from '../hooks/useModel';
import { getModelStatusLabel } from '../llm/model-runtime';

const STATUS_COLORS: Record<AIModelInfo['status'], string> = {
  available: 'text-aether-muted',
  loading: 'text-amber-400',
  loaded: 'text-emerald-400',
  unloading: 'text-amber-400',
  unavailable: 'text-aether-subtleText',
  error: 'text-red-400',
};

const STATUS_DOT_COLORS: Record<AIModelInfo['status'], string> = {
  available: 'bg-aether-muted',
  loading: 'bg-amber-400',
  loaded: 'bg-emerald-400',
  unloading: 'bg-amber-400',
  unavailable: 'bg-aether-subtleText',
  error: 'bg-red-400',
};

interface ModelCardProps {
  model: AIModelInfo;
  isActive: boolean;
  onSelect: (model: AIModelInfo) => void;
  onLoad: (id: string) => void;
}

const ModelCard = memo<ModelCardProps>(({ model, isActive, onSelect, onLoad }) => (
  <div
    className={`rounded-xl border p-3 transition-colors ${
      isActive
        ? 'border-indigo-500/40 bg-indigo-500/10'
        : 'border-aether-border bg-aether-ai-panel-item hover:bg-aether-ai-panel-item-hover'
    }`}
  >
    <div className="flex items-start gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-aether-subtle text-xs font-bold text-aether-muted"
        aria-hidden="true"
      >
        {model.runtime === 'local' ? '⚡' : '🌐'}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-xs font-semibold text-aether-main">{model.name}</p>
          {isActive && (
            <span className="shrink-0 rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-300">
              Active
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_COLORS[model.status]}`}
            aria-hidden="true"
          />
          <span className={`text-[10px] ${STATUS_COLORS[model.status]}`}>
            {getModelStatusLabel(model.status)}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {model.contextWindow && (
            <span className="text-[9px] text-aether-subtleText">
              {(model.contextWindow / 1000).toFixed(0)}k ctx
            </span>
          )}
          {model.parametersB && (
            <span className="text-[9px] text-aether-subtleText">{model.parametersB}B params</span>
          )}
          {model.quantization && (
            <span className="text-[9px] text-aether-subtleText">{model.quantization}</span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-1">
        {!isActive && (model.status === 'available' || model.status === 'loaded') && (
          <button
            type="button"
            onClick={() => onSelect(model)}
            aria-label={`Use model ${model.name}`}
            className="rounded-lg px-2 py-1 text-[10px] font-medium text-indigo-400 hover:bg-indigo-500/10 focus:outline-none"
          >
            Use
          </button>
        )}
        {model.status === 'available' && model.runtime === 'local' && (
          <button
            type="button"
            onClick={() => onLoad(model.id)}
            aria-label={`Load model ${model.name}`}
            className="rounded-lg px-2 py-1 text-[10px] font-medium text-aether-muted hover:bg-aether-hover focus:outline-none"
          >
            Load
          </button>
        )}
      </div>
    </div>
  </div>
));

ModelCard.displayName = 'ModelCard';

/**
 * ModelPanel — Displays available models, active model, and status.
 */
export const ModelPanel = memo(() => {
  const { availableModels, activeModel, isLoading, setActiveModel, requestLoadModel, loadModels } =
    useModel();

  return (
    <section className="flex flex-col gap-4" aria-labelledby="model-panel-heading">
      <div className="flex items-center justify-between">
        <h2 id="model-panel-heading" className="text-sm font-semibold text-aether-main">
          Models
        </h2>
        <button
          type="button"
          onClick={() => void loadModels()}
          aria-label="Refresh models"
          className="rounded-lg p-1.5 text-aether-muted hover:bg-aether-hover hover:text-aether-main focus:outline-none"
          disabled={isLoading}
        >
          <svg
            className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {isLoading && availableModels.length === 0 ? (
        <div className="py-8 text-center">
          <div
            className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-400"
            aria-label="Loading models"
          />
        </div>
      ) : availableModels.length === 0 ? (
        <div className="rounded-xl border border-aether-border bg-aether-subtle p-6 text-center">
          <p className="text-xs text-aether-muted">No models available.</p>
          <p className="mt-1 text-[11px] text-aether-subtleText">Ensure the AETHER backend is running.</p>
        </div>
      ) : (
        <ul className="space-y-2" role="list" aria-label="Available models">
          {availableModels.map((model) => (
            <li key={model.id}>
              <ModelCard
                model={model}
                isActive={activeModel?.id === model.id}
                onSelect={setActiveModel}
                onLoad={(id) => void requestLoadModel(id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});

ModelPanel.displayName = 'ModelPanel';
