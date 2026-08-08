import React from 'react';
import { useFilterStore } from '../store/filterStore';
import { X, Filter, RotateCcw } from 'lucide-react';

export const FilterPanel: React.FC = () => {
  const { isFilterPanelOpen, toggleFilterPanel, filters, setFilter, resetFilters } =
    useFilterStore();

  if (!isFilterPanelOpen) return null;

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-indigo-500" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Calendar Filters</h4>
        </div>
        <button
          type="button"
          onClick={toggleFilterPanel}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {/* Query */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Search Query
          </label>
          <input
            type="text"
            placeholder="Event title or keyword..."
            value={filters.query || ''}
            onChange={(e) => setFilter('query', e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Start & End Date */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => setFilter('startDate', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => setFilter('endDate', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2 pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={filters.hasAttachments === true}
              onChange={(e) => setFilter('hasAttachments', e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Has attachments
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={filters.hasLocation === true}
              onChange={(e) => setFilter('hasLocation', e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Has location
          </label>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All Filters
        </button>
      </div>
    </div>
  );
};
