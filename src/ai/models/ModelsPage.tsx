import React, { useEffect, useState } from 'react';
import { Cpu, Zap, Star, CheckCircle, Plus, X, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useAI } from '@/contexts/AIContext';
import { apiClient } from '@/api/client';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  contextWindow: string;
  latency: string;
  cost: string;
  capabilities: string[];
  enabled: boolean;
  isDefault: boolean;
}

const DEFAULT_MODELS: AIModel[] = [
  {
    id: 'llama3.1:8b',
    name: 'llama3.1:8b',
    provider: 'Ollama (Local)',
    contextWindow: '8K',
    latency: 'Ultra Fast',
    cost: 'Free',
    capabilities: ['Chat', 'Code', 'Function Calling'],
    enabled: true,
    isDefault: true,
  },
  {
    id: 'llama3.2',
    name: 'llama3.2',
    provider: 'Ollama (Local)',
    contextWindow: '128K',
    latency: 'Fast',
    cost: 'Free',
    capabilities: ['Chat', 'Vision', 'Code'],
    enabled: true,
    isDefault: false,
  },
  {
    id: 'qwen2.5:7b',
    name: 'qwen2.5:7b',
    provider: 'Ollama (Local)',
    contextWindow: '32K',
    latency: 'Fast',
    cost: 'Free',
    capabilities: ['Chat', 'Code', 'Multilingual'],
    enabled: true,
    isDefault: false,
  },
  {
    id: 'mistral',
    name: 'mistral',
    provider: 'Ollama (Local)',
    contextWindow: '32K',
    latency: 'Fast',
    cost: 'Free',
    capabilities: ['Chat', 'Reasoning'],
    enabled: true,
    isDefault: false,
  },
  {
    id: 'deepseek-r1',
    name: 'deepseek-r1',
    provider: 'Ollama (Local)',
    contextWindow: '64K',
    latency: 'Medium',
    cost: 'Free',
    capabilities: ['Reasoning', 'Code', 'Math'],
    enabled: true,
    isDefault: false,
  },
];

export const ModelsPage: React.FC = () => {
  const { setActiveProvider, updateAIConfig } = useAI();
  const [models, setModels] = useState<AIModel[]>(DEFAULT_MODELS);
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    provider: 'Ollama Custom',
    contextWindow: '8K',
    latency: 'Fast',
    cost: 'Free',
  });

  const fetchOllamaModels = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<{ success: boolean; data: any }>('/ai/models');
      const payload = res.data?.data || res.data || [];
      const modelList = Array.isArray(payload) ? payload : Array.isArray((payload as any).data) ? (payload as any).data : [];
      
      if (modelList.length > 0) {
        const mapped: AIModel[] = modelList.map((m: any, index: number) => ({
          id: m.id || m.name,
          name: m.name || m.id,
          provider: m.providerId || m.provider || 'Ollama',
          contextWindow: m.capabilities?.maxContextTokens ? `${Math.round(m.capabilities.maxContextTokens / 1024)}K` : '8K',
          latency: 'Fast',
          cost: m.costPer1kPromptTokens === 0 ? 'Free' : '$',
          capabilities: m.capabilities ? Object.keys(m.capabilities).filter(k => (m.capabilities as any)[k] === true) : ['Chat', 'Code'],
          enabled: true,
          isDefault: index === 0,
        }));
        setModels(mapped);
        setOllamaStatus('connected');
      } else {
        setOllamaStatus('disconnected');
      }
    } catch {
      setOllamaStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOllamaModels();
  }, []);

  const toggleEnabled = (id: string) => {
    setModels((prev) => prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)));
  };

  const setDefault = (id: string) => {
    setModels((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
    updateAIConfig({ modelOverrides: { local: id }, activeProvider: 'local' });
    setActiveProvider('local');
  };

  const handleDeployModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel.name.trim()) return;

    const created: AIModel = {
      id: newModel.name.trim(),
      name: newModel.name.trim(),
      provider: newModel.provider.trim() || 'Ollama',
      contextWindow: newModel.contextWindow,
      latency: newModel.latency,
      cost: newModel.cost,
      capabilities: ['Chat', 'Custom'],
      enabled: true,
      isDefault: false,
    };

    setModels((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewModel({
      name: '',
      provider: 'Ollama Custom',
      contextWindow: '8K',
      latency: 'Fast',
      cost: 'Free',
    });
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-500/20">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              AI Models (Ollama Default)
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage dynamic local Ollama models and server connections
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchOllamaModels}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Ollama Models
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Add Custom Model
          </button>
        </div>
      </div>

      {/* Ollama Status Notice */}
      {ollamaStatus === 'disconnected' && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <span className="font-bold">Ollama is not running locally.</span> Start your Ollama instance at <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">http://localhost:11434</code> to fetch dynamic models automatically. Showing supported default model catalog below.
          </div>
        </div>
      )}

      {/* Modal Dialog for Deploy Model */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Add Ollama Model
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleDeployModel} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Model Tag (e.g. codellama, gemma3)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. llama3.1:8b"
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Register Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Models List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-200">
            Detected / Supported Models
          </h2>
          <span className="rounded-full bg-slate-200/80 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {models.length} models total
          </span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {models.map((model) => (
            <div
              key={model.id}
              className={`flex flex-col gap-4 px-6 py-5 transition-colors sm:flex-row sm:items-center ${
                model.enabled
                  ? 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  : 'opacity-60 hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
              }`}
            >
              {/* Model Info */}
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {model.name}
                  </h3>
                  {model.isDefault && (
                    <span className="flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300">
                      <Star className="h-3 w-3 fill-current" />
                      Default
                    </span>
                  )}
                </div>
                <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {model.provider}
                </span>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Context:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{model.contextWindow}</span>
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  {model.latency}
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {model.cost}
                </span>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                {!model.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefault(model.id)}
                    className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    Set Default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => toggleEnabled(model.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    model.enabled
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20'
                      : 'border border-slate-300 bg-slate-100 text-slate-600 hover:text-slate-900 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Enabled
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ModelsPage;
