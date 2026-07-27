import { create } from 'zustand';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  membersCount: number;
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;

  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,

  setWorkspaces: (workspaces) => {
    set({ workspaces, isLoading: false });
  },
  setCurrentWorkspace: (currentWorkspace) => {
    set({ currentWorkspace });
  },
  setLoading: (isLoading) => {
    set({ isLoading });
  },
  setError: (error) => {
    set({ error, isLoading: false });
  },
}));
