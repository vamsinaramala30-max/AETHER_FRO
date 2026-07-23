import React, { useState } from 'react';
import { SystemPrompt } from './promptService';

interface PromptEditorProps {
  prompt: SystemPrompt | null;
  onSave: (p: SystemPrompt) => void;
  onCancel: () => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({ prompt, onSave, onCancel }) => {
  const [title, setTitle] = useState(prompt?.title || '');
  const [description, setDescription] = useState(prompt?.description || '');
  const [template, setTemplate] = useState(prompt?.template || '');
  const [category, setCategory] = useState<SystemPrompt['category']>(prompt?.category || 'engineering');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: prompt?.id || `p_${crypto.randomUUID()}`,
      title,
      description,
      template,
      category,
      tokensEstimate: Math.round(template.length / 4)
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {prompt ? 'Edit System Blueprint' : 'Construct System Blueprint'}
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Title</label>
            <input 
              type="text" required value={title} onChange={e => { setTitle(e.target.value); }}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Description</label>
            <input 
              type="text" required value={description} onChange={e => { setDescription(e.target.value); }}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Category Mapping</label>
            <select 
              value={category} onChange={e => { setCategory(e.target.value as SystemPrompt['category']); }}
              className="w-full text-xs px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="engineering">Engineering</option>
              <option value="analysis">Analysis</option>
              <option value="creative">Creative</option>
              <option value="utility">Utility</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Instruction System Template</label>
            <textarea 
              required rows={5} value={template} onChange={e => { setTemplate(e.target.value); }}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-mono resize-none"
              placeholder="System constraints or macro variables here..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2">
          <button 
            type="button" onClick={onCancel}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium cursor-pointer"
          >
            Save Block
          </button>
        </div>
      </form>
    </div>
  );
};