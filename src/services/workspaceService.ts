import { workspaceApi, WorkspaceDTO, WorkspaceMemberDTO } from '../api/workspace.api';

export class WorkspaceService {
  public async getWorkspaces(): Promise<WorkspaceDTO[]> {
    return workspaceApi.getWorkspaces();
  }

  public async getWorkspaceById(id: string): Promise<WorkspaceDTO> {
    return workspaceApi.getWorkspaceById(id);
  }

  public async createWorkspace(name: string, description?: string, slug?: string): Promise<WorkspaceDTO> {
    return workspaceApi.createWorkspace({ name, description, slug });
  }

  public async getMembers(workspaceId: string): Promise<WorkspaceMemberDTO[]> {
    return workspaceApi.getMembers(workspaceId);
  }

  public async addMember(
    workspaceId: string,
    payload: { email?: string; userId?: string; role?: string },
  ): Promise<WorkspaceMemberDTO> {
    return workspaceApi.addMember(workspaceId, payload);
  }

  public async updateMemberRole(
    workspaceId: string,
    memberId: string,
    role: string,
  ): Promise<WorkspaceMemberDTO> {
    return workspaceApi.updateMemberRole(workspaceId, memberId, role);
  }

  public async removeMember(workspaceId: string, memberId: string): Promise<void> {
    return workspaceApi.removeMember(workspaceId, memberId);
  }

  public async leaveWorkspace(workspaceId: string): Promise<void> {
    return workspaceApi.leaveWorkspace(workspaceId);
  }
}

export const workspaceService = new WorkspaceService();

