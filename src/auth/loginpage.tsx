// frontend/src/auth/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from './authservice';
import { AuthLayout } from './authlayout';
import { Eye, EyeOff } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const errorParam = searchParams.get('error');
    if (errorParam === 'google_not_configured') {
      setErrorMessage('Google OAuth is not configured on the backend server.');
    } else if (errorParam === 'oauth_failed') {
      setErrorMessage('Google OAuth sign in failed or was cancelled.');
    } else if (errorParam) {
      setErrorMessage('Google OAuth process encountered an error.');
    }
  }, [location.search]);

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
    <AuthLayout title="Welcome to Aether" subtitle="Sign in to your account">
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

          <div className="relative mt-1">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 pr-11 text-slate-100 placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-slate-200 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
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
          <span className="relative px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Or
          </span>
        </div>

        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900"
          >
            <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
            Sign in with Google
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        New to the framework?{' '}
        <Link
          to="/signup"
          className="font-medium text-cyan-400 underline underline-offset-4 transition-colors hover:text-cyan-300"
        >
          Create Account
        </Link>
      </p>
    </AuthLayout>
  );
};
