import { describe, expect, it } from 'vitest';
import { getCalendlyEmbedUrl } from '../src/lib/booking/calendly';

describe('Calendly embed URL', () => {
  it('adds the inline embed theme without discarding existing parameters', () => {
    const result = getCalendlyEmbedUrl(
      'https://calendly.com/sutur/discovery?month=2026-08',
    );
    const url = new URL(result ?? '');

    expect(url.origin).toBe('https://calendly.com');
    expect(url.pathname).toBe('/sutur/discovery');
    expect(url.searchParams.get('month')).toBe('2026-08');
    expect(url.searchParams.get('embed_type')).toBe('Inline');
    expect(url.searchParams.get('hide_gdpr_banner')).toBe('1');
    expect(url.searchParams.get('background_color')).toBe('fdfafc');
    expect(url.searchParams.get('text_color')).toBe('3b1447');
    expect(url.searchParams.get('primary_color')).toBe('f57e20');
  });

  it('accepts the official www host', () => {
    expect(
      getCalendlyEmbedUrl('https://www.calendly.com/sutur/discovery'),
    ).toContain('https://www.calendly.com/sutur/discovery');
  });

  it.each([
    undefined,
    '',
    'not-a-url',
    'http://calendly.com/sutur/discovery',
    'https://example.com/sutur/discovery',
    'https://calendly.com.evil.example/sutur/discovery',
    'https://calendly.com/',
  ])('rejects an unavailable or unsafe event URL: %s', (value) => {
    expect(getCalendlyEmbedUrl(value)).toBeNull();
  });
});
