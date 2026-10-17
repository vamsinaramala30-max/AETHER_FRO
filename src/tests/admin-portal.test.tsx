import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdminLoginPage } from '../admin/AdminLoginPage';
import { AdminDashboardPage } from '../admin/AdminDashboardPage';
import { AdminGuard } from '../guards/AdminGuard';
import { adminApi } from '../api/admin.api';

let mockAuthContext = {
  user: null as any,
  isAuthenticated: false,
  isLoading: false,
};

vi.mock('../contexts/authcontext', () => ({
  useAuth: () => mockAuthContext,
}));

vi.mock('../components/branding/AetherLogo', () => ({
  AetherSymbol: ({ size }: { size?: number }) => <div data-testid="aether-symbol" style={{ width: size, height: size }} />,
}));

describe('AETHER Frontend Admin Portal Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    mockAuthContext = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    };
  });

  describe('1. AdminLoginPage Rendering & Authentication Flow', () => {
    it('renders admin login portal with security branding and credential fields', () => {
      render(
        <MemoryRouter>
          <AdminLoginPage />
        </MemoryRouter>,
      );

      expect(screen.getByText('Admin Portal')).toBeTruthy();
      expect(screen.getByText('AETHER SECURITY ZONE')).toBeTruthy();
      expect(screen.getByLabelText(/Administrator Email/i)).toBeTruthy();
      expect(screen.getByLabelText(/Passphrase/i)).toBeTruthy();
      expect(screen.getByRole('button', { name: /Authenticate Access/i })).toBeTruthy();
    });

    it('displays generic error message when admin login credentials are rejected', async () => {
      vi.spyOn(adminApi, 'login').mockRejectedValue({
        status: 401,
        response: {
          data: {
            error: {
              message: 'Invalid administrative credentials or unauthorized account.',
            },
          },
        },
      });

      render(
        <MemoryRouter>
          <AdminLoginPage />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/Administrator Email/i), {
        target: { value: 'intruder@external.net' },
      });
      fireEvent.change(screen.getByLabelText(/Passphrase/i), {
        target: { value: 'GuessPassword123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Authenticate Access/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Invalid administrative credentials or unauthorized account/i),
        ).toBeTruthy();
      });
    });

    it('switches to MFA challenge code input screen when 2FA is required', async () => {
      vi.spyOn(adminApi, 'login').mockResolvedValue({
        mfaRequired: true,
        mfaTicket: 'mock.mfa.ticket.jwt',
      });

      render(
        <MemoryRouter>
          <AdminLoginPage />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/Administrator Email/i), {
        target: { value: 'mfa.admin@aether.internal' },
      });
      fireEvent.change(screen.getByLabelText(/Passphrase/i), {
        target: { value: 'ValidPass#123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Authenticate Access/i }));

      await waitFor(() => {
        expect(screen.getByText(/Two-Factor Authentication Required/i)).toBeTruthy();
        expect(screen.getByLabelText(/Verification Code/i)).toBeTruthy();
        expect(screen.getByRole('button', { name: /Verify Code/i })).toBeTruthy();
      });
    });
  });

  describe('2. AdminGuard Access Control', () => {
    it('redirects unauthenticated users to /admin/login', () => {
      mockAuthContext = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

      render(
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route path="/admin/login" element={<div>Admin Login Screen</div>} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminGuard>
                  <div>Secret Admin Dashboard</div>
                </AdminGuard>
              }
            />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText('Admin Login Screen')).toBeTruthy();
      expect(screen.queryByText('Secret Admin Dashboard')).toBeNull();
    });

    it('displays access denied screen when a regular USER attempts to view admin zone', () => {
      mockAuthContext = {
        user: { id: 'usr-1', email: 'regular@aether.ai', role: 'user', permissions: [] },
        isAuthenticated: true,
        isLoading: false,
      };

      render(
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <AdminGuard>
            <div>Secret Admin Dashboard</div>
          </AdminGuard>
        </MemoryRouter>,
      );

      expect(screen.getByText('Administrator Access Required')).toBeTruthy();
      expect(screen.queryByText('Secret Admin Dashboard')).toBeNull();
      expect(screen.getByText(/Sign in with Administrator Account/i)).toBeTruthy();
    });

    it('renders protected child components when user holds ADMIN role', () => {
      mockAuthContext = {
        user: { id: 'adm-1', email: 'admin@aether.internal', role: 'admin', permissions: ['*'] },
        isAuthenticated: true,
        isLoading: false,
      };

      render(
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <AdminGuard>
            <div>Secret Admin Dashboard</div>
          </AdminGuard>
        </MemoryRouter>,
      );

      expect(screen.getByText('Secret Admin Dashboard')).toBeTruthy();
    });
  });

  describe('3. AdminDashboardPage Interface & Tab Navigation', () => {
    it('renders dashboard telemetry and navigation tabs', async () => {
      vi.spyOn(adminApi, 'getOverview').mockResolvedValue({
        users: {
          total: 42,
          active: 38,
          unverified: 2,
          suspended: 2,
          twoFactorEnabled: 12,
          admins: 3,
        },
        system: {
          nodeVersion: 'v20.18.0',
          memoryUsage: { rss: 100, heapTotal: 80, heapUsed: 50, external: 10 },
          uptimeSeconds: 7200,
          environment: 'production',
        },
        services: {
          database: { status: 'up', latencyMs: 4, version: 'PostgreSQL 16.4', provider: 'self-hosted-postgresql' },
          redis: { status: 'up' },
          aiModel: { status: 'up', endpoint: 'http://localhost:5002' },
          storage: { driver: 'local', status: 'ready' },
        },
        backups: {
          lastBackupTimestamp: new Date().toISOString(),
          lastRestoreVerificationTimestamp: null,
          status: 'healthy',
          evidenceFound: true,
          details: 'Verified backup archive present on disk.',
        },
        recentSecurityEvents: [],
      });

      render(
        <MemoryRouter>
          <AdminDashboardPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('System Status & Telemetry')).toBeTruthy();
        expect(screen.getByText('Total Users')).toBeTruthy();
        expect(screen.getByText('42')).toBeTruthy();
        expect(screen.getByText('PostgreSQL Engine')).toBeTruthy();
      });

      // Check tab switches
      expect(screen.getByRole('button', { name: /Users/i })).toBeTruthy();
      expect(screen.getByRole('button', { name: /Audit & Security/i })).toBeTruthy();
      expect(screen.getByRole('button', { name: /Database & Recovery/i })).toBeTruthy();
    });
  });
});
