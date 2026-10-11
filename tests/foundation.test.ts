import { existsSync } from 'node:fs';
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
    expect(markup.match(/<h3>/g)).toHaveLength(2);
    expect(markup).not.toContain('<h5>');
    expect(markup).not.toContain('aria-label="Legal"');
    for (const path of ['/privacy', '/terms', '/security']) expect(markup).not.toContain(`href="${path}"`);
    expect(markup).toContain('/brand/sutur-wordmark-soft.webp');
    expect(markup).toContain('Rafic is a Sutur product.');
  });
  it('reserves each wordmark’s intrinsic aspect ratio before it loads', () => {
    for (const [component, image, width] of [[Header, 'sutur-wordmark-deep.webp', 265], [Footer, 'sutur-wordmark-soft.webp', 265]] as const) {
      expect(existsSync(new URL(`../public/brand/${image}`, import.meta.url))).toBe(true);
      const markup = renderToStaticMarkup(React.createElement(component));
      const imageTag = markup.match(new RegExp(`<img[^>]*src="/brand/${image}"[^>]*>`))?.[0] ?? '';
      expect(imageTag).toContain(`width="${width}"`);
      expect(imageTag).toContain(`height="96"`);
    }
  });
  it('keeps claim punctuation joined to the preceding word', () => {
    const markup = renderToStaticMarkup(React.createElement(Footer));
    expect(markup).toContain('<span class="nowrap">work<span class="dot">.</span></span>');
    expect(markup).toContain('<span class="nowrap">matters<span class="dot">.</span></span>');
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
