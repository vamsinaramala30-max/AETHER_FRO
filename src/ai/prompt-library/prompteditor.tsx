import React, { useState } from 'react';
import { SystemPrompt } from './promptservice';

interface PromptEditorProps {
  prompt: SystemPrompt | null;
  onSave: (p: SystemPrompt) => void;
  onCancel: () => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({ prompt, onSave, onCancel }) => {
  const [title, setTitle] = useState(prompt?.title || '');
  const [description, setDescription] = useState(prompt?.description || '');
  const [template, setTemplate] = useState(prompt?.template || '');
  const [category, setCategory] = useState<SystemPrompt['category']>(
    prompt?.category || 'engineering',
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: prompt?.id || `p_${crypto.randomUUID()}`,
      title,
      description,
      template,
      category,
      tokensEstimate: Math.round(template.length / 4),
    });
  };

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {prompt ? 'Edit System Blueprint' : 'Construct System Blueprint'}
        </h2>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Description
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Category Mapping
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as SystemPrompt['category']);
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="engineering">Engineering</option>
              <option value="analysis">Analysis</option>
              <option value="creative">Creative</option>
              <option value="utility">Utility</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Instruction System Template
            </label>
            <textarea
              required
              rows={5}
              value={template}
              onChange={(e) => {
                setTemplate(e.target.value);
              }}
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="System constraints or macro variables here..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
          >
            Save Block
          </button>
        </div>
      </form>
    </div>
  );
};
