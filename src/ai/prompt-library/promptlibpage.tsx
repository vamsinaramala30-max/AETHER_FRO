import React, { useState, useEffect } from 'react';
import { promptService, SystemPrompt } from './promptservice';
import { PromptCategories } from './promptcategories';
import { PromptCard } from './promptcard';
import { PromptEditor } from './prompteditor';

export const PromptLibraryPage: React.FC = () => {
  const [prompts, setPrompts] = useState<SystemPrompt[]>([]);
  const [category, setCategory] = useState('all');
  const [activeEditor, setActiveEditor] = useState<SystemPrompt | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncData = async () => {
      const data = await promptService.getPrompts();
      setPrompts(data);
      setLoading(false);
    };
    syncData();
  }, []);

  const handleSave = async (payload: SystemPrompt) => {
    const saved = await promptService.savePrompt(payload);
    const index = prompts.findIndex((p) => p.id === saved.id);
    if (index >= 0) {
      const updated = [...prompts];
      updated[index] = saved;
      setPrompts(updated);
    } else {
      setPrompts([saved, ...prompts]);
    }
    setActiveEditor(undefined);
  };

  const handleInject = (template: string) => {
    navigator.clipboard.writeText(template);
    alert(
      'System template structural configuration copied to internal system clipboard context buffer.',
    );
  };

  const filtered = prompts.filter((p) => category === 'all' || p.category === category);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Categories Workspace Side Panel */}
      <div className="w-64 shrink-0 border-r border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between px-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Context Library
          </h2>
          <button
            onClick={() => {
              setActiveEditor(null);
            }}
            className="cursor-pointer rounded bg-indigo-50 p-1 text-indigo-600 transition-all hover:opacity-80 dark:bg-indigo-950 dark:text-indigo-400"
            title="Create Prompt Matrix"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
        <PromptCategories active={category} onChange={setCategory} />
      </div>

      {/* Primary Display Workspace */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-800">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Structured System Blueprints
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Pre-engineered macro profiles injecting strict functional boundaries inside downstream
            completion scopes.
          </p>
        </div>

        {loading ? (
          <div className="grid animate-pulse grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs text-slate-400">
              No prompt templates mapping to current macro classifications.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filtered.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                onEdit={(item) => {
                  setActiveEditor(item);
                }}
                onSelect={handleInject}
              />
            ))}
          </div>
        )}
      </div>

      {activeEditor !== undefined && (
        <PromptEditor
          prompt={activeEditor}
          onSave={handleSave}
          onCancel={() => {
            setActiveEditor(undefined);
          }}
        />
      )}
    </div>
  );
};
export default PromptLibraryPage;
