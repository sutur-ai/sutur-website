import { describe, expect, it } from 'vitest';
import { COUNTRIES } from '../src/lib/booking/countries';

describe('booking country list', () => {
  it('provides a complete, sorted, duplicate-free country dropdown', () => {
    expect(COUNTRIES.length).toBeGreaterThanOrEqual(240);
    expect(COUNTRIES).toContain('Lebanon');
    expect(COUNTRIES).toContain('United States');
    expect(COUNTRIES).toContain('United Kingdom');
    expect(COUNTRIES).toContain('United Arab Emirates');
    expect([...COUNTRIES].sort((a, b) => a.localeCompare(b))).toEqual(COUNTRIES);
    expect(new Set(COUNTRIES).size).toBe(COUNTRIES.length);
  });
});
