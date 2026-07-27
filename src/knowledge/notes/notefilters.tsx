// frontend/src/knowledge/notes/NoteFilters.tsx
import React from 'react';

interface NoteFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  selectedTag: string;
  setSelectedTag: (v: string) => void;
  availableTags: string[];
}

export const NoteFilters: React.FC<NoteFiltersProps> = ({
  search,
  setSearch,
  selectedTag,
  setSelectedTag,
  availableTags,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:flex-row">
      <input
        type="text"
        placeholder="Filter notes..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className="flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm text-white transition-colors focus:border-amber-500 focus:outline-none"
      />
      <select
        value={selectedTag}
        onChange={(e) => {
          setSelectedTag(e.target.value);
        }}
        className="min-w-[160px] rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm text-white transition-colors focus:border-amber-500 focus:outline-none"
      >
        <option value="">All Tags</option>
        {availableTags.map((tag) => (
          <option key={tag} value={tag}>
            #{tag}
          </option>
        ))}
      </select>
    </div>
  );
};
