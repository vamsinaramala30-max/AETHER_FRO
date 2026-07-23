// frontend/src/settings/profile/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { ProfileForm } from './ProfileForm';
import { profileService, UserProfile } from './profileService';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profileService.getCurrentProfile()
      .then((data) => { setProfile(data); })
      .catch(() => { setError('Failed to load profile settings.'); })
      .finally(() => { setLoading(false); });
  }, []);

  if (loading) {
    return <div className="text-sm text-slate-400 animate-pulse">Loading profile settings...</div>;
  }

  if (error || !profile) {
    return <div className="text-sm text-rose-400">{error || 'Profile could not be resolved.'}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Account Profile</h2>
        <p className="text-sm text-slate-400 mt-1">Manage your identity data and primary metadata parameters.</p>
      </div>
      <hr className="border-slate-800" />
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-2">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-inner">
          {profile.firstName?.[0] || profile.email[0]}
        </div>
        <div>
          <h3 className="text-base font-medium text-white">{profile.firstName} {profile.lastName}</h3>
          <p className="text-sm text-slate-400">{profile.email}</p>
        </div>
      </div>
      <ProfileForm initialProfile={profile} onUpdateSuccess={(updated) => { setProfile(updated); }} />
    </div>
  );
};