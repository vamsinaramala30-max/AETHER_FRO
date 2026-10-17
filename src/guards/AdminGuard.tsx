import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authcontext';
import { isAdminUser } from '../permissions/access';
import { authConfig } from '../config/auth.config';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

export interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children, fallback }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Also check stored token and user as backup to prevent race conditions during refresh
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem(authConfig.tokenKey) : null;
  const storedUserRaw = typeof window !== 'undefined' ? localStorage.getItem('aether_auth_user') : null;
  let storedUserRole = '';
  if (storedUserRaw) {
    try {
      storedUserRole = JSON.parse(storedUserRaw)?.role || '';
    } catch {
      // ignore parse error
    }
  }

  const isRoleAdmin = (r?: string) => {
    if (!r) return false;
    const upper = r.toUpperCase();
    return upper === 'ADMIN' || upper === 'SUPERADMIN' || upper === 'SUPER_ADMIN';
  };

  const hasAdmin =
    (isAuthenticated && user && (isAdminUser({ role: user.role, permissions: user.permissions }) || isRoleAdmin(user.role))) ||
    (Boolean(storedToken) && isRoleAdmin(storedUserRole));

  if (isLoading && !hasAdmin) {
    return fallback !== undefined && fallback !== null ? (
      <>{fallback}</>
    ) : (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400 font-mono text-xs"
        aria-busy="true"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <span>Verifying administrative authorization...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !storedToken) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (!hasAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-950/40 text-red-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-white">Administrator Access Required</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            You are signed in as a standard user. Administrative privileges are strictly enforced.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <a
              href="/admin/login"
              className="flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign in with Administrator Account</span>
            </a>
            <a
              href="/welcome"
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Application</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
