import { create } from 'zustand';

export interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  lastRun?: string;
}

interface AutomationState {
  workflows: Workflow[];
  isLoading: boolean;
  error: string | null;

  setWorkflows: (workflows: Workflow[]) => void;
  addWorkflow: (workflow: Workflow) => void;
  toggleWorkflowStatus: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAutomationStore = create<AutomationState>()((set) => ({
  workflows: [],
  isLoading: false,
  error: null,

  setWorkflows: (workflows) => set({ workflows, isLoading: false }),
  addWorkflow: (workflow) => set((state) => ({ workflows: [workflow, ...state.workflows] })),
  toggleWorkflowStatus: (id) =>
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === id
          ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
          : w
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));