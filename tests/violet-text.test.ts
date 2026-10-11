import { readFileSync } from 'node:fs';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';

function declarations(file: string, selector: string) {
  const css = postcss.parse(readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8'));
  const result: Record<string, string> = {};
  css.walkRules(selector, rule => {
    rule.walkDecls(decl => { result[decl.prop] = decl.value; });
  });
  return result;
}

describe('small violet text contrast', () => {
  it('defines a separate text token while preserving the accent violet', () => {
    const tokens = declarations('app/theme.css', ':root');
    expect(tokens['--violet-text']).toBe('#7d5c9f');
    expect(tokens['--violet']).toBe('#906fb1');
  });

  it.each([
    ['app/globals.css', '.label'],
    ['components/booking/Booking.module.css', '.step'],
    ['components/capabilities/NightShift.module.css', '.ftime'],
    ['components/capabilities/MemoryTree.module.css', '.t-dec-k'],
    ['components/hero/Hero.module.css', '.rf-replay'],
  ])('%s %s uses the small-text token', (file, selector) => {
    expect(declarations(file, selector).color).toBe('var(--violet-text)');
  });

  it('preserves dark-section labels, large headings, and non-violet small text', () => {
    expect(declarations('app/globals.css', '.dark .label').color).toBe('rgba(234,209,229,.7)');
    expect(declarations('components/booking/Booking.module.css', '.heading :global(.label)').color).toBe('rgba(234,209,229,.7)');
    expect(declarations('components/hero/Hero.module.css', '.hero h1 em').color).toBe('var(--violet)');
    expect(declarations('components/sections/UseCases.module.css', '.ask-uses').color).toBe('var(--muted)');
  });
});
