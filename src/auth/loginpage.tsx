// frontend/src/auth/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from './authservice';
import { AuthLayout } from './authlayout';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

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
        const fromPath = (location.state as { from?: string } | null)?.from || '/app';
        navigate(fromPath, { replace: true });
      }
    } catch {
      setErrorMessage('An unexpected authorization breakdown occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setErrorMessage(null);
    try {
      authService.signInWithGoogle();
    } catch {
      setErrorMessage('Google OAuth connection initialization failed.');
    }
  };

  return (
    <AuthLayout
      title="Welcome to Aether"
      subtitle="Sign in to your development architecture workspace"
    >
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm font-medium text-red-400"
          >
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
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
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
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="flex w-full cursor-pointer justify-center rounded-lg border border-transparent bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-cyan-600"
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
          <span className="relative bg-slate-900 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Or operate via identity providers
          </span>
        </div>

        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="inline-flex w-full cursor-pointer justify-center rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          >
            <span className="mr-2 font-bold text-slate-400">G</span> Sign in with Google
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        New to the framework?{' '}
        <Link
          to="/signup"
          className="font-medium text-cyan-400 underline underline-offset-4 transition-colors hover:text-cyan-300"
        >
          Create an identity instance
        </Link>
      </p>
    </AuthLayout>
  );
};
