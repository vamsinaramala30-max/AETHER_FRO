import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface WorkspaceMemberDTO {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  createdAt: string;
  user: {
    id: string;
    email: string;
    fullName?: string | null;
    avatarUrl?: string | null;
    role: string;
  };
}

export interface WorkspaceDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  members?: WorkspaceMemberDTO[];
}

export const workspaceApi = {
  getWorkspaces: async (config?: RequestConfig): Promise<WorkspaceDTO[]> => {
    const res = await apiClient.get<any>(ENDPOINTS.WORKSPACE.BASE, config);
    return res?.data || res || [];
  },

  getWorkspaceById: async (id: string, config?: RequestConfig): Promise<WorkspaceDTO> => {
    const res = await apiClient.get<any>(ENDPOINTS.WORKSPACE.BY_ID(id), config);
    return res?.data || res;
  },

  createWorkspace: async (
    payload: { name: string; description?: string; slug?: string },
    config?: RequestConfig,
  ): Promise<WorkspaceDTO> => {
    const res = await apiClient.post<any>(ENDPOINTS.WORKSPACE.BASE, payload, config);
    return res?.data || res;
  },

  getMembers: async (workspaceId: string, config?: RequestConfig): Promise<WorkspaceMemberDTO[]> => {
    const res = await apiClient.get<any>(ENDPOINTS.WORKSPACE.MEMBERS(workspaceId), config);
    return res?.data || res || [];
  },

  addMember: async (
    workspaceId: string,
    payload: { email?: string; userId?: string; role?: string },
    config?: RequestConfig,
  ): Promise<WorkspaceMemberDTO> => {
    const res = await apiClient.post<any>(ENDPOINTS.WORKSPACE.MEMBERS(workspaceId), payload, config);
    return res?.data || res;
  },

  updateMemberRole: async (
    workspaceId: string,
    memberId: string,
    role: string,
    config?: RequestConfig,
  ): Promise<WorkspaceMemberDTO> => {
    const res = await apiClient.put<any>(
      `${ENDPOINTS.WORKSPACE.MEMBERS(workspaceId)}/${memberId}`,
      { role },
      config,
    );
    return res?.data || res;
  },

  removeMember: async (
    workspaceId: string,
    memberId: string,
    config?: RequestConfig,
  ): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.WORKSPACE.MEMBERS(workspaceId)}/${memberId}`, config);
  },

  leaveWorkspace: async (workspaceId: string, config?: RequestConfig): Promise<void> => {
    await apiClient.post(`${ENDPOINTS.WORKSPACE.BASE}/${workspaceId}/leave`, {}, config);
  },
};

