import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { WelcomeChoicePage } from '../auth/WelcomeChoicePage';
import { LoginPage } from '../auth/loginpage';
import { SignupPage } from '../auth/signinpage';
import { AuthSuccessPage } from '../auth/AuthSuccessPage';
import { authService } from '../auth/authservice';
import { ProtectedGuard } from '../guards/ProtectedGuard';
import { GuestGuard } from '../guards/GuestGuard';

let mockAuthState: {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
    displayName?: string;
    [key: string]: unknown;
  } | null;
} = {
  isAuthenticated: true,
  isLoading: false,
  user: {
    id: 'usr-vamsi-1',
    email: 'vamsi@aether.ai',
    firstName: 'Vamsi',
    lastName: 'K',
    displayName: 'Vamsi',
  },
};

vi.mock('@/app/providers/authprovider', () => ({
  useAuth: () => mockAuthState,
}));

vi.mock('../hooks/useauth', () => ({
  useAuth: () => mockAuthState,
}));

const LocationDisplay: React.FC = () => {
  const location = useLocation();
  return <div data-testid="current-location">{location.pathname}</div>;
};

describe('AETHER Welcome / Choice Page UI & Authentication Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockAuthState = {
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: 'usr-vamsi-1',
        email: 'vamsi@aether.ai',
        firstName: 'Vamsi',
        lastName: 'K',
        displayName: 'Vamsi',
      },
    };
  });

  describe('WelcomeChoicePage UI Fidelity', () => {
    it('renders the complete futuristic header, logo, personalized heading, and subtitle', () => {
      render(
        <MemoryRouter initialEntries={['/welcome']}>
          <WelcomeChoicePage />
        </MemoryRouter>,
      );

      // AETHER Logo & Wordmark
      expect(screen.getByText('AETHER')).toBeDefined();

      // Heading with personalized user name
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.textContent).toContain('Welcome back, Vamsi!');

      // Subtitle
      expect(
        screen.getByText('Choose how you want to continue your AETHER journey.'),
      ).toBeDefined();

      // Top-left back button is removed from WelcomeChoicePage
      expect(screen.queryByRole('button', { name: /go back/i })).toBeNull();
      expect(screen.queryByTestId('wc-back-button')).toBeNull();

      // Trust-based quotations appear above AETHER logo
      const quotePrimary = screen.getByText('We believe trust is earned through actions, not promises.');
      expect(quotePrimary).toBeDefined();
      expect(quotePrimary.className).toContain('wc-quote-primary');

      const quoteSecondary = screen.getByText(
        'Your journey, your choices, your progress—with AETHER by your side.',
      );
      expect(quoteSecondary).toBeDefined();
      expect(quoteSecondary.className).toContain('wc-quote-secondary');
    });

    it('renders the three interactive cards with exact titles and descriptions', () => {
      render(
        <MemoryRouter initialEntries={['/welcome']}>
          <WelcomeChoicePage />
        </MemoryRouter>,
      );

      // Card 1: Open to Workspace
      const workspaceCard = screen.getByRole('listitem', { name: /open to workspace/i });
      expect(workspaceCard).toBeDefined();
      expect(
        screen.getByText(
          'Access your original AETHER workspace with all existing features and familiar interface.',
        ),
      ).toBeDefined();

      // Card 2: Explore YOUR AETHER
      const launcherCard = screen.getByRole('listitem', { name: /explore your aether/i });
      expect(launcherCard).toBeDefined();
      expect(
        screen.getByText(
          'Experience the new, futuristic app launcher with modern design and enhanced productivity tools.',
        ),
      ).toBeDefined();

      // Card 3: Continue Last Session
      const sessionCard = screen.getByRole('listitem', { name: /continue last session/i });
      expect(sessionCard).toBeDefined();
      expect(
        screen.getByText('Resume your previous activity from where you left off.'),
      ).toBeDefined();
    });

    it('clicking "Open to Workspace" card navigates to /app', async () => {
      render(
        <MemoryRouter initialEntries={['/welcome']}>
          <Routes>
            <Route
              path="/welcome"
              element={
                <>
                  <WelcomeChoicePage />
                  <LocationDisplay />
                </>
              }
            />
            <Route path="/app" element={<div data-testid="workspace-view">Workspace Page</div>} />
          </Routes>
        </MemoryRouter>,
      );

      const workspaceCard = screen.getByRole('listitem', { name: /open to workspace/i });
      fireEvent.click(workspaceCard);

      expect(await screen.findByTestId('workspace-view')).toBeDefined();
    });

    it('clicking "Explore YOUR AETHER" card navigates to /app/your-aether', async () => {
      render(
        <MemoryRouter initialEntries={['/welcome']}>
          <Routes>
            <Route
              path="/welcome"
              element={
                <>
                  <WelcomeChoicePage />
                  <LocationDisplay />
                </>
              }
            />
            <Route
              path="/app/your-aether"
              element={<div data-testid="launcher-view">Launcher Page</div>}
            />
          </Routes>
        </MemoryRouter>,
      );

      const launcherCard = screen.getByRole('listitem', { name: /explore your aether/i });
      fireEvent.click(launcherCard);

      expect(await screen.findByTestId('launcher-view')).toBeDefined();
    });

    it('clicking "Continue Last Session" restores saved session or falls back to /app', async () => {
      localStorage.setItem(
        'aether_last_session_usr-vamsi-1',
        JSON.stringify({ path: '/app/projects/tasks', ts: Date.now() }),
      );

      render(
        <MemoryRouter initialEntries={['/welcome']}>
          <Routes>
            <Route
              path="/welcome"
              element={
                <>
                  <WelcomeChoicePage />
                  <LocationDisplay />
                </>
              }
            />
            <Route
              path="/app/projects/tasks"
              element={<div data-testid="tasks-view">Restored Tasks Page</div>}
            />
          </Routes>
        </MemoryRouter>,
      );

      const sessionCard = screen.getByRole('listitem', { name: /continue last session/i });
      fireEvent.click(sessionCard);

      expect(await screen.findByTestId('tasks-view')).toBeDefined();
    });
  });

  describe('Authentication Redirect Invariants', () => {
    it('LoginPage redirects every authenticated user to /welcome upon successful login', async () => {
      vi.spyOn(authService, 'signIn').mockResolvedValueOnce({
        user: { id: 'usr-1', email: 'vamsi@aether.ai', role: 'USER' } as any,
        error: null,
      });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/welcome"
              element={<div data-testid="welcome-landed">Welcome Choice Page</div>}
            />
          </Routes>
        </MemoryRouter>,
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const submitButton = screen.getByRole('button', { name: /^sign in$/i });

      fireEvent.change(emailInput, { target: { value: 'vamsi@aether.ai' } });
      fireEvent.change(passwordInput, { target: { value: 'SecretPassword123!' } });
      fireEvent.click(submitButton);

      expect(await screen.findByTestId('welcome-landed')).toBeDefined();
    });

    it('SignupPage redirects new registrations to /welcome upon successful registration', async () => {
      vi.spyOn(authService, 'signUp').mockResolvedValueOnce({
        user: { id: 'usr-new-1', email: 'newuser@aether.ai', role: 'USER' } as any,
        error: null,
      });

      render(
        <MemoryRouter initialEntries={['/signup']}>
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/welcome"
              element={<div data-testid="welcome-landed">Welcome Choice Page</div>}
            />
          </Routes>
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Vamsi' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'K' } });
      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: 'newuser@aether.ai' },
      });
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'Password123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123!' },
      });

      const registerBtn = screen.getByRole('button', { name: /register instance/i });
      fireEvent.click(registerBtn);

      expect(await screen.findByTestId('welcome-landed')).toBeDefined();
    });

    it('ProtectedGuard blocks unauthenticated users and redirects them to /login', () => {
      mockAuthState = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };

      render(
        <MemoryRouter initialEntries={['/welcome']}>
          <Routes>
            <Route
              path="/welcome"
              element={
                <ProtectedGuard>
                  <div data-testid="protected-content">Secret Welcome Screen</div>
                </ProtectedGuard>
              }
            />
            <Route path="/login" element={<div data-testid="login-view">Login Required</div>} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('login-view')).toBeDefined();
      expect(screen.queryByTestId('protected-content')).toBeNull();
    });

    it('ProtectedGuard displays fallback while auth state is loading, preventing premature redirect', () => {
      mockAuthState = {
        isAuthenticated: false,
        isLoading: true,
        user: null,
      };

      render(
        <MemoryRouter initialEntries={['/welcome']}>
          <ProtectedGuard fallback={<div data-testid="loading-spinner">Verifying...</div>}>
            <div data-testid="protected-content">Secret Welcome Screen</div>
          </ProtectedGuard>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('loading-spinner')).toBeDefined();
      expect(screen.queryByTestId('protected-content')).toBeNull();
    });

    it('GuestGuard redirects authenticated users to /welcome', () => {
      mockAuthState = {
        isAuthenticated: true,
        isLoading: false,
        user: { id: 'usr-1', email: 'vamsi@aether.ai', firstName: 'Vamsi' } as any,
      };

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route
              path="/login"
              element={
                <GuestGuard>
                  <div data-testid="guest-login-form">Login Form</div>
                </GuestGuard>
              }
            />
            <Route
              path="/welcome"
              element={<div data-testid="welcome-view">Welcome Choice Screen</div>}
            />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('welcome-view')).toBeDefined();
      expect(screen.queryByTestId('guest-login-form')).toBeNull();
    });

    it('Google OAuth callback via AuthSuccessPage redirects to /welcome upon successful authentication', async () => {
      vi.spyOn(authService, 'handleGoogleCallbackToken').mockResolvedValueOnce({
        user: { id: 'usr-google-1', email: 'vamsi@aether.ai', firstName: 'Vamsi' } as any,
        error: null,
      });

      render(
        <MemoryRouter initialEntries={['/auth/success?token=valid-google-jwt-token']}>
          <Routes>
            <Route path="/auth/success" element={<AuthSuccessPage />} />
            <Route
              path="/welcome"
              element={<div data-testid="welcome-landed">Welcome Choice Page</div>}
            />
          </Routes>
        </MemoryRouter>,
      );

      expect(await screen.findByTestId('welcome-landed', {}, { timeout: 2500 })).toBeDefined();
    });

    it('Google OAuth callback via AuthSuccessPage extracts token securely from URL hash fragment (AUDIT-HIGH-01)', async () => {
      vi.spyOn(authService, 'handleGoogleCallbackToken').mockResolvedValueOnce({
        user: { id: 'usr-google-hash', email: 'vamsi@aether.ai', firstName: 'Vamsi' } as any,
        error: null,
      });

      window.location.hash = '#token=valid-hash-jwt-token&refreshToken=valid-hash-refresh-token';

      render(
        <MemoryRouter initialEntries={['/auth/success']}>
          <Routes>
            <Route path="/auth/success" element={<AuthSuccessPage />} />
            <Route
              path="/welcome"
              element={<div data-testid="welcome-landed-hash">Welcome Choice Page Hash</div>}
            />
          </Routes>
        </MemoryRouter>,
      );

      expect(await screen.findByTestId('welcome-landed-hash', {}, { timeout: 2500 })).toBeDefined();
      expect(authService.handleGoogleCallbackToken).toHaveBeenCalledWith(
        'valid-hash-jwt-token',
        'valid-hash-refresh-token',
      );
      window.location.hash = '';
    });

    it('clicking "Continue Last Session" restores launcher destination when user previously used launcher', async () => {
      localStorage.setItem(
        'aether_last_session_usr-vamsi-1',
        JSON.stringify({ path: '/app/your-aether', ts: Date.now() }),
      );

      render(
        <MemoryRouter initialEntries={['/welcome']}>
          <Routes>
            <Route path="/welcome" element={<WelcomeChoicePage />} />
            <Route
              path="/app/your-aether"
              element={<div data-testid="launcher-view">Launcher Page</div>}
            />
          </Routes>
        </MemoryRouter>,
      );

      const sessionCard = screen.getByRole('listitem', { name: /continue last session/i });
      fireEvent.click(sessionCard);

      expect(await screen.findByTestId('launcher-view')).toBeDefined();
    });

    it('clicking "Continue Last Session" restores module inside launcher when previously visited', async () => {
      localStorage.setItem(
        'aether_last_session_usr-vamsi-1',
        JSON.stringify({ path: '/ya/ai/assistant', ts: Date.now() }),
      );

      render(
        <MemoryRouter initialEntries={['/welcome']}>
          <Routes>
            <Route path="/welcome" element={<WelcomeChoicePage />} />
            <Route
              path="/ya/ai/assistant"
              element={<div data-testid="ya-assistant-view">Launcher AI Assistant</div>}
            />
          </Routes>
        </MemoryRouter>,
      );

      const sessionCard = screen.getByRole('listitem', { name: /continue last session/i });
      fireEvent.click(sessionCard);

      expect(await screen.findByTestId('ya-assistant-view')).toBeDefined();
    });
  });
});
