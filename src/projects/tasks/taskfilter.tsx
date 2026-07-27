import React from 'react';
import { TaskFiltersState } from './taskService';

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onChange: (filters: TaskFiltersState) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onChange }) => {
  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'all' || val === 'high' || val === 'medium' || val === 'low') {
      onChange({ ...filters, priority: val });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        background: 'rgba(255,255,255,0.03)',
        padding: '1rem',
        borderRadius: '8px',
      }}
    >
      <input
        type="text"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => {
          onChange({ ...filters, search: e.target.value });
        }}
        style={{
          background: '#111',
          border: '1px solid #333',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          flex: '1',
          minWidth: '200px',
        }}
      />
      <select
        value={filters.priority}
        onChange={handlePriorityChange}
        style={{
          background: '#111',
          border: '1px solid #333',
          color: '#fff',
          padding: '0.5rem',
          borderRadius: '4px',
        }}
      >
        <option value="all">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <input
        type="text"
        placeholder="Filter by tag..."
        value={filters.tag}
        onChange={(e) => {
          onChange({ ...filters, tag: e.target.value });
        }}
        style={{
          background: '#111',
          border: '1px solid #333',
          color: '#fff',
          padding: '0.5rem',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};
