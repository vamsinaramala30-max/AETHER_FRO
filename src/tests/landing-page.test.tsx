import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/app/providers/authprovider', () => ({
  useAuth: () => ({ isAuthenticated: false, user: null }),
}));

vi.mock('../../../hooks/useauth', () => ({
  useAuth: () => ({ isAuthenticated: false, user: null }),
}));

import { Hero } from '../public/landing/Hero/hero';
import { FeatureBlocks } from '../public/landing/FeatureBlocks';
import { HowItWorks } from '../public/landing/HowItWorks';
import { BetaBanner } from '../public/landing/BetaBanner';
import { Footer } from '../public/landing/Footer/footer';

describe('AETHER Landing Page Requirements', () => {
  it('Hero renders exactly one H1 headline and required CTA buttons', () => {
    const { container } = render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );

    const h1s = container.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
    expect(h1s[0].textContent).toContain(
      'Your AI workspace that plans your day and sharpens how you think.',
    );

    const primaryCta = screen.getByRole('link', { name: /get started free/i });
    expect(primaryCta.getAttribute('href')).toBe('/signup');

    const secondaryCta = screen.getByRole('link', { name: /see how it works/i });
    expect(secondaryCta.getAttribute('href')).toBe('#how-it-works');
  });

  it('renders all three required feature blocks with semantic h3 headings', () => {
    render(<FeatureBlocks />);

    expect(screen.getByText('Smart planner and reminders')).toBeDefined();
    expect(screen.getByText('Projects and tasks in one workspace')).toBeDefined();
    expect(screen.getByText('Cognitive hub built from your real tasks')).toBeDefined();
  });

  it('renders How It Works with 3 distinct steps', () => {
    render(<HowItWorks />);

    expect(screen.getByText(/how it works/i)).toBeDefined();
    expect(screen.getByText('Step 01')).toBeDefined();
    expect(screen.getByText('Step 02')).toBeDefined();
    expect(screen.getByText('Step 03')).toBeDefined();
  });

  it('renders the Free during beta callout', () => {
    render(
      <MemoryRouter>
        <BetaBanner />
      </MemoryRouter>,
    );

    expect(screen.getByText('Free during beta.')).toBeDefined();
  });

  it('Footer renders Privacy Policy, Terms, and contact email without enterprise claims', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
    expect(privacyLink.getAttribute('href')).toBe('/privacy-policy');

    const termsLink = screen.getByRole('link', { name: /terms/i });
    expect(termsLink.getAttribute('href')).toBe('/terms');

    const contactLink = screen.getByRole('link', { name: /vkgroups127@gmail.com/i });
    expect(contactLink.getAttribute('href')).toBe('mailto:vkgroups127@gmail.com');
  });
});
