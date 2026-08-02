import React, { useState } from 'react';
import { UserProfile, profileService } from './profileservice';

interface ProfileFormProps {
  initialProfile: UserProfile;
  onUpdateSuccess: (updated: UserProfile) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onUpdateSuccess }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    firstName: typeof initialProfile.firstName === 'string' ? initialProfile.firstName : '',
    lastName: typeof initialProfile.lastName === 'string' ? initialProfile.lastName : '',
    bio: typeof initialProfile.bio === 'string' ? initialProfile.bio : '',
    company: typeof initialProfile.company === 'string' ? initialProfile.company : '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    void (async () => {
      try {
        const updated = await profileService.updateProfile(formData);
        onUpdateSuccess(updated);
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
      } catch {
        setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {message && (
        <div
          className={`rounded-xl p-4 text-xs font-semibold ${
            message.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
              : 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="company"
          className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
        >
          Company / Organization
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="bio"
          className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
      </button>
    </form>
  );
};
