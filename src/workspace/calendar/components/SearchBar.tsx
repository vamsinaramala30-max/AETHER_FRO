import React from 'react';
import { useSearch } from '../hooks/useSearch';
import { FilterPanel } from './FilterPanel';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flex: 1,
        maxWidth: '400px',
        margin: '0 16px',
      }}
    >
      <input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #dadce0',
          backgroundColor: '#f1f3f4',
        }}
      />
      <FilterPanel />
    </div>
  );
};
