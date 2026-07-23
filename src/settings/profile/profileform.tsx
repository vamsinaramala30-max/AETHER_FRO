// frontend/src/settings/profile/ProfileForm.tsx
import React, { useState } from 'react';
import { UserProfile, profileService } from './profileService';

interface ProfileFormProps {
  initialProfile: UserProfile;
  onUpdateSuccess: (updated: UserProfile) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onUpdateSuccess }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    firstName: initialProfile.firstName || '',
    lastName: initialProfile.lastName || '',
    bio: initialProfile.bio || '',
    company: initialProfile.company || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      const updated = await profileService.updateProfile(formData);
      onUpdateSuccess(updated);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {message && (
        <div className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-indigo-500 transition" />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
          <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-indigo-500 transition" />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-1">Company / Organization</label>
        <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-indigo-500 transition" />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-1">Bio</label>
        <textarea id="bio" name="bio" rows={4} value={formData.bio} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-indigo-500 transition resize-none" />
      </div>

      <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-medium rounded-md text-sm transition shadow-sm">
        {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
      </button>
    </form>
  );
};