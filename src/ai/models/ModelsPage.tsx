import React from 'react';
import { Cpu, Zap, Eye, Star, CheckCircle, Plus, X, Sparkles } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

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

const MODELS: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    contextWindow: '128K',
    latency: 'Fast',
    cost: '$$',
    capabilities: ['Chat', 'Vision', 'Function Calling', 'JSON Mode'],
    enabled: true,
    isDefault: true,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    contextWindow: '200K',
    latency: 'Fast',
    cost: '$$',
    capabilities: ['Chat', 'Vision', 'Code', 'Long Context'],
    enabled: true,
    isDefault: false,
  },
  {
    id: 'gemini-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    contextWindow: '1M',
    latency: 'Medium',
    cost: '$',
    capabilities: ['Chat', 'Vision', 'Audio', 'Long Context'],
    enabled: true,
    isDefault: false,
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta (Open Source)',
    contextWindow: '128K',
    latency: 'Variable',
    cost: 'Free',
    capabilities: ['Chat', 'Code', 'Function Calling'],
    enabled: false,
    isDefault: false,
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    contextWindow: '128K',
    latency: 'Fast',
    cost: '$',
    capabilities: ['Chat', 'Code', 'Multilingual'],
    enabled: false,
    isDefault: false,
  },
];

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI:
    'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20',
  Anthropic:
    'text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500/20',
  Google:
    'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20',
  'Meta (Open Source)':
    'text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20',
  'Mistral AI':
    'text-cyan-700 bg-cyan-50 border-cyan-200 dark:text-cyan-400 dark:bg-cyan-500/10 dark:border-cyan-500/20',
};

export const ModelsPage: React.FC = () => {
  const [models, setModels] = React.useState(MODELS);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newModel, setNewModel] = React.useState({
    name: '',
    provider: 'Custom Endpoint',
    contextWindow: '128K',
    latency: 'Fast',
    cost: '$$',
  });

  const toggleEnabled = (id: string) => {
    setModels((prev) => prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)));
  };

  const setDefault = (id: string) => {
    setModels((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  };

  const handleDeployModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel.name.trim()) return;

    const created: AIModel = {
      id: `model-${Date.now()}`,
      name: newModel.name.trim(),
      provider: newModel.provider.trim() || 'Custom',
      contextWindow: newModel.contextWindow,
      latency: newModel.latency,
      cost: newModel.cost,
      capabilities: ['Chat', 'Fine-Tuned', 'API'],
      enabled: true,
      isDefault: false,
    };

    setModels((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewModel({
      name: '',
      provider: 'Custom Endpoint',
      contextWindow: '128K',
      latency: 'Fast',
      cost: '$$',
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
              Models
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configure AI providers, parameters, and model preferences
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          Deploy Custom Model
        </button>
      </div>

      {/* Modal Dialog for Deploy Model */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Deploy Custom Model Endpoint
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
                  Model Identifier / Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DeepSeek-R1-671B"
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Provider / Server Location
                </label>
                <input
                  type="text"
                  placeholder="OpenRouter / Local vLLM / Ollama"
                  value={newModel.provider}
                  onChange={(e) => setNewModel({ ...newModel, provider: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Context Window
                  </label>
                  <input
                    type="text"
                    placeholder="128K"
                    value={newModel.contextWindow}
                    onChange={(e) => setNewModel({ ...newModel, contextWindow: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Latency Profile
                  </label>
                  <select
                    value={newModel.latency}
                    onChange={(e) => setNewModel({ ...newModel, latency: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                  >
                    <option value="Ultra Fast">Ultra Fast</option>
                    <option value="Fast">Fast</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
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
                  Register & Deploy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Models Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-200">
            Available AI Models
          </h2>
          <span className="rounded-full bg-slate-200/80 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {models.filter((m) => m.enabled).length} of {models.length} active
          </span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {models.map((model) => {
            const providerStyle =
              PROVIDER_COLORS[model.provider] ||
              'text-slate-700 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700';
            return (
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
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${providerStyle}`}
                  >
                    {model.provider}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                      Context:
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {model.contextWindow}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    {model.latency}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {model.cost}
                  </span>
                </div>

                {/* Capabilities */}
                <div className="hidden max-w-xs flex-wrap gap-1.5 lg:flex">
                  {model.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="rounded-md border border-slate-200 bg-slate-100/70 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300"
                    >
                      {cap}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  {!model.isDefault && model.enabled && (
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
                    {model.enabled ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Enabled
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Enable
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ModelsPage;
