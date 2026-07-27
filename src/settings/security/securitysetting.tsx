// frontend/src/settings/security/SecuritySettings.tsx
import React, { useState } from 'react';
import { securityService } from './securityService';

export const SecuritySettings: React.FC = () => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [status, setStatus] = useState<{ success: boolean; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePasswordChange = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setStatus({ success: false, text: 'New credentials do not match confirmed target values.' });
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
          text: 'Access token configuration metrics modified successfully.',
        });
        setPasswords({ current: '', new: '', confirm: '' });
      } catch {
        setStatus({ success: false, text: 'Identity token confirmation verification failed.' });
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    <div className="max-w-2xl space-y-8">
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <h3 className="text-base font-medium text-white">Modify Authentication Secret</h3>
        {status && (
          <div
            className={`rounded-md p-4 text-sm ${status.success ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border border-rose-500/20 bg-rose-500/10 text-rose-400'}`}
          >
            {status.text}
          </div>
        )}
        <div>
          <label htmlFor="current" className="mb-1 block text-sm font-medium text-slate-300">
            Current Password
          </label>
          <input
            type="password"
            id="current"
            value={passwords.current}
            onChange={(e) => {
              setPasswords({ ...passwords, current: e.target.value });
            }}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white transition focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="new" className="mb-1 block text-sm font-medium text-slate-300">
            New Password Target
          </label>
          <input
            type="password"
            id="new"
            value={passwords.new}
            onChange={(e) => {
              setPasswords({ ...passwords, new: e.target.value });
            }}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white transition focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-slate-300">
            Confirm New Password Target
          </label>
          <input
            type="password"
            id="confirm"
            value={passwords.confirm}
            onChange={(e) => {
              setPasswords({ ...passwords, confirm: e.target.value });
            }}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white transition focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:bg-indigo-600/50"
        >
          {submitting ? 'Updating Core Secret...' : 'Commit Security Update'}
        </button>
      </form>
    </div>
  );
};
