import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminApi, AdminLoginResult } from '../api/admin.api';
import { authConfig } from '../config/auth.config';
import { AetherSymbol } from '@/components/branding/AetherLogo';
import { Shield, Lock, KeyRound, ArrowRight, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaTicket, setMfaTicket] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard if user already holds active administrative session
  useEffect(() => {
    try {
      const userRaw = localStorage.getItem('aether_auth_user');
      const token = localStorage.getItem(authConfig.tokenKey);
      if (userRaw && token) {
        const user = JSON.parse(userRaw);
        if (user.role === 'ADMIN' || user.role === 'SUPERADMIN' || user.role === 'SUPER_ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        }
      }
    } catch {
      // ignore JSON errors
    }
  }, [navigate]);

  const handleStoreTokens = (result: AdminLoginResult) => {
    if (!result.tokens || !result.user) return;

    localStorage.setItem(authConfig.tokenKey, result.tokens.accessToken);
    localStorage.setItem('aether-auth-token', result.tokens.accessToken);
    localStorage.setItem('auth_token', result.tokens.accessToken);
    if (result.tokens.refreshToken) {
      localStorage.setItem(authConfig.refreshTokenKey, result.tokens.refreshToken);
    }
    localStorage.setItem('aether_auth_user', JSON.stringify(result.user));

    // Notify auth subsystems of session update
    window.dispatchEvent(new CustomEvent('aether-auth-updated'));

    const from = (location.state as { from?: string } | null)?.from;
    const destination = from && from.startsWith('/admin') ? from : '/admin/dashboard';
    navigate(destination, { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (mfaTicket) {
        // Step 2: Verify MFA Challenge
        const res = await adminApi.verifyMfa({
          mfaTicket,
          code: mfaCode,
        });

        if (res.tokens && res.user) {
          handleStoreTokens(res);
        } else {
          setErrorMessage('MFA verification could not be completed.');
        }
      } else {
        // Step 1: Admin Credentials Check
        const res = await adminApi.login({
          email,
          password,
        });

        if (res.mfaRequired && res.mfaTicket) {
          setMfaTicket(res.mfaTicket);
          setErrorMessage(null);
        } else if (res.tokens && res.user) {
          handleStoreTokens(res);
        } else {
          setErrorMessage('Invalid administrative credentials or unauthorized account.');
        }
      }
    } catch (err: any) {
      if (err?.status === 429) {
        setErrorMessage('Too many login attempts. Please wait a few minutes before retrying.');
      } else {
        const msg =
          err?.response?.data?.error?.message ||
          err?.data?.error?.message ||
          'Invalid administrative credentials or unauthorized account.';
        setErrorMessage(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 selection:bg-cyan-500/30 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden">
        <div className="h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md">
            <AetherSymbol size={32} />
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/40 px-3 py-1 text-xs font-semibold tracking-wider text-cyan-400">
            <Shield className="h-3.5 w-3.5" />
            <span>AETHER SECURITY ZONE</span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Admin Portal
          </h1>
          <p className="mt-1.5 text-xs text-slate-400">
            Authorized Personnel Only — All Access Is Monitored & Audited
          </p>
        </div>

        {/* Form Container */}
        <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-7 shadow-2xl backdrop-blur-xl sm:p-8">
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-300"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!mfaTicket ? (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="admin-email" className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Administrator Email
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@aether.internal"
                    className="block w-full rounded-lg border border-slate-800 bg-slate-950/90 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-medium uppercase tracking-wider text-slate-300"
                >
                  Passphrase
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full rounded-lg border border-slate-800 bg-slate-950/90 px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Authenticate Access</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/30 p-3 text-xs text-indigo-300">
                <div className="flex items-center gap-2 font-semibold">
                  <KeyRound className="h-4 w-4 text-indigo-400" />
                  <span>Two-Factor Authentication Required</span>
                </div>
                <p className="mt-1 text-slate-400">
                  Enter the 6-digit TOTP security code from your authenticator application or an emergency recovery code.
                </p>
              </div>

              <div>
                <label
                  htmlFor="mfa-code"
                  className="block text-xs font-medium uppercase tracking-wider text-slate-300"
                >
                  Verification Code
                </label>
                <input
                  id="mfa-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  autoFocus
                  disabled={isLoading}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                  placeholder="123456"
                  maxLength={16}
                  className="mt-1.5 block w-full tracking-widest text-center rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 font-mono text-lg text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMfaTicket(null);
                    setMfaCode('');
                  }}
                  className="w-1/3 rounded-lg border border-slate-800 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || mfaCode.trim().length < 6}
                  className="flex w-2/3 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Security Notice */}
          <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
            <p className="text-[11px] leading-relaxed text-slate-500">
              Registration is prohibited in this portal. To bootstrap initial administrative access, run the documented CLI utility:{' '}
              <code className="rounded bg-slate-950 px-1 py-0.5 font-mono text-cyan-400">npm run admin:bootstrap</code>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-4 text-center">
          <a
            href="/login"
            className="text-xs text-slate-400 transition-colors hover:text-cyan-400"
          >
            ← Return to standard application login
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
