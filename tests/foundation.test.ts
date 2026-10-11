import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { SectionShell } from '../src/components/layout/SectionShell';
import { Header } from '../src/components/layout/Header';
import { Footer } from '../src/components/layout/Footer';
import { FloatingCta, bookingReached } from '../src/components/layout/FloatingCta';

vi.stubGlobal('React', React);
describe('foundation markup', () => {
  it('renders a semantic shell with its id, classes and section spacing', () => {
    const markup = renderToStaticMarkup(React.createElement(SectionShell, { id: 'what', style: { paddingTop: 48 } }, 'Content'));
    expect(markup).toBe('<section id="what" class="sec" style="padding-top:48px">Content</section>');
  });
  it('exposes all five anchors and an initially collapsed accessible phone menu', () => {
    const markup = renderToStaticMarkup(React.createElement(Header));
    for (const id of ['what', 'teams', 'control', 'start', 'faq']) expect(markup).toContain(`href="#${id}"`);
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('aria-controls="phone-menu"');
    expect(markup).not.toContain('id="phone-menu"');
  });
  it('renders the footer claim, brand and two navigation groups', () => {
    const markup = renderToStaticMarkup(React.createElement(Footer));
    for (const name of ['Product', 'Company']) expect(markup).toContain(`aria-label="${name}"`);
    expect(markup.match(/<nav /g)).toHaveLength(2);
    expect(markup).not.toContain('aria-label="Legal"');
    for (const path of ['/privacy', '/terms', '/security']) expect(markup).not.toContain(`href="${path}"`);
    expect(markup).toContain('/brand/sutur-wordmark-soft.png');
    expect(markup).toContain('Rafic is a Sutur product.');
  });
  it('keeps the floating CTA inaccessible before hydration and hides at or beyond booking', () => {
    const markup = renderToStaticMarkup(React.createElement(FloatingCta));
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('tabindex="-1"');
    expect(bookingReached(1000, 900)).toBe(false);
    expect(bookingReached(899, 900)).toBe(true);
    expect(bookingReached(-1000, 900)).toBe(true);
  });
});
