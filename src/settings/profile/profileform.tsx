import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, profileService } from './profileservice';
import { Camera, Trash2, CheckCircle, AlertCircle, RefreshCw, Check, X } from 'lucide-react';

interface ProfileFormProps {
  initialProfile: UserProfile;
  onUpdateSuccess: (updated: UserProfile) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onUpdateSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: initialProfile.fullName || `${initialProfile.firstName || ''} ${initialProfile.lastName || ''}`.trim(),
    username: initialProfile.username || '',
    email: initialProfile.email || '',
    phone: initialProfile.phone || '',
    bio: initialProfile.bio || '',
    company: initialProfile.company || '',
    timezone: initialProfile.timezone || 'UTC',
    language: initialProfile.language || 'en',
    country: initialProfile.country || 'United States',
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialProfile.avatarUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setFormData({
      fullName: initialProfile.fullName || `${initialProfile.firstName || ''} ${initialProfile.lastName || ''}`.trim(),
      username: initialProfile.username || '',
      email: initialProfile.email || '',
      phone: initialProfile.phone || '',
      bio: initialProfile.bio || '',
      company: initialProfile.company || '',
      timezone: initialProfile.timezone || 'UTC',
      language: initialProfile.language || 'en',
      country: initialProfile.country || 'United States',
    });
    setAvatarUrl(initialProfile.avatarUrl || null);
    setHasUnsavedChanges(false);
  }, [initialProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
    setMessage(null);
  };

  const handleReset = () => {
    setFormData({
      fullName: initialProfile.fullName || `${initialProfile.firstName || ''} ${initialProfile.lastName || ''}`.trim(),
      username: initialProfile.username || '',
      email: initialProfile.email || '',
      phone: initialProfile.phone || '',
      bio: initialProfile.bio || '',
      company: initialProfile.company || '',
      timezone: initialProfile.timezone || 'UTC',
      language: initialProfile.language || 'en',
      country: initialProfile.country || 'United States',
    });
    setAvatarUrl(initialProfile.avatarUrl || null);
    setHasUnsavedChanges(false);
    setMessage(null);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setMessage(null);

    profileService
      .uploadAvatar(file)
      .then((updated) => {
        setAvatarUrl(updated.avatarUrl || null);
        onUpdateSuccess(updated);
        setMessage({ type: 'success', text: 'Profile photo updated successfully.' });
      })
      .catch((err: any) => {
        setMessage({ type: 'error', text: err?.message || 'Failed to upload profile photo.' });
      })
      .finally(() => {
        setIsUploadingPhoto(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      });
  };

  const handlePhotoRemove = () => {
    setIsUploadingPhoto(true);
    setMessage(null);

    profileService
      .removeAvatar()
      .then((updated) => {
        setAvatarUrl(null);
        onUpdateSuccess(updated);
        setMessage({ type: 'success', text: 'Profile photo removed.' });
      })
      .catch((err: any) => {
        setMessage({ type: 'error', text: err?.message || 'Failed to remove profile photo.' });
      })
      .finally(() => {
        setIsUploadingPhoto(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    profileService
      .updateProfile(formData)
      .then((updated) => {
        onUpdateSuccess(updated);
        setHasUnsavedChanges(false);
        setMessage({ type: 'success', text: 'Profile information updated successfully.' });
      })
      .catch((err: any) => {
        const errorMsg = err?.response?.data?.error || err?.message || 'Failed to update profile. Please try again.';
        setMessage({ type: 'error', text: errorMsg });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const initialChar = formData.fullName.trim() ? formData.fullName.trim()[0].toUpperCase() : 'U';

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Kolkata',
    'Australia/Sydney',
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Messages */}
      {message && (
        <div
          className={`flex items-center gap-3 rounded-xl p-4 text-xs font-semibold ${
            message.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
              : 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
          <span>You have unsaved changes on your profile.</span>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-amber-700 underline hover:text-amber-900 dark:text-amber-300"
          >
            Discard Changes
          </button>
        </div>
      )}

      {/* Photo Upload Section */}
      <div className="flex flex-col items-start gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:flex-row sm:items-center">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-3xl font-black uppercase text-white shadow-md">
          {avatarUrl ? (
            <img src={avatarUrl} alt="User Avatar" className="h-full w-full object-cover" />
          ) : (
            initialChar
          )}

          {isUploadingPhoto && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
              <RefreshCw className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Profile Picture</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supports PNG, JPEG, WEBP, or GIF up to 5MB.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploadingPhoto}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>{avatarUrl ? 'Replace Photo' : 'Upload Photo'}</span>
            </button>

            {avatarUrl && (
              <button
                type="button"
                disabled={isUploadingPhoto}
                onClick={handlePhotoRemove}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Form Input Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="username" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
            placeholder="@username"
          />
        </div>
      </div>

      {/* Email Address & Verification Status */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                initialProfile.isEmailVerified
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
              }`}
            >
              {initialProfile.isEmailVerified ? (
                <>
                  <Check className="h-3 w-3" /> Verified
                </>
              ) : (
                <>
                  <X className="h-3 w-3" /> Not verified
                </>
              )}
            </span>
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs font-medium text-slate-500 opacity-80 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      {/* Company & Country */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
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
          <label htmlFor="country" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
          />
        </div>
      </div>

      {/* Timezone & Language */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="timezone" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="language" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
          Bio / Description
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
          placeholder="Brief professional summary..."
        />
      </div>

      {/* Account Info Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40 text-xs font-medium text-slate-500 dark:text-slate-400">
        <div>
          Member Since:{' '}
          <strong className="text-slate-900 dark:text-white">
            {initialProfile.createdAt ? new Date(initialProfile.createdAt).toLocaleDateString() : 'N/A'}
          </strong>
        </div>
        <div>
          Last Active:{' '}
          <strong className="text-slate-900 dark:text-white">
            {initialProfile.lastLoginAt ? new Date(initialProfile.lastLoginAt).toLocaleString() : 'Just now'}
          </strong>
        </div>
      </div>

      {/* Save & Cancel Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>

        {hasUnsavedChanges && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
