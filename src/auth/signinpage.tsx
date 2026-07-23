// frontend/src/auth/SignupPage.tsx
import React, { useState } from 'react';
import { authService } from './authService';
import { AuthLayout } from './AuthLayout';

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 8) {
      setErrorMessage('Security core mandates minimum password layout length of 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Input parameters verification failed: passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { user, error } = await authService.signUp(email, password);
      if (error) {
        setErrorMessage(error.message);
      } else if (user) {
        setSuccessMessage('Account framework registered. Please check your inbox for configuration verification links.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setErrorMessage('Account instantiation process threw an internal framework fault.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Architecture Account" subtitle="Register a clean authentication scope within Aether">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {errorMessage && (
          <div role="alert" className="p-3 text-sm rounded-lg bg-red-950/40 border border-red-800 text-red-400 font-medium">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 text-sm rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-400 font-medium">
            {successMessage}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => { setEmail(e.target.value); }}
              className="block w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 disabled:opacity-50 transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300">
            Password (minimum 8 characters)
          </label>
          <div className="mt-1">
            <input
              id="password"
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => { setPassword(e.target.value); }}
              className="block w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 disabled:opacity-50 transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
            Confirm Password
          </label>
          <div className="mt-1">
            <input
              id="confirmPassword"
              type="password"
              required
              disabled={isLoading}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); }}
              className="block w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 disabled:opacity-50 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !email || !password || !confirmPassword}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 transition-colors cursor-pointer"
        >
          {isLoading ? 'Provisioning...' : 'Register instance'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have a configured profile?{' '}
        <a href="/login" className="font-medium text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors">
          Sign in instead
        </a>
      </p>
    </AuthLayout>
  );
};