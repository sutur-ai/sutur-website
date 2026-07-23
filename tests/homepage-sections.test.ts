import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const page = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

function readIfExists(path: string) {
  const url = new URL(path, import.meta.url);
  return existsSync(url) ? readFileSync(url, 'utf8') : '';
}

describe('homepage narrative sections', () => {
  it('replaces the agent demo with a simple Why us statement inside orange quote marks', () => {
    const whyUs = readIfExists('../src/components/sections/WhyUs.tsx');

    expect(page).toContain("import { WhyUs } from '@/components/sections/WhyUs'");
    expect(page).toContain('<WhyUs />');
    expect(page).not.toContain('<AgentActionDemo />');
    expect(whyUs).toContain('id="why-us"');
    expect(whyUs).toContain('Why us<SignalDot />');
    expect(whyUs).toContain('<blockquote className="why-us-quote">');
    expect(whyUs).toContain('We start with how your team actually works');
    expect(css).toMatch(/\.why-us-quote-mark\s*{[^}]*color:\s*var\(--active-orange\)/s);
    expect(css).toMatch(/@media \(max-width:\s*680px\)[\s\S]*\.why-us blockquote\.why-us-quote\s*{[^}]*grid-template-columns:\s*1fr/s);
    expect(css).toMatch(/@media \(max-width:\s*680px\)[\s\S]*\.why-us-quote-mark:last-child\s*{[^}]*justify-self:\s*end/s);
  });

  it('adds an honest Reviews section without invented ratings or identities', () => {
    const reviews = readIfExists('../src/components/sections/Reviews.tsx');
    const team = page.indexOf('className="section team scroll-section surface-ink"');
    const reviewSection = page.indexOf('<Reviews />');
    const booking = page.indexOf('className="booking-section scroll-section surface-soft"');

    expect(page).toContain("import { Reviews } from '@/components/sections/Reviews'");
    expect(reviewSection).toBeGreaterThan(team);
    expect(booking).toBeGreaterThan(reviewSection);
    expect(reviews).toContain('id="reviews"');
    expect(reviews).toContain('Reviews<SignalDot />');
    expect(reviews).toContain('We only publish feedback with client approval');
    expect(reviews).toContain('Client references are available on request');
    expect(reviews).not.toMatch(/★★★★★|five stars|—\s*[A-Z][a-z]+\s+[A-Z][a-z]+/);
  });

  it('adds an accessible Q&A section immediately before booking', () => {
    const faq = readIfExists('../src/components/sections/FaqSection.tsx');
    const reviews = page.indexOf('<Reviews />');
    const faqSection = page.indexOf('<FaqSection />');
    const booking = page.indexOf('className="booking-section scroll-section surface-soft"');

    expect(page).toContain("import { FaqSection } from '@/components/sections/FaqSection'");
    expect(faqSection).toBeGreaterThan(reviews);
    expect(booking).toBeGreaterThan(faqSection);
    expect(faq).toContain('id="questions"');
    expect(faq).toContain('Questions & answers<SignalDot />');
    expect(faq.match(/<details/g)).toHaveLength(4);
    expect(faq.match(/<summary/g)).toHaveLength(4);
    expect(faq.match(/<ExpandIcon \/>/g)).toHaveLength(4);
    expect(faq).toContain('Do we need to use Odoo already?');
    expect(faq).toContain('What happens after the discovery call?');
  });
});
