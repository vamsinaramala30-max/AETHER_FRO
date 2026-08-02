import React, { useState } from 'react';
import { Goal } from './goalservice';
import { Target, Plus } from 'lucide-react';

interface GoalFormProps {
  onSubmit: (goal: Omit<Goal, 'id' | 'progress'>) => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState<Goal['category']>('technical');
  const [metrics, setMetrics] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (title.trim() === '' || targetDate.trim() === '') return;
    onSubmit({ title, description, targetDate, category, metrics });
    setTitle('');
    setDescription('');
    setTargetDate('');
    setMetrics('');
    setIsOpen(false);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'technical' || val === 'career' || val === 'personal') {
      setCategory(val);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50"
      >
        <Plus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        Establish New Milestone Goal
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          Establish New Goal
        </h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          Cancel
        </button>
      </div>

      <input
        type="text"
        placeholder="Goal Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />

      <textarea
        placeholder="Strategic path description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />

      <input
        type="text"
        placeholder="Quantifiable success criteria / key metrics..."
        value={metrics}
        onChange={(e) => setMetrics(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select
          value={category}
          onChange={handleCategoryChange}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="technical">Technical Architecture</option>
          <option value="career">Career / Growth</option>
          <option value="personal">Personal Objective</option>
        </select>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-500/20"
        >
          Save Goal
        </button>
      </div>
    </form>
  );
};
