import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const routeNames = ['product', 'solutions', 'pricing', 'about', 'insights', 'contact'];
const routes = routeNames.map((route) => ({
  route,
  source: readFileSync(new URL(`../src/app/${route}/page.tsx`, import.meta.url), 'utf8'),
}));
const handoff = readFileSync(
  new URL('../src/components/sections/AgentHandoffMock.tsx', import.meta.url),
  'utf8',
);

describe('site-wide square signal punctuation', () => {
  it('uses SignalDot instead of text periods in display headings on every route', () => {
    for (const { route, source } of routes) {
      expect(source, route).toContain("import { SignalDot } from '@/components/ui/SignalDot'");

      const pageHeroTitle = source.split('\n').find((line) => line.includes('title={'));
      expect(pageHeroTitle, `${route} PageHero title`).toContain('<SignalDot />');
      expect(pageHeroTitle, `${route} PageHero title`).not.toMatch(/\.(?=<|\s)/);

      const staticHeadings = source.match(/<h[1-3][^>]*>[^\n]*<\/h[1-3]>/g) ?? [];
      for (const heading of staticHeadings) {
        expect(heading, `${route} heading`).not.toMatch(/\.(?=<|\s)/);
      }
    }

    expect(routes.find(({ route }) => route === 'product')?.source).not.toMatch(/title:\s*'[^']*\.'/);
    expect(handoff).toContain('12 follow-ups drafted<SignalDot />');
  });
});
