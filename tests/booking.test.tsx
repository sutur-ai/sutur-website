import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Booking } from '../src/components/booking/Booking';
import { BOOKING_FIELD_LIMITS } from '../src/lib/booking/details';

vi.stubGlobal('React', React);

describe('booking form', () => {
  it('keeps every Calendly detail field and its validation association', () => {
    const markup = renderToStaticMarkup(<Booking />);
    expect(markup.match(/<(?:input|select|textarea)\b/g)).toHaveLength(8);
    for (const [field, limit] of Object.entries(BOOKING_FIELD_LIMITS)) {
      const control = markup.match(new RegExp(`<(?:input|select|textarea)[^>]*name="${field}"[^>]*>`))?.[0];
      expect(control).toBeDefined();
      if (field !== 'country') expect(control).toContain(`maxLength="${limit}"`);
      const errorId = control!.match(/aria-describedby="([^"]+)"/)?.[1];
      expect(errorId).toBeDefined();
      expect(markup).toContain(`id="${errorId}" aria-live="polite"`);
      expect(control!.includes('required=""')).toBe(!['businessName', 'tellUsMore'].includes(field));
    }
  });

  it('uses the approved step and action copy and waits for hydration before submission', () => {
    const markup = renderToStaticMarkup(<Booking />);
    expect(markup).toContain('Step 1 of 2 · Your details');
    expect(markup).toContain('Work email');
    expect(markup).toContain('Company');
    expect(markup).toMatch(/<button[^>]*type="submit"[^>]*disabled=""[^>]*>Choose a time/);
    expect(markup).not.toContain('<iframe');
    expect(markup).toContain('action="#book" method="post"');
  });

  it('places the delegated heading before the form inside the CTA', () => {
    const markup = renderToStaticMarkup(<Booking><h2>See Rafic do your work</h2></Booking>);
    expect(markup.indexOf('<h2>')).toBeLessThan(markup.indexOf('<form'));
    expect(markup.match(/<h2>/g)).toHaveLength(1);
  });
});
