import { projectsApi, ProjectDTO, CreateProjectPayload } from '../api';

export class ProjectService {
  public async listProjects(workspaceId: string): Promise<ProjectDTO[]> {
    return projectsApi.getAll(workspaceId);
  }

  public async getProject(id: string): Promise<ProjectDTO> {
    return projectsApi.getById(id);
  }

  public async createProject(payload: CreateProjectPayload): Promise<ProjectDTO> {
    return projectsApi.create(payload);
  }

  public async deleteProject(id: string): Promise<void> {
    return projectsApi.delete(id);
  }
}

export const projectService = new ProjectService();