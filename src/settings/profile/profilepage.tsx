import React, { useEffect, useState, useCallback } from 'react';
import { ProfileForm } from './profileform';
import { profileService, UserProfile } from './profileservice';
import { useAuth } from '@/app/providers/authprovider';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { User, AlertCircle, ShieldCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshSession } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getCurrentProfile();
      setProfile(data);
    } catch {
      if (user) {
        setProfile({
          id: user.id || 'usr_default',
          email: user.email || '',
          fullName:
            user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'AETHER User',
          username: (user as any)?.username || null,
          avatarUrl: user.avatarUrl || null,
          bio: (user as any)?.bio || '',
          company: (user as any)?.company || '',
          phone: (user as any)?.phone || '',
          timezone: (user as any)?.timezone || 'UTC',
          language: (user as any)?.language || 'en',
          country: (user as any)?.country || 'United States',
          isEmailVerified: true,
        });
      } else {
        setError('Unable to load profile information from server.');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadProfileData();
  }, [loadProfileData]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center gap-3 py-8 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400" />
          <span>Loading authenticated profile data...</span>
        </div>
      </PageWrapper>
    );
  }

  if (error || !profile) {
    return (
      <PageWrapper>
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error || 'Profile could not be resolved.'}</span>
        </div>
      </PageWrapper>
    );
  }

  const displayName =
    profile.fullName ||
    `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
    profile.email;
  const initialChar = displayName ? displayName[0].toUpperCase() : 'U';

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
          <User className="h-7 w-7 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Account Profile
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage your personal details, profile picture, and organization metadata.
            </p>
          </div>
        </div>

        {/* User Card */}
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-2xl font-black uppercase text-white shadow-md">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              initialChar
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{displayName}</h3>
              {profile.isEmailVerified && (
                <span title="Verified Account">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </span>
              )}
            </div>

            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {profile.email} {profile.username ? `• @${profile.username}` : ''}
            </p>

            {profile.company && (
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {profile.company}
              </p>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <ProfileForm
            initialProfile={profile}
            onUpdateSuccess={(updated) => {
              setProfile(updated);
              void refreshSession();
            }}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;
