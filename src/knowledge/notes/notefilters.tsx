// frontend/src/knowledge/notes/NoteFilters.tsx
import React from 'react';

interface NoteFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  selectedTag: string;
  setSelectedTag: (v: string) => void;
  availableTags: string[];
}

export const NoteFilters: React.FC<NoteFiltersProps> = ({ search, setSearch, selectedTag, setSelectedTag, availableTags }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-neutral-900 p-4 rounded-xl border border-neutral-800">
      <input
        type="text"
        placeholder="Filter notes..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); }}
        className="bg-neutral-950 text-white border border-neutral-800 px-4 py-2 rounded-lg flex-1 focus:outline-none focus:border-amber-500 transition-colors text-sm"
      />
      <select
        value={selectedTag}
        onChange={(e) => { setSelectedTag(e.target.value); }}
        className="bg-neutral-950 text-white border border-neutral-800 px-4 py-2 rounded-lg focus:outline-none focus:border-amber-500 transition-colors text-sm min-w-[160px]"
      >
        <option value="">All Tags</option>
        {availableTags.map((tag) => (
          <option key={tag} value={tag}>#{tag}</option>
        ))}
      </select>
    </div>
  );
};