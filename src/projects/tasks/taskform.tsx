import React, { useState } from 'react';
import { Task } from './taskservice';
import { Plus, CheckSquare } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const hasDueDate = typeof dueDate === 'string' && dueDate.trim() !== '';
    onSubmit({
      title,
      description,
      status: 'todo',
      priority,
      dueDate: hasDueDate ? dueDate : undefined,
      tags,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setTagInput('');
    setIsOpen(false);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'high' || val === 'medium' || val === 'low') {
      setPriority(val);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50"
      >
        <Plus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        Create New Task
      </button>
    );
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <CheckSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          Create New Task
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
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />

      <textarea
        placeholder="Task description & acceptance criteria..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Priority
          </label>
          <select
            value={priority}
            onChange={handlePriorityChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Tags (comma separated)
          </label>
          <input
            type="text"
            placeholder="ui, core, api"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
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
          Save Task
        </button>
      </div>
    </form>
  );
};
