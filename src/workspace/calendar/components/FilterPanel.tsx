import React from 'react';
import { useFilterStore } from '../store/filterStore';

export const FilterPanel: React.FC = () => {
  const { isFilterPanelOpen, toggleFilterPanel, filters, setFilter, resetFilters } =
    useFilterStore();

  if (!isFilterPanelOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        width: '320px',
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
        borderRadius: '12px',
        padding: '16px',
        zIndex: 100,
        marginTop: '8px',
        color: '#f8fafc',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Calendar Filters</h4>
        <button
          onClick={toggleFilterPanel}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              color: '#94a3b8',
              marginBottom: '4px',
            }}
          >
            Search Query
          </label>
          <input
            type="text"
            placeholder="Event title or keyword..."
            value={filters.query || ''}
            onChange={(e) => setFilter('query', e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '6px 10px',
              color: '#ffffff',
              fontSize: '12px',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                color: '#94a3b8',
                marginBottom: '4px',
              }}
            >
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => setFilter('startDate', e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '6px 8px',
                color: '#ffffff',
                fontSize: '11px',
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                color: '#94a3b8',
                marginBottom: '4px',
              }}
            >
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => setFilter('endDate', e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '6px 8px',
                color: '#ffffff',
                fontSize: '11px',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={filters.hasAttachments === true}
              onChange={(e) => setFilter('hasAttachments', e.target.checked)}
            />
            Has attachments
          </label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={filters.hasLocation === true}
              onChange={(e) => setFilter('hasLocation', e.target.checked)}
            />
            Has location
          </label>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '8px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#f8fafc',
            cursor: 'pointer',
          }}
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};
