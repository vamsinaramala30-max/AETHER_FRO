import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminApi,
  AdminOverviewMetrics,
  AdminUserListItem,
  AdminAuditLogsResponse,
  AdminDatabaseStatus,
} from '../api/admin.api';
import { authConfig } from '../config/auth.config';
import { AetherSymbol } from '@/components/branding/AetherLogo';
import {
  Shield,
  Users,
  Database,
  Activity,
  Search,
  RefreshCw,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  Key,
  UserCheck,
  UserX,
  Server,
  Layers,
  FileText,
  Clock,
  Eye,
  X,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'security' | 'database'>('overview');
  const [overview, setOverview] = useState<AdminOverviewMetrics | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Users Tab State
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersRoleFilter, setUsersRoleFilter] = useState('ALL');
  const [usersStatusFilter, setUsersStatusFilter] = useState('ALL');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Audit Tab State
  const [auditLogs, setAuditLogs] = useState<AdminAuditLogsResponse['logs']>([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditPage, setAuditPage] = useState(1);
  const [auditActionFilter, setAuditActionFilter] = useState('');
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [selectedAuditLog, setSelectedAuditLog] = useState<any | null>(null);

  // Database Tab State
  const [dbStatus, setDbStatus] = useState<AdminDatabaseStatus | null>(null);
  const [loadingDb, setLoadingDb] = useState(false);
  const [backupTriggerMessage, setBackupTriggerMessage] = useState<string | null>(null);

  // User Actions Modal State
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);
  const [modalAction, setModalAction] = useState<'role' | 'status' | 'revoke' | 'export' | null>(null);
  const [newRole, setNewRole] = useState('USER');
  const [actionLoading, setActionLoading] = useState(false);
  const [exportedData, setExportedData] = useState<any | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const navigate = useNavigate();

  // Current logged in admin info
  const [currentAdmin, setCurrentAdmin] = useState<{ id: string; email: string; role: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('aether_auth_user');
      if (raw) {
        const u = JSON.parse(raw);
        setCurrentAdmin(u);
      }
    } catch {
      // ignore
    }
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const fetchOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const data = await adminApi.getOverview();
      setOverview(data);
    } catch (err: any) {
      showNotification('error', 'Failed to load administrative overview metrics.');
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const data = await adminApi.getUsers({
        page: usersPage,
        limit: 15,
        search: usersSearch,
        role: usersRoleFilter,
        status: usersStatusFilter,
      });
      setUsers(data.users);
      setUsersTotal(data.total);
    } catch (err: any) {
      showNotification('error', 'Failed to load system users.');
    } finally {
      setLoadingUsers(false);
    }
  }, [usersPage, usersSearch, usersRoleFilter, usersStatusFilter]);

  const fetchAuditLogs = useCallback(async () => {
    setLoadingAudit(true);
    try {
      const data = await adminApi.getAuditLogs({
        page: auditPage,
        limit: 25,
        action: auditActionFilter,
      });
      setAuditLogs(data.logs);
      setAuditTotal(data.total);
    } catch (err: any) {
      showNotification('error', 'Failed to retrieve audit log trail.');
    } finally {
      setLoadingAudit(false);
    }
  }, [auditPage, auditActionFilter]);

  const fetchDbStatus = useCallback(async () => {
    setLoadingDb(true);
    try {
      const data = await adminApi.getDatabaseStatus();
      setDbStatus(data);
    } catch (err: any) {
      showNotification('error', 'Failed to retrieve database status.');
    } finally {
      setLoadingDb(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'overview') fetchOverview();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'security') fetchAuditLogs();
    if (activeTab === 'database') fetchDbStatus();
  }, [activeTab, fetchOverview, fetchUsers, fetchAuditLogs, fetchDbStatus]);

  const handleAdminLogout = async () => {
    try {
      await adminApi.logout();
    } catch {
      // ignore logout network errors
    } finally {
      localStorage.removeItem(authConfig.tokenKey);
      localStorage.removeItem('aether-auth-token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem(authConfig.refreshTokenKey);
      localStorage.removeItem('aether_auth_user');
      window.dispatchEvent(new CustomEvent('aether-auth-updated'));
      navigate('/admin/login', { replace: true });
    }
  };

  // User Actions Handlers
  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await adminApi.updateUserRole(selectedUser.id, newRole);
      showNotification('success', `Updated ${selectedUser.email} role to ${newRole}.`);
      setModalAction(null);
      fetchUsers();
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || err?.message || 'Failed to update user role.';
      showNotification('error', msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    const nextStatus = selectedUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await adminApi.updateUserStatus(selectedUser.id, nextStatus);
      showNotification(
        'success',
        `${selectedUser.email} has been ${nextStatus === 'SUSPENDED' ? 'suspended' : 'reinstated'}.`,
      );
      setModalAction(null);
      fetchUsers();
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || err?.message || 'Failed to update user status.';
      showNotification('error', msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeSessions = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const res = await adminApi.revokeSessions(selectedUser.id);
      showNotification('success', `Revoked ${res.revokedCount} active session(s) for ${selectedUser.email}.`);
      setModalAction(null);
    } catch (err: any) {
      showNotification('error', 'Failed to revoke user sessions.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportData = async (user: AdminUserListItem) => {
    setSelectedUser(user);
    setActionLoading(true);
    try {
      const data = await adminApi.exportUserData(user.id);
      setExportedData(data);
      setModalAction('export');
    } catch (err: any) {
      showNotification('error', 'Failed to export user profile data.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTriggerBackup = async () => {
    setLoadingDb(true);
    try {
      const res = await adminApi.triggerBackup();
      setBackupTriggerMessage(res.message);
      showNotification('success', res.message);
      fetchDbStatus();
    } catch (err: any) {
      showNotification('error', 'Failed to initiate database backup operation.');
    } finally {
      setLoadingDb(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 shadow">
              <AetherSymbol size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white">AETHER</span>
                <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-400 border border-cyan-800/50">
                  Private Admin
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentAdmin && (
              <div className="hidden text-right sm:block">
                <p className="text-xs font-medium text-slate-200">{currentAdmin.email}</p>
                <p className="text-[10px] font-mono text-cyan-400">{currentAdmin.role}</p>
              </div>
            )}

            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-red-900/50 hover:bg-red-950/30 hover:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto flex max-w-7xl border-t border-slate-800/40 px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 border-b-2 py-3 text-xs font-semibold tracking-wider transition-colors uppercase ${
                activeTab === 'overview'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 border-b-2 py-3 text-xs font-semibold tracking-wider transition-colors uppercase ${
                activeTab === 'users'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Users</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 border-b-2 py-3 text-xs font-semibold tracking-wider transition-colors uppercase ${
                activeTab === 'security'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Audit & Security</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2 border-b-2 py-3 text-xs font-semibold tracking-wider transition-colors uppercase ${
                activeTab === 'database'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Database & Recovery</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Toast Feedback */}
        {feedbackMessage && (
          <div
            className={`mb-6 flex items-center justify-between rounded-lg p-3 text-xs font-medium ${
              feedbackMessage.type === 'success'
                ? 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
                : 'border border-red-500/30 bg-red-950/40 text-red-300'
            }`}
          >
            <span>{feedbackMessage.text}</span>
            <button onClick={() => setFeedbackMessage(null)} className="text-slate-400 hover:text-slate-200">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* ── 1. TAB: OVERVIEW ──────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">System Status & Telemetry</h2>
                <p className="text-xs text-slate-400">Live operational snapshot of AETHER infrastructure</p>
              </div>
              <button
                onClick={fetchOverview}
                disabled={loadingOverview}
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingOverview ? 'animate-spin text-cyan-400' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {loadingOverview && !overview ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
              </div>
            ) : overview ? (
              <>
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs font-medium text-slate-400">Total Users</p>
                    <p className="mt-1 text-2xl font-bold text-white">{overview.users.total}</p>
                    <p className="mt-1 text-[11px] text-emerald-400">{overview.users.active} active</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs font-medium text-slate-400">Administrators</p>
                    <p className="mt-1 text-2xl font-bold text-cyan-400">{overview.users.admins}</p>
                    <p className="mt-1 text-[11px] text-slate-400">Privileged accounts</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs font-medium text-slate-400">Suspended Users</p>
                    <p className="mt-1 text-2xl font-bold text-rose-400">{overview.users.suspended}</p>
                    <p className="mt-1 text-[11px] text-slate-400">Access disabled</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs font-medium text-slate-400">MFA Protected</p>
                    <p className="mt-1 text-2xl font-bold text-indigo-400">{overview.users.twoFactorEnabled}</p>
                    <p className="mt-1 text-[11px] text-slate-400">2FA enrolled</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs font-medium text-slate-400">Database Latency</p>
                    <p className="mt-1 text-2xl font-bold text-white">
                      {overview.services.database.latencyMs !== undefined ? `${overview.services.database.latencyMs}ms` : '—'}
                    </p>
                    <p className="mt-1 text-[11px] text-emerald-400">{overview.services.database.status.toUpperCase()}</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs font-medium text-slate-400">Node Uptime</p>
                    <p className="mt-1 text-xl font-bold text-white">
                      {Math.floor(overview.system.uptimeSeconds / 3600)}h {Math.floor((overview.system.uptimeSeconds % 3600) / 60)}m
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">{overview.system.nodeVersion}</p>
                  </div>
                </div>

                {/* Service Health Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">PostgreSQL Engine</span>
                      {overview.services.database.status === 'up' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-400" />
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-400 truncate">{overview.services.database.version}</p>
                    <span className="mt-2 inline-block rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                      {overview.services.database.provider}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">Redis Cache</span>
                      {overview.services.redis.status === 'up' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-400">Session cache & rate limit store</p>
                    <span className="mt-2 inline-block rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                      Status: {overview.services.redis.status}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">AI Model Daemon</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="mt-2 text-xs text-slate-400 truncate">{overview.services.aiModel.endpoint}</p>
                    <span className="mt-2 inline-block rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                      Local GGUF / llama.cpp
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">Storage Driver</span>
                      {overview.services.storage.status === 'ready' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-400">Driver: {overview.services.storage.driver}</p>
                    <span className="mt-2 inline-block rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                      Status: {overview.services.storage.status}
                    </span>
                  </div>
                </div>

                {/* Backup Verification Banner */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <HardDriveIcon className="h-4 w-4 text-cyan-400" />
                        <h3 className="text-sm font-semibold text-white">Database Backup & Recovery Reality</h3>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-300 leading-relaxed max-w-3xl">
                        {overview.backups.details}
                      </p>
                      <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400">
                        <span>
                          Evidence Verified:{' '}
                          <strong className={overview.backups.evidenceFound ? 'text-emerald-400' : 'text-amber-400'}>
                            {overview.backups.evidenceFound ? 'CONFIRMED ON DISK' : 'MOCK / UNVERIFIED'}
                          </strong>
                        </span>
                        {overview.backups.lastBackupTimestamp && (
                          <span>Last Snapshot: {new Date(overview.backups.lastBackupTimestamp).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('database')}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
                    >
                      Inspect Database
                    </button>
                  </div>
                </div>

                {/* Recent Security Events Feed */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                  <h3 className="text-sm font-semibold text-white">Recent Security & Administrative Actions</h3>
                  <div className="mt-3 divide-y divide-slate-800/60 overflow-hidden rounded-lg border border-slate-800">
                    {overview.recentSecurityEvents.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">No security events logged yet.</div>
                    ) : (
                      overview.recentSecurityEvents.map((evt) => (
                        <div key={evt.id} className="flex items-center justify-between p-3 text-xs hover:bg-slate-800/40">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-cyan-400">{evt.action}</span>
                            <span className="text-slate-400">{evt.resource}</span>
                          </div>
                          <div className="flex items-center gap-4 text-slate-500">
                            <span>{evt.actorEmail}</span>
                            <span>{new Date(evt.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* ── 2. TAB: USER MANAGEMENT ────────────────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">User Accounts & Access Control</h2>
                <p className="text-xs text-slate-400">Total registered accounts: {usersTotal}</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={usersSearch}
                    onChange={(e) => setUsersSearch(e.target.value)}
                    placeholder="Search by email / name..."
                    className="rounded-lg border border-slate-800 bg-slate-900/90 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <select
                  value={usersRoleFilter}
                  onChange={(e) => setUsersRoleFilter(e.target.value)}
                  className="rounded-lg border border-slate-800 bg-slate-900 py-1.5 px-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="ALL">All Roles</option>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPERADMIN">SUPERADMIN</option>
                </select>

                <select
                  value={usersStatusFilter}
                  onChange={(e) => setUsersStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-800 bg-slate-900 py-1.5 px-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="SUSPENDED">Suspended Only</option>
                </select>

                <button
                  onClick={fetchUsers}
                  disabled={loadingUsers}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingUsers ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 shadow">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-900 text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">2FA</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">Last Login</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No user accounts found matching your query criteria.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-200">{u.fullName || '—'}</p>
                          <p className="text-[11px] font-mono text-slate-400">{u.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                              u.role === 'SUPERADMIN'
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : u.role === 'ADMIN'
                                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                              u.status === 'ACTIVE'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {u.is2FAEnabled ? (
                            <span className="text-indigo-400">Enabled</span>
                          ) : (
                            <span className="text-slate-500">Off</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Role Change */}
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setNewRole(u.role);
                                setModalAction('role');
                              }}
                              title="Assign Role"
                              className="rounded border border-slate-800 bg-slate-900 p-1.5 text-slate-300 hover:border-cyan-500 hover:text-cyan-400"
                            >
                              <Key className="h-3.5 w-3.5" />
                            </button>

                            {/* Suspend / Reinstate */}
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setModalAction('status');
                              }}
                              title={u.status === 'ACTIVE' ? 'Suspend Account' : 'Reinstate Account'}
                              className={`rounded border border-slate-800 bg-slate-900 p-1.5 ${
                                u.status === 'ACTIVE'
                                  ? 'text-slate-300 hover:border-rose-500 hover:text-rose-400'
                                  : 'text-slate-300 hover:border-emerald-500 hover:text-emerald-400'
                              }`}
                            >
                              {u.status === 'ACTIVE' ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                            </button>

                            {/* Revoke Sessions */}
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setModalAction('revoke');
                              }}
                              title="Revoke Sessions"
                              className="rounded border border-slate-800 bg-slate-900 p-1.5 text-slate-300 hover:border-amber-500 hover:text-amber-400"
                            >
                              <LogOut className="h-3.5 w-3.5" />
                            </button>

                            {/* Export Data */}
                            <button
                              onClick={() => handleExportData(u)}
                              title="Export Audited Data"
                              className="rounded border border-slate-800 bg-slate-900 p-1.5 text-slate-300 hover:border-indigo-500 hover:text-indigo-400"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
                <span>
                  Showing {users.length} of {usersTotal} users
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={usersPage <= 1}
                    onClick={() => setUsersPage(usersPage - 1)}
                    className="rounded border border-slate-800 bg-slate-900 px-2.5 py-1 text-slate-300 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="px-2 py-1 font-mono">{usersPage}</span>
                  <button
                    disabled={users.length < 15 || usersPage * 15 >= usersTotal}
                    onClick={() => setUsersPage(usersPage + 1)}
                    className="rounded border border-slate-800 bg-slate-900 px-2.5 py-1 text-slate-300 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. TAB: AUDIT & SECURITY ───────────────────────────────────────── */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Immutable Audit Trail</h2>
                <p className="text-xs text-slate-400">Cryptographically recorded actions across administrative boundary</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={auditActionFilter}
                  onChange={(e) => setAuditActionFilter(e.target.value)}
                  placeholder="Filter by action name..."
                  className="rounded-lg border border-slate-800 bg-slate-900 py-1.5 px-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  onClick={fetchAuditLogs}
                  disabled={loadingAudit}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingAudit ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 shadow">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-900 text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">Timestamp</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">Action</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">Actor</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">Target Resource</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">IP Address</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {loadingAudit ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                      </td>
                    </tr>
                  ) : auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No audit events recorded matching criteria.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30">
                        <td className="px-4 py-3 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-3 font-semibold text-cyan-400">{log.action}</td>
                        <td className="px-4 py-3 text-slate-300">{log.user?.email || 'Anonymous / CLI'}</td>
                        <td className="px-4 py-3 text-slate-400">{log.resource}</td>
                        <td className="px-4 py-3 text-slate-500">{log.ipAddress || '—'}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedAuditLog(log)}
                            className="rounded border border-slate-800 bg-slate-900 px-2 py-1 text-[11px] text-slate-300 hover:border-cyan-500 hover:text-cyan-400"
                          >
                            <Eye className="inline h-3 w-3 mr-1" />
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── 4. TAB: DATABASE & RECOVERY ────────────────────────────────────── */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Database & Recovery Infrastructure</h2>
                <p className="text-xs text-slate-400">PostgreSQL state, storage integrity, and disaster recovery</p>
              </div>
              <button
                onClick={fetchDbStatus}
                disabled={loadingDb}
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingDb ? 'animate-spin text-cyan-400' : ''}`} />
                <span>Probe Status</span>
              </button>
            </div>

            {loadingDb && !dbStatus ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
              </div>
            ) : dbStatus ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Engine Health */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Active Database Instance</h3>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Connected
                    </span>
                  </div>

                  <div className="divide-y divide-slate-800/80 text-xs">
                    <div className="flex justify-between py-2.5">
                      <span className="text-slate-400">PostgreSQL Engine</span>
                      <span className="font-mono text-slate-200">{dbStatus.version}</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-slate-400">Active Connection Latency</span>
                      <span className="font-mono text-cyan-400">{dbStatus.latencyMs} ms</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-slate-400">Allocated Database Size</span>
                      <span className="font-mono text-slate-200">{dbStatus.databaseSize}</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-slate-400">Browser SQL Access</span>
                      <span className="font-mono text-rose-400 font-semibold">Strictly Prohibited</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-xs text-amber-300">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Shield className="h-3.5 w-3.5" />
                      <span>Security Boundary Enforcement</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                      Direct SQL consoles and database administrative passwords are not exposed to client web applications.
                      All database queries execute through backend Prisma transactions in isolated private network containers.
                    </p>
                  </div>
                </div>

                {/* Backup & Recovery Verification */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Automated Backup Audit</h3>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-mono font-semibold ${
                        dbStatus.backup.evidenceFound
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {dbStatus.backup.evidenceFound ? 'EVIDENCE VERIFIED' : 'STANDBY MOCK DETECTED'}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-800/80 text-xs">
                    <div className="flex justify-between py-2.5">
                      <span className="text-slate-400">Last Recorded Snapshot</span>
                      <span className="font-mono text-slate-200">
                        {dbStatus.backup.lastBackupTimestamp
                          ? new Date(dbStatus.backup.lastBackupTimestamp).toLocaleString()
                          : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-slate-400">Last Verified Restore Test</span>
                      <span className="font-mono text-slate-200">
                        {dbStatus.backup.lastRestoreVerificationTimestamp
                          ? new Date(dbStatus.backup.lastRestoreVerificationTimestamp).toLocaleString()
                          : 'Pending Isolation Test'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-slate-400">Archive Size on Disk</span>
                      <span className="font-mono text-slate-200">
                        {dbStatus.backup.backupSizeBytes ? `${dbStatus.backup.backupSizeBytes} bytes` : '—'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{dbStatus.backup.details}</p>

                  <div className="pt-2">
                    <button
                      onClick={handleTriggerBackup}
                      disabled={loadingDb}
                      className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-cyan-500 disabled:opacity-50"
                    >
                      <HardDriveIcon className="h-4 w-4" />
                      <span>Initiate Audited Backup Snapshot</span>
                    </button>
                    {backupTriggerMessage && (
                      <p className="mt-2 text-xs text-emerald-400">{backupTriggerMessage}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </main>

      {/* ── ACTION MODALS ───────────────────────────────────────────────────── */}
      {modalAction && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            {/* Modal: Change Role */}
            {modalAction === 'role' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Assign User Role</h3>
                  <button onClick={() => setModalAction(null)} className="text-slate-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Updating role for <strong className="text-slate-200">{selectedUser.email}</strong>.
                  Changing role will invalidate all active sessions immediately.
                </p>

                <div>
                  <label className="block text-xs font-medium text-slate-300">Select Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500"
                  >
                    <option value="USER">USER (Standard Member)</option>
                    <option value="ADMIN">ADMIN (Operations & Support)</option>
                    <option value="SUPERADMIN">SUPERADMIN (Full Platform Authority)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setModalAction(null)}
                    className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateRole}
                    disabled={actionLoading}
                    className="rounded-lg bg-cyan-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
                  >
                    {actionLoading ? 'Updating...' : 'Save Role'}
                  </button>
                </div>
              </div>
            )}

            {/* Modal: Suspend / Reinstate */}
            {modalAction === 'status' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    {selectedUser.status === 'ACTIVE' ? 'Suspend Account' : 'Reinstate Account'}
                  </h3>
                  <button onClick={() => setModalAction(null)} className="text-slate-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Are you sure you want to{' '}
                  <strong className={selectedUser.status === 'ACTIVE' ? 'text-rose-400' : 'text-emerald-400'}>
                    {selectedUser.status === 'ACTIVE' ? 'SUSPEND' : 'REINSTATE'}
                  </strong>{' '}
                  the account <strong className="text-slate-200">{selectedUser.email}</strong>?
                  {selectedUser.status === 'ACTIVE' &&
                    ' This will instantly invalidate all active user sessions and block login.'}
                </p>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setModalAction(null)}
                    className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleToggleStatus}
                    disabled={actionLoading}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50 ${
                      selectedUser.status === 'ACTIVE' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'
                    }`}
                  >
                    {actionLoading ? 'Processing...' : selectedUser.status === 'ACTIVE' ? 'Confirm Suspension' : 'Reinstate'}
                  </button>
                </div>
              </div>
            )}

            {/* Modal: Revoke Sessions */}
            {modalAction === 'revoke' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Revoke User Sessions</h3>
                  <button onClick={() => setModalAction(null)} className="text-slate-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Revoke all active browser and refresh sessions for <strong className="text-slate-200">{selectedUser.email}</strong>?
                  The user will be required to re-authenticate on all devices.
                </p>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setModalAction(null)}
                    className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRevokeSessions}
                    disabled={actionLoading}
                    className="rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
                  >
                    {actionLoading ? 'Revoking...' : 'Revoke All Sessions'}
                  </button>
                </div>
              </div>
            )}

            {/* Modal: Export Audited Data */}
            {modalAction === 'export' && exportedData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Audited User Data Export</h3>
                  <button onClick={() => setModalAction(null)} className="text-slate-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Data minimization applied. Password hashes and credentials strictly omitted.
                </p>

                <pre className="max-h-60 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] text-slate-300">
                  {JSON.stringify(exportedData, null, 2)}
                </pre>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(exportedData, null, 2)], {
                        type: 'application/json',
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `aether-user-export-${selectedUser.id}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download JSON</span>
                  </button>
                  <button
                    onClick={() => setModalAction(null)}
                    className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Audit Log Inspector */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Audit Event Details</h3>
              <button onClick={() => setSelectedAuditLog(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2 text-xs divide-y divide-slate-800/80">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Action</span>
                <span className="font-mono text-cyan-400">{selectedAuditLog.action}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Actor</span>
                <span className="text-slate-200">{selectedAuditLog.user?.email || 'Anonymous / CLI'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Target</span>
                <span className="text-slate-300 font-mono">{selectedAuditLog.resource}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">IP Address</span>
                <span className="text-slate-300 font-mono">{selectedAuditLog.ipAddress || '—'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Timestamp</span>
                <span className="text-slate-300 font-mono">{new Date(selectedAuditLog.createdAt).toISOString()}</span>
              </div>
            </div>

            {selectedAuditLog.payload && (
              <div className="mt-4">
                <span className="text-xs font-medium text-slate-400">Event Payload:</span>
                <pre className="mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] text-slate-300">
                  {JSON.stringify(selectedAuditLog.payload, null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="rounded-lg border border-slate-800 px-3.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple inline HardDrive icon for consistent Lucide rendering
const HardDriveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="12" x2="2" y2="12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    <line x1="6" y1="16" x2="6.01" y2="16" />
    <line x1="10" y1="16" x2="10.01" y2="16" />
  </svg>
);

export default AdminDashboardPage;
