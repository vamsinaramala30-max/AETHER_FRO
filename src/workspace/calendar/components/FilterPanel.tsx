import React from 'react';
import { useFilterStore } from '../store/filterStore';

export const FilterPanel: React.FC = () => {
  const { isFilterPanelOpen, toggleFilterPanel, filters, setFilter, resetFilters } = useFilterStore();

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={toggleFilterPanel}
        style={{ padding: '6px 12px', border: '1px solid #dadce0', borderRadius: '4px', cursor: 'pointer' }}
      >
        Filters
      </button>

      {isFilterPanelOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            width: '240px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            padding: '12px',
            zIndex: 100,
            marginTop: '4px',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0' }}>Filter Options</h4>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '8px' }}>
            <input
              type="checkbox"
              checked={filters.hasAttachments || false}
              onChange={(e) => setFilter('hasAttachments', e.target.checked)}
            />
            Has attachments
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '8px' }}>
            <input
              type="checkbox"
              checked={filters.hasLocation || false}
              onChange={(e) => setFilter('hasLocation', e.target.checked)}
            />
            Has location
          </label>

          <button
            type="button"
            onClick={resetFilters}
            style={{ width: '100%', padding: '4px', fontSize: '12px', cursor: 'pointer' }}
          >
            Reset All
          </button>
        </div>
      )}
    </div>
  );
};