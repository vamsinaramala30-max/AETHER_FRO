// frontend/src/auth/LoginPage.tsx
import React, { useState } from 'react';
import { authService } from './authservice';
import { AuthLayout } from './authlayout';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const { error } = await authService.signIn(email, password);
      if (error) {
        setErrorMessage(error.message);
      } else {
        // Safe navigation fallback window redirection to skip layout state mismatches
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setErrorMessage('An unexpected authorization breakdown occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setErrorMessage(null);
    try {
      authService.signInWithGoogle();
    } catch (err) {
      setErrorMessage('Google OAuth connection initialization failed.');
    }
  };

  return (
    <AuthLayout title="Welcome to Aether" subtitle="Sign in to your development architecture workspace">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {errorMessage && (
          <div role="alert" className="p-3 text-sm rounded-lg bg-red-950/40 border border-red-800 text-red-400 font-medium">
            {errorMessage}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
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
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => { setPassword(e.target.value); }}
              className="block w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 disabled:opacity-50 transition-colors"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Sign in'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative bg-slate-900 px-3 text-xs uppercase text-slate-500 font-semibold tracking-wider">
            Or operate via identity providers
          </span>
        </div>

        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full inline-flex justify-center py-2.5 px-4 rounded-lg border border-slate-800 bg-slate-950 text-sm font-medium text-slate-300 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors cursor-pointer"
          >
            <span className="mr-2 font-bold text-slate-400">G</span> Sign in with Google
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        New to the framework?{' '}
        <a href="/signup" className="font-medium text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors">
          Create an identity instance
        </a>
      </p>
    </AuthLayout>
  );
};