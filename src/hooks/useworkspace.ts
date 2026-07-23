import { useWorkspaceStore } from '../state/workspaceStore';

export const useWorkspace = () => {
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);
  const isLoading = useWorkspaceStore((s) => s.isLoading);
  const error = useWorkspaceStore((s) => s.error);
  const setCurrentWorkspace = useWorkspaceStore((s) => s.setCurrentWorkspace);

  return { workspaces, currentWorkspace, isLoading, error, setCurrentWorkspace };
};