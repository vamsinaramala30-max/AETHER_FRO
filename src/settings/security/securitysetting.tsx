import React, { useState } from 'react';
import { securityService } from './securityservice';

export const SecuritySettings: React.FC = () => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [status, setStatus] = useState<{ success: boolean; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePasswordChange = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setStatus({ success: false, text: 'New passwords do not match.' });
      return;
    }
    setSubmitting(true);
    setStatus(null);
    void (async () => {
      try {
        await securityService.changePassword({
          currentPasswordHash: passwords.current,
          newPasswordHash: passwords.new,
        });
        setStatus({
          success: true,
          text: 'Password updated successfully.',
        });
        setPasswords({ current: '', new: '', confirm: '' });
      } catch {
        setStatus({ success: false, text: 'Verification failed. Please check current password.' });
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <form onSubmit={handlePasswordChange} className="space-y-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Update Password</h3>
        {status && (
          <div
            className={`rounded-xl p-4 text-xs font-semibold ${
              status.success
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400'
            }`}
          >
            {status.text}
          </div>
        )}
        <div>
          <label
            htmlFor="current"
            className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            Current Password
          </label>
          <input
            type="password"
            id="current"
            autoComplete="current-password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
            required
          />
        </div>
        <div>
          <label
            htmlFor="new"
            className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            New Password
          </label>
          <input
            type="password"
            id="new"
            autoComplete="new-password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
            required
          />
        </div>
        <div>
          <label
            htmlFor="confirm"
            className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirm"
            autoComplete="new-password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {submitting ? 'Updating Password...' : 'Save New Password'}
        </button>
      </form>
    </div>
  );
};
