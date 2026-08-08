import React, { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Users, Plus, Search, UserCheck, Trash2 } from 'lucide-react';
import { useAuth } from '@/app/providers/authprovider';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  status: 'active' | 'pending';
  initials: string;
  color: string;
}

const ROLE_BADGES: Record<string, string> = {
  Owner:
    'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20',
  Admin:
    'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20',
  Member:
    'text-slate-700 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700',
};

const STORAGE_KEY = 'aether_workspace_invited_members';

const getInitials = (name?: string, email?: string): string => {
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

export const MembersPage: React.FC = () => {
  const { user } = useAuth();
  const [invitedMembers, setInvitedMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'Member'>('Member');

  // Build currentUser member entry dynamically from useAuth() session
  const currentUserMember: Member = {
    id: user?.id || 'usr_current',
    name: user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Active User'),
    email: user?.email || 'user@aether.os',
    role: 'Owner',
    status: 'active',
    initials: getInitials(user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : undefined), user?.email),
    color: 'from-indigo-600 to-purple-600',
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setInvitedMembers(parsed);
      }
    } catch {
      setInvitedMembers([]);
    }
  }, []);

  const allMembers = [currentUserMember, ...invitedMembers];

  const filteredMembers = allMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const emailName = newEmail.split('@')[0];
    const initials = emailName.substring(0, 2).toUpperCase();

    const newMember: Member = {
      id: `mem_${Date.now()}`,
      name: emailName,
      email: newEmail.trim(),
      role: newRole,
      status: 'pending',
      initials,
      color: 'from-blue-600 to-cyan-600',
    };

    const updated = [...invitedMembers, newMember];
    setInvitedMembers(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }

    setNewEmail('');
    setIsInviteOpen(false);
  };

  const handleRemoveMember = (id: string) => {
    const updated = invitedMembers.filter((m) => m.id !== id);
    setInvitedMembers(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }
  };

  return (
    <PageWrapper wide>
      {/* Header — Direct page header without full Workspace banner or sub-tabs */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Users className="h-7 w-7 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Team Members
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage organization members, assign roles, and control access permissions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      {/* Main Members Area */}
      <div className="mt-6 space-y-4">
        {/* Search & Stats Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <UserCheck className="h-4 w-4 text-indigo-500" />
            <span>{allMembers.length} active seat{allMembers.length === 1 ? '' : 's'}</span>
          </div>
        </div>

        {/* Members Table Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`h-10 w-10 rounded-full bg-gradient-to-tr ${m.color} flex shrink-0 items-center justify-center text-xs font-extrabold text-white shadow-sm`}
                    >
                      {m.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                        {m.name} {m.id === currentUserMember.id && '(You)'}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {m.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-bold ${ROLE_BADGES[m.role]}`}
                    >
                      {m.role}
                    </span>
                    {m.status === 'pending' && (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-400">
                        Pending
                      </span>
                    )}

                    {m.id !== currentUserMember.id && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m.id)}
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
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Invite Team Member
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Send an invitation link to join your workspace.
            </p>

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
                  onChange={(e) => setNewRole(e.target.value as 'Admin' | 'Member')}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-indigo-500"
                >
                  Send Invite
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
