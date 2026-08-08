import React, { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
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
    <PageWrapper wide>
      <div className="flex w-full flex-col md:flex-row overflow-hidden rounded-2xl border border-aether-border bg-aether-surface">
      {/* Categories Workspace Side Panel */}
      <div className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between px-1 md:px-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Context Library
          </h2>
          <button
            onClick={() => {
              setActiveEditor(null);
            }}
            className="cursor-pointer rounded bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 transition-all hover:opacity-80 dark:bg-indigo-950 dark:text-indigo-400 flex items-center gap-1"
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
            <span className="inline md:hidden">New</span>
          </button>
        </div>
        <div className="overflow-x-auto pb-2 md:pb-0">
          <PromptCategories active={category} onChange={setCategory} />
        </div>
      </div>

      {/* Primary Display Workspace */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Structured System Blueprints
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Pre-engineered macro profiles injecting strict functional boundaries inside downstream completion scopes.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveEditor(null);
            }}
            className="hidden sm:flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
          >
            + Create Blueprint
          </button>
        </div>

        {loading ? (
          <div className="grid animate-pulse grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
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
    </PageWrapper>
  );
};
export default PromptLibraryPage;
