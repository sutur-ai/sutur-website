import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const page = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

function readIfExists(path: string) {
  const url = new URL(path, import.meta.url);
  return existsSync(url) ? readFileSync(url, 'utf8') : '';
}

describe('homepage narrative sections', () => {
  it('frames the lighter Why us statement with corner quote marks', () => {
    const whyUs = readIfExists('../src/components/sections/WhyUs.tsx');

    expect(page).toContain("import { WhyUs } from '@/components/sections/WhyUs'");
    expect(page).toContain('<WhyUs />');
    expect(page).not.toContain('<AgentActionDemo />');
    expect(whyUs).toContain('id="why-us"');
    expect(whyUs).toContain('Why us<SignalDot />');
    expect(whyUs).toContain('<blockquote className="why-us-quote">');
    expect(whyUs).toContain('We start with how your team actually works');
    expect(whyUs).toContain('why-us-quote-mark is-open');
    expect(whyUs).toContain('why-us-quote-mark is-close');
    expect(css).toMatch(/\.why-us blockquote p\s*{[^}]*font-weight:\s*var\(--weight-bold\)/s);
    expect(css).toMatch(/\.why-us-quote-mark\s*{[^}]*color:\s*var\(--active-orange\)/s);
    expect(css).toMatch(/\.why-us-quote-mark\.is-open\s*{[^}]*top:\s*0[^}]*left:\s*0/s);
    expect(css).toMatch(/\.why-us-quote-mark\.is-close\s*{[^}]*right:\s*0[^}]*bottom:\s*0/s);
  });

  it('removes the homepage Team section and adds three explicit placeholder reviews', () => {
    const reviews = readIfExists('../src/components/sections/Reviews.tsx');
    const whyUs = page.indexOf('<WhyUs />');
    const reviewSection = page.indexOf('<Reviews />');
    const booking = page.indexOf('className="booking-section scroll-section surface-soft"');

    expect(page).toContain("import { Reviews } from '@/components/sections/Reviews'");
    expect(page).not.toContain('className="section team scroll-section surface-ink"');
    expect(reviewSection).toBeGreaterThan(whyUs);
    expect(booking).toBeGreaterThan(reviewSection);
    expect(reviews).toContain('id="reviews"');
    expect(reviews).toContain('Reviews<SignalDot />');
    expect(reviews).toContain('These are layout placeholders');
    expect(reviews).toContain('const reviews = [');
    expect(reviews).toContain("featured: true");
    expect(reviews).toContain('review-card${review.featured ? \' is-featured\' : \'\'}');
    expect(reviews).toContain('className="review-avatar"');
    expect(reviews).toContain('className="review-company"');
    expect(reviews).toContain('className="review-position"');
    expect(reviews.match(/name: '/g)).toHaveLength(3);
    expect(reviews.match(/company: '/g)).toHaveLength(3);
    expect(reviews.match(/position: '/g)).toHaveLength(3);
    expect(reviews.match(/review: '/g)).toHaveLength(3);
    expect(reviews).not.toMatch(/★★★★★|five stars/);
    expect(css).toMatch(/\.review-card\.is-featured\s*{[^}]*transform:\s*scale\(1\.04\)/s);
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
