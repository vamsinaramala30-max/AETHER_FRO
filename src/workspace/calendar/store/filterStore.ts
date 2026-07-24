import { create } from 'zustand';
import { SearchFilterOptions } from '../utils/searchUtils';

interface FilterState {
  filters: SearchFilterOptions;
  isFilterPanelOpen: boolean;
  
  // Actions
  setFilter: (key: keyof SearchFilterOptions, value: unknown) => void;
  resetFilters: () => void;
  toggleFilterPanel: () => void;
}

const initialFilters: SearchFilterOptions = {
  query: '',
  calendarIds: [],
  startDate: undefined,
  endDate: undefined,
  participantEmails: [],
  hasAttachments: false,
  hasLocation: false,
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: initialFilters,
  isFilterPanelOpen: false,

  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
  })),

  resetFilters: () => set({ filters: initialFilters }),

  toggleFilterPanel: () => set((state) => ({
    isFilterPanelOpen: !state.isFilterPanelOpen,
  })),
}));