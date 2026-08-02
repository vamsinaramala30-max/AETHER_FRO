import React, { useEffect, useState } from 'react';
import { ProfileForm } from './profileform';
import { profileService, UserProfile } from './profileservice';
import { useAuth } from '@/app/providers/authprovider';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { User } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshSession } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await profileService.getCurrentProfile();
        setProfile(data);
      } catch {
        if (user) {
          setProfile({
            id: user.id || 'usr_default',
            email: user.email || '',
            firstName: user.firstName || (user.name ? user.name.split(' ')[0] : 'User'),
            lastName: user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : ''),
            avatarUrl: user.avatarUrl,
            bio: '',
            company: '',
          });
        } else {
          setError('Failed to load profile settings.');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="animate-pulse text-xs font-semibold text-indigo-600 dark:text-indigo-400">
        Loading profile settings...
      </div>
    );
  }

  const hasError = typeof error === 'string' && error.trim() !== '';
  if (hasError || profile === null) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
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
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Account Profile
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage your personal details, profile picture, and organization metadata.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-2xl font-black uppercase text-white shadow-md">
            {initialChar}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              {profile.email}
            </p>
          </div>
        </div>

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
