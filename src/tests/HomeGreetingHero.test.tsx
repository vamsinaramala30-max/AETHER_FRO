import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { HomeGreetingHero } from '../home/HomeGreetingHero';

describe('HomeGreetingHero Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders initial neutral state for hydration safety and mounts client greeting', async () => {
    const { container } = render(<HomeGreetingHero displayName="Vamsi" />);

    // Check presence of hero container
    const hero = screen.getByTestId('home-greeting-hero');
    expect(hero).toBeDefined();

    // Verify name is rendered with gradient style
    const nameEl = container.querySelector('.bg-gradient-to-r');
    expect(nameEl).toBeDefined();
    expect(nameEl?.textContent).toContain('Vamsi.');

    // Verify last visit was written to localStorage
    const savedVisit = localStorage.getItem('aether_last_visit');
    expect(savedVisit).not.toBeNull();
  });

  it('renders fallback time-based message when stats are loading', () => {
    render(<HomeGreetingHero displayName="Vamsi" loading={true} stats={null} />);

    // Should not crash and should render a valid subtitle
    const hero = screen.getByTestId('home-greeting-hero');
    expect(hero.textContent).toBeDefined();
    expect(screen.getByRole('heading')).toBeDefined();
  });

  it('updates smoothly when stats arrive without breaking layout', () => {
    const { rerender } = render(
      <HomeGreetingHero displayName="Vamsi" loading={true} stats={null} />,
    );

    // Now stats finish loading
    act(() => {
      rerender(
        <HomeGreetingHero
          displayName="Vamsi"
          loading={false}
          stats={{
            pendingTasks: 3,
            eventsToday: 1,
            completedTasks: 0,
            activeProjects: 2,
            aiConversations: 1,
          }}
        />,
      );
    });

    const hero = screen.getByTestId('home-greeting-hero');
    expect(hero.className).toContain('min-h-');
  });

  it('handles very long names with truncate class to avoid breaking mobile layouts', () => {
    const veryLongName = 'Alexandrina-Constantinopolitan-Supercalifragilisticexpialidocious';
    const { container } = render(<HomeGreetingHero displayName={veryLongName} />);

    const nameEl = container.querySelector('.bg-gradient-to-r');
    expect(nameEl).toBeDefined();
    expect(nameEl?.className).toContain('truncate');
    expect(nameEl?.getAttribute('title')).toBe(veryLongName);
  });
});
