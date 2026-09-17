import React, { useState, useEffect } from 'react';
import { securityService, UserSession } from './securityservice';
import {
  Eye,
  EyeOff,
  Check,
  X,
  ShieldAlert,
  Monitor,
  Smartphone,
  Trash2,
  LogOut,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/app/providers/authprovider';

export const SecuritySettings: React.FC = () => {
  const { logout } = useAuth();

  // Password fields state
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ success: boolean; text: string } | null>(
    null,
  );
  const [submittingPassword, setSubmittingPassword] = useState(false);

  // Active Sessions state
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);

  // Account Deletion state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Password validation rules
  const reqMinLength = passwords.new.length >= 8;
  const reqUppercase = /[A-Z]/.test(passwords.new);
  const reqLowercase = /[a-z]/.test(passwords.new);
  const reqNumber = /[0-9]/.test(passwords.new);
  const reqSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(passwords.new);
  const reqMatches = passwords.new.length > 0 && passwords.new === passwords.confirm;
  const isPasswordValid =
    reqMinLength && reqUppercase && reqLowercase && reqNumber && reqSpecial && reqMatches;

  const loadSessions = () => {
    setLoadingSessions(true);
    securityService
      .getActiveSessions()
      .then((data) => setSessions(data))
      .catch(() => setSessions([]))
      .finally(() => setLoadingSessions(false));
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setPasswordStatus({
        success: false,
        text: 'Please ensure your new password meets all security requirements.',
      });
      return;
    }

    setSubmittingPassword(true);
    setPasswordStatus(null);

    securityService
      .changePassword(passwords.current, passwords.new)
      .then(() => {
        setPasswordStatus({ success: true, text: 'Password updated successfully.' });
        setPasswords({ current: '', new: '', confirm: '' });
      })
      .catch((err: any) => {
        const errorMsg =
          err?.response?.data?.error ||
          err?.message ||
          'Verification failed. Please check current password.';
        setPasswordStatus({ success: false, text: errorMsg });
      })
      .finally(() => {
        setSubmittingPassword(false);
      });
  };

  const handleRevokeSession = (sessionId: string) => {
    securityService
      .revokeSession(sessionId)
      .then(() => {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        setSessionMessage('Session revoked successfully.');
        setTimeout(() => setSessionMessage(null), 3000);
      })
      .catch((err: any) => {
        setSessionMessage(err?.response?.data?.error || 'Failed to revoke session.');
      });
  };

  const handleRevokeAllOtherSessions = () => {
    securityService
      .revokeAllOtherSessions()
      .then((msg) => {
        setSessionMessage(msg);
        loadSessions();
        setTimeout(() => setSessionMessage(null), 3000);
      })
      .catch((err: any) => {
        setSessionMessage(err?.response?.data?.error || 'Failed to revoke sessions.');
      });
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmation !== 'DELETE') {
      setDeleteError('Please type "DELETE" to confirm account deletion.');
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    securityService
      .deleteAccount(deleteConfirmation, deletePassword)
      .then(() => {
        void logout();
      })
      .catch((err: any) => {
        setDeleteError(err?.response?.data?.error || err?.message || 'Failed to delete account.');
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  return (
    <div className="space-y-8">
      {/* 1. Update Password Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Change Password</h3>
        </div>

        {passwordStatus && (
          <div
            className={`mb-4 rounded-xl p-4 text-xs font-semibold ${
              passwordStatus.success
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400'
            }`}
          >
            {passwordStatus.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* Current Password Field */}
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                id="currentPassword"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                required
              />
              <button
                type="button"
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div>
            <label
              htmlFor="newPassword"
              className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                id="newPassword"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                required
              />
              <button
                type="button"
                aria-label={showNew ? 'Hide password' : 'Show password'}
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                id="confirmPassword"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                required
              />
              <button
                type="button"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Requirements Dynamic List */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-[11px] font-semibold text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
            <div
              className={`flex items-center gap-1.5 ${reqMinLength ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
            >
              {reqMinLength ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <X className="h-3.5 w-3.5 opacity-50" />
              )}{' '}
              Minimum 8 characters
            </div>
            <div
              className={`flex items-center gap-1.5 ${reqUppercase ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
            >
              {reqUppercase ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <X className="h-3.5 w-3.5 opacity-50" />
              )}{' '}
              Uppercase letter
            </div>
            <div
              className={`flex items-center gap-1.5 ${reqLowercase ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
            >
              {reqLowercase ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <X className="h-3.5 w-3.5 opacity-50" />
              )}{' '}
              Lowercase letter
            </div>
            <div
              className={`flex items-center gap-1.5 ${reqNumber ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
            >
              {reqNumber ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <X className="h-3.5 w-3.5 opacity-50" />
              )}{' '}
              Number (0-9)
            </div>
            <div
              className={`flex items-center gap-1.5 ${reqSpecial ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
            >
              {reqSpecial ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <X className="h-3.5 w-3.5 opacity-50" />
              )}{' '}
              Special character
            </div>
            <div
              className={`flex items-center gap-1.5 ${reqMatches ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
            >
              {reqMatches ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <X className="h-3.5 w-3.5 opacity-50" />
              )}{' '}
              Passwords match
            </div>
          </div>

          <button
            type="submit"
            disabled={submittingPassword}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {submittingPassword ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>
      </div>

      {/* 2. Active Sessions Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Sessions</h3>
          </div>
          {sessions.length > 1 && (
            <button
              type="button"
              onClick={handleRevokeAllOtherSessions}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline dark:text-rose-400"
            >
              <LogOut className="h-3.5 w-3.5" /> Revoke All Other Sessions
            </button>
          )}
        </div>

        {sessionMessage && (
          <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-xs font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
            {sessionMessage}
          </div>
        )}

        {loadingSessions ? (
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Loading active sessions...
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-xs text-slate-500">No active sessions detected.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800/60 dark:bg-slate-800/40"
              >
                <div className="flex items-center gap-3">
                  {s.device.includes('Mobile') ? (
                    <Smartphone className="h-5 w-5 text-slate-500" />
                  ) : (
                    <Monitor className="h-5 w-5 text-slate-500" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {s.browser} on {s.os}
                      </span>
                      {s.isCurrent && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          This Device
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      IP: {s.ipAddress} • Logged in: {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {!s.isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleRevokeSession(s.id)}
                    className="text-xs font-semibold text-rose-600 hover:underline dark:text-rose-400"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Two-Factor Authentication Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-2 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Two-Factor Authentication (2FA)
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Two-factor authentication requires additional server configuration.
        </p>
      </div>

      {/* 4. Danger Zone - Account Deletion */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="text-base font-bold">Danger Zone — Delete Account</h3>
        </div>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Permanently remove your account and all associated workspace records. This action cannot
          be undone.
        </p>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="mt-4 flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete Account</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Confirm Account Deletion
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This will permanently purge your profile, automations, and personal workspace data.
              Type <strong className="text-slate-900 dark:text-white">DELETE</strong> to confirm.
            </p>

            {deleteError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirmation Keyword
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 transition dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Account Password
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 transition dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleting || deleteConfirmation !== 'DELETE'}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Permanently Delete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
