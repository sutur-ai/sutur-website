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

  it('prefills Calendly from the required lead form without losing the theme', () => {
    const result = getCalendlyEmbedUrl(
      'https://calendly.com/sutur/discovery',
      {
        firstName: 'Ada',
        lastName: 'Lovelace',
        country: 'Lebanon',
        city: 'Beirut',
        phone: '+961 70 123 456',
        email: 'ada@example.com',
        businessName: 'Analytical Engines',
        tellUsMore: 'We need to connect finance and inventory.',
      },
    );
    const url = new URL(result ?? '');

    expect(url.searchParams.get('name')).toBe('Ada Lovelace');
    expect(url.searchParams.get('email')).toBe('ada@example.com');
    expect(url.searchParams.get('a1')).toBe('Lebanon');
    expect(url.searchParams.get('a2')).toBe('Beirut');
    expect(url.searchParams.get('a3')).toBe('+961 70 123 456');
    expect(url.searchParams.get('a4')).toBe('Analytical Engines');
    expect(url.searchParams.get('a5')).toBe(
      'We need to connect finance and inventory.',
    );
    expect(url.searchParams.get('primary_color')).toBe('f57e20');
  });

  it('omits the optional Calendly answer when tell us more is blank', () => {
    const result = getCalendlyEmbedUrl(
      'https://calendly.com/sutur/discovery',
      {
        firstName: 'Ada',
        lastName: 'Lovelace',
        country: 'Lebanon',
        city: 'Beirut',
        phone: '+961 70 123 456',
        email: 'ada@example.com',
        businessName: 'Analytical Engines',
        tellUsMore: '',
      },
    );

    expect(new URL(result ?? '').searchParams.has('a5')).toBe(false);
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
