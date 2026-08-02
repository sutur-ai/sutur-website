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
    expect(whyUs).toContain('We are a team of skilled engineers');
    expect(whyUs).toContain('why-us-quote-mark is-open');
    expect(whyUs).toContain('why-us-quote-mark is-close');
    expect(css).toMatch(/\.why-us blockquote p\s*{[^}]*font-weight:\s*var\(--weight-bold\)/s);
    expect(css).toMatch(/\.why-us-quote-mark\s*{[^}]*color:\s*var\(--active-orange\)/s);
    expect(css).toMatch(/\.why-us-quote-mark\.is-open\s*{[^}]*top:\s*0[^}]*left:\s*0/s);
    expect(css).toMatch(/\.why-us-quote-mark\.is-close\s*{[^}]*right:\s*0[^}]*bottom:\s*0/s);
  });

  it('credits the founders’ institutions in a band under Why us', () => {
    const founders = readIfExists('../src/components/sections/FoundersFrom.tsx');
    const whyUs = page.indexOf('<WhyUs />');
    const foundersSection = page.indexOf('<FoundersFrom />');
    const reviews = page.indexOf('<Reviews />');

    expect(page).toContain("import { FoundersFrom } from '@/components/sections/FoundersFrom'");
    expect(foundersSection).toBeGreaterThan(whyUs);
    expect(reviews).toBeGreaterThan(foundersSection);
    expect(founders).toContain('Founders from<SignalDot />');
    expect(founders).toContain('University of Toronto');
    expect(founders).toContain('UCLouvain');
    expect(founders).toContain('American University of Beirut');
    expect(founders).toContain('Boston Consulting Group');
    expect(founders.match(/logo: '\/brand\/founders\//g)).toHaveLength(4);
    // Every mark is named for screen readers rather than left as decoration.
    expect(founders).toContain('alt={institution.name}');
    // A snap stop here would strand a thin band in the middle of the viewport.
    expect(founders).not.toMatch(/className="[^"]*scroll-section/);
    expect(css).toMatch(/\.founders-from-label\s*{[^}]*letter-spacing:\s*var\(--tracking-label\)/s);
    expect(css).toMatch(/\.founders-from-list\s*{[^}]*flex-wrap:\s*wrap/s);
  });

  it('shows three real client identities without invented testimonial copy', () => {
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
    expect(reviews).not.toMatch(/[Pp]laceholder/);
    expect(css).not.toMatch(/\.review-placeholder/);
    expect(reviews).toContain('const reviews = [');
    expect(reviews).toContain("name: 'Charles Arbid'");
    expect(reviews).toContain("company: 'Retailinc'");
    expect(reviews).toContain("name: 'Ibrahim Jarkass'");
    expect(reviews).toContain("company: 'FixPro'");
    expect(reviews).toContain("name: 'Dr. Amin Chaptini'");
    expect(reviews).toContain("company: 'Chaptini Smile Clinic'");
    expect(reviews).toContain("position: 'Owner & Head Dentist'");
    expect(reviews).toContain('className="review-card"');
    expect(reviews).toContain('className="review-meta"');
    expect(reviews).toContain('className="review-avatar"');
    expect(reviews).toContain('className="review-company"');
    expect(reviews).toContain('className="review-position"');
    expect(reviews.match(/name: '/g)).toHaveLength(3);
    expect(reviews.match(/company: '/g)).toHaveLength(3);
    expect(reviews.match(/position: '/g)).toHaveLength(3);
    expect(reviews).not.toMatch(/review: '|<blockquote|★★★★★|five stars/);
    expect(css).not.toMatch(/\.review-card\.is-featured/);
    expect(css).toMatch(/\.review-grid\s*{[^}]*border-top:\s*1px solid var\(--border-strong\)/s);
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
    expect(faq).toContain('Do we need to use Odoo?');
    expect(faq).toContain('What happens after the discovery call?');
  });
});
