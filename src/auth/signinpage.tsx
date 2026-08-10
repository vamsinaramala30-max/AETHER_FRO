// frontend/src/auth/SignupPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from './authservice';
import { AuthLayout } from './authlayout';
import { Eye, EyeOff } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

const FloatingBackground: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950">
    <style>{`
      @keyframes drift-a {
        0%   { transform: translate(0, 0) scale(1); }
        50%  { transform: translate(60px, -40px) scale(1.08); }
        100% { transform: translate(0, 0) scale(1); }
      }
      @keyframes drift-b {
        0%   { transform: translate(0, 0) scale(1); }
        50%  { transform: translate(-50px, 50px) scale(0.94); }
        100% { transform: translate(0, 0) scale(1); }
      }
      @keyframes drift-c {
        0%   { transform: translate(0, 0) scale(1); }
        50%  { transform: translate(40px, 60px) scale(1.05); }
        100% { transform: translate(0, 0) scale(1); }
      }
      .orb-a { animation: drift-a 18s ease-in-out infinite; }
      .orb-b { animation: drift-b 22s ease-in-out infinite; }
      .orb-c { animation: drift-c 26s ease-in-out infinite; }

      @media (prefers-reduced-motion: reduce) {
        .orb-a, .orb-b, .orb-c { animation: none; }
      }
    `}</style>

    {/* subtle dot grid for texture */}
    <div
      className="absolute inset-0 opacity-[0.15]"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(148,163,184,0.5) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    />

    {/* floating gradient orbs */}
    <div className="orb-a absolute -left-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-cyan-500/20 blur-3xl" />
    <div className="orb-b absolute -right-24 top-1/3 h-[22rem] w-[22rem] rounded-full bg-emerald-500/15 blur-3xl" />
    <div className="orb-c absolute -bottom-40 left-1/4 h-[30rem] w-[30rem] rounded-full bg-indigo-500/15 blur-3xl" />
    <div className="orb-b absolute right-1/4 -bottom-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-2xl" />

    {/* faint circle rings for depth */}
    <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-800/60" />
    <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-800/40" />
  </div>
);

export const SignupPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    if (!firstName.trim()) {
      setErrorMessage('First name is required.');
      return;
    }

    if (!lastName.trim()) {
      setErrorMessage('Last name is required.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Invalid email address format.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Input parameters verification failed: passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { user, error } = await authService.signUp(
        firstName.trim(),
        lastName.trim(),
        email.trim(),
        password,
      );
      if (error) {
        setErrorMessage(error.message);
      } else if (user) {
        setSuccessMessage(
          'Account framework registered. Please check your inbox for configuration verification links.',
        );
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch {
      setErrorMessage('Account instantiation process threw an internal framework fault.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FloatingBackground />

      <AuthLayout
        title="Create Aether Account"
        subtitle="Register a clean authentication scope within Aether"
      >
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {errorMessage && (
            <div
              role="alert"
              className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm font-medium text-red-400"
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg border border-emerald-800 bg-emerald-950/40 p-3 text-sm font-medium text-emerald-400">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-300">
                First Name
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  disabled={isLoading}
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/80 backdrop-blur-sm px-3 py-2 text-slate-100 placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-300">
                Last Name
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  disabled={isLoading}
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/80 backdrop-blur-sm px-3 py-2 text-slate-100 placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
                />
              </div>
            </div>
          </div>

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
                className="block w-full rounded-lg border border-slate-800 bg-slate-950/80 backdrop-blur-sm px-3 py-2 text-slate-100 placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password (minimum 8 characters)
            </label>

            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-slate-800 bg-slate-950/80 backdrop-blur-sm px-3 py-2 pr-11 text-slate-100 placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
              />

              <button
                type="button"
                disabled={isLoading}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-200 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
              Confirm Password
            </label>

            <div className="relative mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                disabled={isLoading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-lg border border-slate-800 bg-slate-950/80 backdrop-blur-sm px-3 py-2 pr-11 text-slate-100 placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
              />

              <button
                type="button"
                disabled={isLoading}
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-200 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !firstName || !lastName || !email || !password || !confirmPassword}
            className="flex w-full cursor-pointer justify-center rounded-lg border border-transparent bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-40 disabled:hover:bg-cyan-600"
          >
            {isLoading ? 'Provisioning...' : 'Register instance'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-transparent">
              Or
            </span>
          </div>

          <div className="mt-4">
            <button
              onClick={() => {
                setErrorMessage(null);
                try {
                  authService.signInWithGoogle();
                } catch {
                  setErrorMessage('Google OAuth connection initialization failed.');
                }
              }}
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-800 bg-slate-950/80 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900"
            >
              <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
              Sign up with Google
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-cyan-400 underline underline-offset-4 transition-colors hover:text-cyan-300"
          >
            Sign in
          </Link>
        </p>
      </AuthLayout>
    </>
  );
};