// frontend/src/auth/AuthSuccessPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from './authservice';
import { AuthLayout } from './authlayout';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

export const AuthSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('Finalizing Google Authentication...');

  useEffect(() => {
    // Parse hash fragment first (RFC 6749 compliant for SPAs, never sent to server), fallback to searchParams if needed
    const rawHash = typeof window !== 'undefined' && window.location.hash ? window.location.hash : '';
    const hashString = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
    const hashParams = new URLSearchParams(hashString);

    const token = hashParams.get('token') || searchParams.get('token');
    const refreshToken = hashParams.get('refreshToken') || searchParams.get('refreshToken');
    const paramError = hashParams.get('error') || searchParams.get('error');

    // Immediately clean up sensitive tokens from the browser URL bar and history state
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    if (paramError) {
      if (paramError === 'google_not_configured') {
        setError(
          'Google OAuth is not configured on the backend server. Please contact your system administrator.',
        );
      } else if (paramError === 'oauth_cancelled') {
        setError('Google sign in was cancelled.');
      } else {
        setError('Google OAuth authentication failed. Please try again.');
      }
      return;
    }

    if (!token) {
      setError('No authentication token received from Google OAuth redirect.');
      return;
    }

    let isSubscribed = true;

    const processToken = async () => {
      try {
        const { error: authError } = await authService.handleGoogleCallbackToken(
          token,
          refreshToken || undefined,
        );
        if (!isSubscribed) return;

        if (authError) {
          setError(authError.message || 'Failed to authenticate session using Google credentials.');
        } else {
          setStatusText('Authentication successful! Redirecting...');
          setTimeout(() => {
            if (isSubscribed) {
              navigate('/welcome', { replace: true });
            }
          }, 600);
        }
      } catch {
        if (isSubscribed) {
          setError('An unexpected error occurred during Google session initialization.');
        }
      }
    };

    void processToken();

    return () => {
      isSubscribed = false;
    };
  }, [searchParams, navigate]);

  return (
    <AuthLayout
      title="Google Authentication"
      subtitle={error ? 'Authentication Error' : 'Connecting your account'}
    >
      <div className="flex flex-col items-center justify-center py-6 text-center">
        {error ? (
          <div className="w-full space-y-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div
              role="alert"
              className="rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm font-medium text-red-400"
            >
              {error}
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
              {statusText.includes('successful') ? (
                <CheckCircle className="h-7 w-7 text-emerald-400" />
              ) : (
                <Loader2 className="h-7 w-7 animate-spin" />
              )}
            </div>
            <p className="text-sm font-medium text-slate-300">{statusText}</p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default AuthSuccessPage;
