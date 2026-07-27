import { workspaceApi, WorkspaceDTO } from '../api/Index';

export class WorkspaceService {
  public async getWorkspaces(): Promise<WorkspaceDTO[]> {
    return workspaceApi.getWorkspaces();
  }

  public async createWorkspace(name: string, slug: string): Promise<WorkspaceDTO> {
    return workspaceApi.createWorkspace({ name, slug });
  }
}

export const workspaceService = new WorkspaceService();
