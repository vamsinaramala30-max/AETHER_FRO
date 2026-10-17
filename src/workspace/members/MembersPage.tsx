import React, { useState, useEffect, useCallback } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Users, Plus, Search, UserCheck, Trash2, Shield, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/app/providers/authprovider';
import { workspaceService } from '@/services/workspaceService';
import { WorkspaceMemberDTO } from '@/api/workspace.api';
import { useWorkspaceStore } from '@/state/workspaceStore';
import { useRealtimeEvent } from '@/hooks/useSocket';

export interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  status: 'active' | 'pending';
  initials: string;
  color: string;
}

const ROLE_BADGES: Record<string, string> = {
  OWNER:
    'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20',
  ADMIN:
    'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20',
  MEMBER:
    'text-slate-700 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700',
  VIEWER:
    'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-800/40 dark:border-gray-700',
};

const getInitials = (name?: string | null, email?: string | null): string => {
  if (name && name.trim()) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    return email.substring(0, 2).toUpperCase();
  }
  return 'US';
};

const COLORS = [
  'from-indigo-600 to-purple-600',
  'from-blue-600 to-cyan-600',
  'from-emerald-600 to-teal-600',
  'from-amber-600 to-orange-600',
  'from-rose-600 to-pink-600',
];

export const MembersPage: React.FC = () => {
  const { user } = useAuth();
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'MEMBER' | 'VIEWER'>('MEMBER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeWorkspaceId = currentWorkspace?.id || user?.workspaceId || '';

  const mapDtoToMember = useCallback(
    (dto: WorkspaceMemberDTO, index: number): Member => {
      const u = dto.user || ({} as any);
      return {
        id: dto.id,
        userId: dto.userId || u.id,
        name: u.fullName || u.email?.split('@')[0] || 'Workspace Member',
        email: u.email || '',
        role: dto.role,
        status: 'active',
        initials: getInitials(u.fullName, u.email),
        color: COLORS[index % COLORS.length],
      };
    },
    [],
  );

  const loadMembers = useCallback(async () => {
    if (!activeWorkspaceId) {
      try {
        const wsList = await workspaceService.getWorkspaces();
        if (wsList && wsList.length > 0) {
          setCurrentWorkspace({
            id: wsList[0].id,
            name: wsList[0].name,
            slug: wsList[0].slug,
            membersCount: wsList[0].members?.length || 1,
          });
          return;
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to resolve workspace.');
        setIsLoading(false);
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await workspaceService.getMembers(activeWorkspaceId);
      setMembers(data.map((m, idx) => mapDtoToMember(m, idx)));
    } catch (err: any) {
      console.error('Failed to load workspace members:', err);
      setError(err?.message || 'Could not load members from server.');
    } finally {
      setIsLoading(false);
    }
  }, [activeWorkspaceId, mapDtoToMember, setCurrentWorkspace]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // Real-time synchronization
  useRealtimeEvent('workspace:member_added', () => {
    loadMembers();
  });
  useRealtimeEvent('workspace:member_updated', () => {
    loadMembers();
  });
  useRealtimeEvent('workspace:member_removed', () => {
    loadMembers();
  });
  useRealtimeEvent('workspace:member_mutated', () => {
    loadMembers();
  });

  const currentUserMembership = members.find((m) => m.userId === user?.id);
  const isCurrentUserOwner =
    currentUserMembership?.role === 'OWNER' || (user as any)?.role === 'OWNER';

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !activeWorkspaceId) return;

    try {
      setIsSubmitting(true);
      setActionError(null);
      await workspaceService.addMember(activeWorkspaceId, {
        email: newEmail.trim(),
        role: newRole,
      });
      setNewEmail('');
      setIsInviteOpen(false);
      await loadMembers();
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || err?.message || 'Failed to add member.';
      setActionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (memberUserId: string, newRoleVal: string) => {
    if (!activeWorkspaceId) return;
    try {
      setActionError(null);
      await workspaceService.updateMemberRole(activeWorkspaceId, memberUserId, newRoleVal);
      await loadMembers();
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || err?.message || 'Failed to update role.';
      setActionError(msg);
    }
  };

  const handleRemoveMember = async (memberUserId: string) => {
    if (!activeWorkspaceId) return;
    try {
      setActionError(null);
      await workspaceService.removeMember(activeWorkspaceId, memberUserId);
      await loadMembers();
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || err?.message || 'Failed to remove member.';
      setActionError(msg);
    }
  };

  return (
    <PageWrapper wide>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Users className="h-7 w-7 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Team Members
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage organization members, assign roles, and control access permissions.
            </p>
          </div>
        </div>

        {isCurrentUserOwner && (
          <button
            type="button"
            onClick={() => {
              setActionError(null);
              setIsInviteOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Invite Member
          </button>
        )}
      </div>

      {actionError && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Members Area */}
      <div className="mt-6 space-y-4">
        {/* Search & Stats Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <UserCheck className="h-4 w-4 text-indigo-500" />
            <span>
              {members.length} active seat{members.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Members Table Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {isLoading ? (
            <div className="flex items-center justify-center p-12 text-sm text-slate-500 dark:text-slate-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-indigo-500" />
              Loading verified workspace members...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-sm text-red-500">{error}</div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredMembers.length === 0 ? (
                <div className="p-12 text-center text-sm text-slate-500 dark:text-slate-400">
                  No members found matching "{search}"
                </div>
              ) : (
                filteredMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      <div
                        className={`h-10 w-10 rounded-full bg-gradient-to-tr ${m.color} flex shrink-0 items-center justify-center text-xs font-extrabold text-white shadow-sm`}
                      >
                        {m.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                          {m.name} {m.userId === user?.id && '(You)'}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {m.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isCurrentUserOwner && m.userId !== user?.id && m.role !== 'OWNER' ? (
                        <select
                          value={m.role}
                          onChange={(e) => handleRoleChange(m.userId, e.target.value)}
                          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="MEMBER">MEMBER</option>
                          <option value="VIEWER">VIEWER</option>
                        </select>
                      ) : (
                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-bold ${
                            ROLE_BADGES[m.role] || ROLE_BADGES.MEMBER
                          }`}
                        >
                          {m.role}
                        </span>
                      )}

                      {isCurrentUserOwner && m.userId !== user?.id && m.role !== 'OWNER' && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(m.userId)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 dark:hover:text-red-400"
                          title="Remove member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setIsInviteOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Invite Team Member
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Add a registered user to your workspace with specific role permissions.
            </p>

            {actionError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleInvite} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="colleague@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) =>
                    setNewRole(e.target.value as 'ADMIN' | 'MEMBER' | 'VIEWER')
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="MEMBER">Member (Standard Access)</option>
                  <option value="ADMIN">Admin (Team & Workspace Management)</option>
                  <option value="VIEWER">Viewer (Read-only Access)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Add to Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default MembersPage;
