import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { WelcomeChoicePage } from '../auth/WelcomeChoicePage';
import { HomePage } from '../home/HomePage';

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

vi.mock('@/api/client', () => ({
  apiClient: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

vi.mock('@/services/aiService', () => ({
  aiService: {
    isAiEnabled: () => true,
  },
}));

vi.mock('@/workspace/calendar/store/eventStore', () => {
  const state = {
    events: [],
    fetchEvents: vi.fn(),
  };
  const hook = (selector?: (s: typeof state) => any) => (selector ? selector(state) : state);
  hook.getState = () => state;
  return { useEventStore: hook };
});

vi.mock('@/projects/tasks/taskservice', () => ({
  taskService: {
    getTasks: vi.fn().mockResolvedValue({ tasks: [], total: 0 }),
  },
}));

vi.mock('@/workspace/recent-files/recentfilesservices', () => ({
  recentFilesService: {
    getRecentFiles: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('@/workspace/favorites/favoritesservice', () => ({
  favoritesService: {
    getFavorites: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('@/workspace/productivity-hub/productivityservice', () => ({
  productivityService: {
    getStats: vi.fn().mockResolvedValue({
      focusMinutesToday: 0,
      productivityScore: 0,
    }),
  },
}));

const LocationDisplay: React.FC = () => {
  const location = useLocation();
  return <div data-testid="current-location">{location.pathname}</div>;
};

describe('Targeted UI Fixes: Welcome/Choice Page & Workspace (/app)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('CHANGE 1: Back Arrow Removal on Welcome/Choice Page', () => {
    it('TEST 1: The Welcome/Choice page no longer displays the back arrow button', () => {
      render(
        <MemoryRouter initialEntries={['/welcome']}>
          <WelcomeChoicePage />
        </MemoryRouter>,
      );

      // Verify no back arrow button exists
      expect(screen.queryByRole('button', { name: /go back/i })).toBeNull();
      expect(screen.queryByTestId('wc-back-button')).toBeNull();
      const backButtons = screen.queryAllByRole('button', { name: /back/i });
      expect(backButtons).toHaveLength(0);
    });
  });

  describe('CHANGE 2: Trust-Based Quotations on Welcome/Choice Page', () => {
    it('TEST 2: Both quotations appear above the AETHER logo with exact text and proper class hierarchy', () => {
      const { container } = render(
        <MemoryRouter initialEntries={['/welcome']}>
          <WelcomeChoicePage />
        </MemoryRouter>,
      );

      // First line
      const quotePrimary = screen.getByText('We believe trust is earned through actions, not promises.');
      expect(quotePrimary).toBeDefined();
      expect(quotePrimary.classList.contains('wc-quote-primary')).toBe(true);

      // Second line
      const quoteSecondary = screen.getByText(
        'Your journey, your choices, your progress—with AETHER by your side.',
      );
      expect(quoteSecondary).toBeDefined();
      expect(quoteSecondary.classList.contains('wc-quote-secondary')).toBe(true);

      // Verify ordering: quotations appear ABOVE the logo
      const quotesWrapper = container.querySelector('.wc-quotes');
      const logoRow = container.querySelector('.wc-logo-row');
      expect(quotesWrapper).not.toBeNull();
      expect(logoRow).not.toBeNull();

      if (quotesWrapper && logoRow) {
        expect(
          quotesWrapper.compareDocumentPosition(logoRow) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
      }
    });

    it('TEST 3: Welcome page maintains responsive card structure and personalized greeting', () => {
      render(
        <MemoryRouter initialEntries={['/welcome']}>
          <WelcomeChoicePage />
        </MemoryRouter>,
      );

      expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Welcome back, Vamsi!');
      expect(screen.getByText('AETHER')).toBeDefined();
      expect(screen.getByRole('listitem', { name: /open to workspace/i })).toBeDefined();
      expect(screen.getByRole('listitem', { name: /explore your aether/i })).toBeDefined();
      expect(screen.getByRole('listitem', { name: /continue last session/i })).toBeDefined();
    });

    it('TEST 4: Clicking Open to Workspace still opens the original workspace (/app)', async () => {
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
            <Route path="/app" element={<div data-testid="workspace-view">Original Workspace</div>} />
          </Routes>
        </MemoryRouter>,
      );

      const workspaceCard = screen.getByRole('listitem', { name: /open to workspace/i });
      fireEvent.click(workspaceCard);

      expect(await screen.findByTestId('workspace-view')).toBeDefined();
    });
  });

  describe('CHANGE 3: Workspace (/app) UI Cleanup', () => {
    it('TEST 5: The top-level "YOUR AETHER" button is no longer displayed beside Ask AI', () => {
      render(
        <MemoryRouter initialEntries={['/app']}>
          <HomePage />
        </MemoryRouter>,
      );

      // Verify "Ask AI" button in header IS present
      const askAiButton = screen.getByRole('link', { name: /^Ask AI$/i });
      expect(askAiButton).toBeDefined();
      expect(askAiButton.getAttribute('href')).toBe('/app/ai/assistant');

      // Verify the top-level button "YOUR AETHER" with title "Launch YOUR AETHER experience" is NOT rendered
      expect(screen.queryByTitle('Launch YOUR AETHER experience')).toBeNull();
    });

    it('TEST 6: The Experience YOUR AETHER banner and Explore YOUR AETHER button are no longer displayed', () => {
      render(
        <MemoryRouter initialEntries={['/app']}>
          <HomePage />
        </MemoryRouter>,
      );

      // Verify banner heading is gone
      expect(screen.queryByText('Experience YOUR AETHER')).toBeNull();

      // Verify "NEW EXPERIENCE" badge is gone
      expect(screen.queryByText('NEW EXPERIENCE')).toBeNull();

      // Verify supporting description is gone
      expect(
        screen.queryByText(
          /Switch to the new futuristic app-launcher experience with quick access to all AI tools/i,
        ),
      ).toBeNull();

      // Verify "Explore YOUR AETHER" button is gone from banner
      expect(screen.queryByRole('link', { name: /explore your aether/i })).toBeNull();
    });

    it('TEST 7: All other original workspace controls and features continue working', () => {
      render(
        <MemoryRouter initialEntries={['/app']}>
          <HomePage />
        </MemoryRouter>,
      );

      // Header controls remain
      expect(screen.getByTitle('Refresh dashboard telemetry')).toBeDefined();
      expect(screen.getByRole('link', { name: /^Ask AI$/i })).toBeDefined();

      // Greeting hero remains
      expect(screen.getByText(/Vamsi/i)).toBeDefined();
    });
  });
});
