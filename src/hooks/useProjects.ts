import { useCallback } from 'react';
import { useProjectStore, Project } from '../state/projectStore';

export const useProjects = () => {
  const projects = useProjectStore((s) => s.projects);
  const activeProject = useProjectStore((s) => s.activeProject);
  const isLoading = useProjectStore((s) => s.isLoading);
  const error = useProjectStore((s) => s.error);

  const addProject = useProjectStore((s) => s.addProject);
  const updateProject = useProjectStore((s) => s.updateProject);
  const removeProject = useProjectStore((s) => s.removeProject);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);

  const createProject = useCallback(
    (name: string, description: string) => {
      const newProj: Project = {
        id: crypto.randomUUID(),
        name,
        description,
        status: 'active',
        updatedAt: new Date().toISOString(),
      };
      addProject(newProj);
    },
    [addProject],
  );

  return {
    projects,
    activeProject,
    isLoading,
    error,
    createProject,
    updateProject,
    removeProject,
    setActiveProject,
  };
};
