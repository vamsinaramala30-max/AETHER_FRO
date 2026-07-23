import React, { useState, useEffect } from 'react';
import { promptService, SystemPrompt } from './promptService';
import { PromptCategories } from './PromptCategories';
import { PromptCard } from './PromptCard';
import { PromptEditor } from './PromptEditor';

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
    const index = prompts.findIndex(p => p.id === saved.id);
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
    alert('System template structural configuration copied to internal system clipboard context buffer.');
  };

  const filtered = prompts.filter(p => category === 'all' || p.category === category);

  return (
    <div className="flex w-full h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Categories Workspace Side Panel */}
      <div className="w-64 border-r border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 shrink-0">
        <div className="mb-6 px-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Context Library</h2>
          <button
            onClick={() => { setActiveEditor(null); }}
            className="p-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-all cursor-pointer"
            title="Create Prompt Matrix"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <PromptCategories active={category} onChange={setCategory} />
      </div>

      {/* Primary Display Workspace */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">Structured System Blueprints</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pre-engineered macro profiles injecting strict functional boundaries inside downstream completion scopes.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-pulse">
            <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400">No prompt templates mapping to current macro classifications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(p => (
              <PromptCard key={p.id} prompt={p} onEdit={(item) => { setActiveEditor(item); }} onSelect={handleInject} />
            ))}
          </div>
        )}
      </div>

      {activeEditor !== undefined && (
        <PromptEditor 
          prompt={activeEditor} 
          onSave={handleSave} 
          onCancel={() => { setActiveEditor(undefined); }} 
        />
      )}
    </div>
  );
};
export default PromptLibraryPage;