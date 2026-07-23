// frontend/src/settings/security/SecuritySettings.tsx
import React, { useState } from 'react';
import { securityService } from './securityService';

export const SecuritySettings: React.FC = () => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [status, setStatus] = useState<{ success: boolean; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setStatus({ success: false, text: 'New credentials do not match confirmed target values.' });
      return;
    }
    setSubmitting(true);
    setStatus(null);
    try {
      await securityService.changePassword({ currentPasswordHash: passwords.current, newPasswordHash: passwords.new });
      setStatus({ success: true, text: 'Access token configuration metrics modified successfully.' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setStatus({ success: false, text: 'Identity token confirmation verification failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <h3 className="text-base font-medium text-white">Modify Authentication Secret</h3>
        {status && (
          <div className={`p-4 rounded-md text-sm ${status.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
            {status.text}
          </div>
        )}
        <div>
          <label htmlFor="current" className="block text-sm font-medium text-slate-300 mb-1">Current Password</label>
          <input type="password" id="current" value={passwords.current} onChange={(e) => { setPasswords({ ...passwords, current: e.target.value }); }} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-indigo-500 transition" required />
        </div>
        <div>
          <label htmlFor="new" className="block text-sm font-medium text-slate-300 mb-1">New Password Target</label>
          <input type="password" id="new" value={passwords.new} onChange={(e) => { setPasswords({ ...passwords, new: e.target.value }); }} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-indigo-500 transition" required />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password Target</label>
          <input type="password" id="confirm" value={passwords.confirm} onChange={(e) => { setPasswords({ ...passwords, confirm: e.target.value }); }} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-indigo-500 transition" required />
        </div>
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-medium rounded-md text-sm transition">
          {submitting ? 'Updating Core Secret...' : 'Commit Security Update'}
        </button>
      </form>
    </div>
  );
};