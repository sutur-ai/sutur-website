import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const homepageFiles = [
  '../src/app/page.tsx',
  '../src/components/sections/CompanyCapabilities.tsx',
  '../src/components/sections/WhyUs.tsx',
  '../src/components/sections/Reviews.tsx',
  '../src/components/sections/FaqSection.tsx',
  '../src/components/booking/Booking.tsx',
];

const sources = homepageFiles.map((path) => ({
  path,
  source: readFileSync(new URL(path, import.meta.url), 'utf8'),
}));

describe('site-wide square signal punctuation', () => {
  it('uses SignalDot instead of text periods in homepage display headings', () => {
    for (const { path, source } of sources) {
      const staticHeadings = source.match(/<h[1-3][^>]*>[^\n]*<\/h[1-3]>/g) ?? [];
      for (const heading of staticHeadings) {
        expect(heading, `${path} heading`).not.toMatch(/\.(?=<|\s)/);
      }
    }

    const combined = sources.map(({ source }) => source).join('\n');
    expect(combined).toContain('Connect your business<SignalDot />');
    expect(combined).toContain('One connected business<SignalDot />');
    expect(combined).toContain('Why us<SignalDot />');
    expect(combined).toContain('Reviews<SignalDot />');
    expect(combined).toContain('Questions & answers<SignalDot />');
    expect(combined).toContain('Choose a time that works<SignalDot />');
  });
});
