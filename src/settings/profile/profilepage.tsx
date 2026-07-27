// frontend/src/settings/profile/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { ProfileForm } from './profileform';
import { profileService, UserProfile } from './profileservice';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await profileService.getCurrentProfile();
        setProfile(data);
      } catch {
        setError('Failed to load profile settings.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="animate-pulse text-sm text-slate-400">Loading profile settings...</div>;
  }

  const hasError = typeof error === 'string' && error.trim() !== '';
  if (hasError || profile === null) {
    return (
      <div className="text-sm text-rose-400">
        {hasError ? error : 'Profile could not be resolved.'}
      </div>
    );
  }

  const initialChar =
    typeof profile.firstName === 'string' && profile.firstName.length > 0
      ? profile.firstName[0]
      : profile.email.length > 0
        ? profile.email[0]
        : 'U';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">Account Profile</h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage your identity data and primary metadata parameters.
        </p>
      </div>
      <hr className="border-slate-800" />
      <div className="flex flex-col items-start gap-6 pb-2 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-2xl font-bold uppercase text-white shadow-inner">
          {initialChar}
        </div>
        <div>
          <h3 className="text-base font-medium text-white">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-sm text-slate-400">{profile.email}</p>
        </div>
      </div>
      <ProfileForm
        initialProfile={profile}
        onUpdateSuccess={(updated) => {
          setProfile(updated);
        }}
      />
    </div>
  );
};
