import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import Privacy, { metadata as privacyMeta } from '../src/app/privacy/page';
import Support, { metadata as supportMeta } from '../src/app/support/page';
import DeleteAccount, { metadata as deleteMeta } from '../src/app/delete-account/page';

vi.stubGlobal('React', React);
const EMAIL = 'g.cronkwright@sutur.ai';
const pages = [
  ['/privacy', Privacy, privacyMeta, 'Rafic Privacy Policy'],
  ['/support', Support, supportMeta, 'Rafic support'],
  ['/delete-account', DeleteAccount, deleteMeta, 'Delete your Rafic account'],
] as const;

describe.each(pages)('%s', (path, Page, metadata, heading) => {
  const markup = renderToStaticMarkup(<Page />);
  it('renders one heading, a link home and the support email', () => {
    expect(markup.match(/<h1>/g)).toHaveLength(1);
    expect(markup).toContain(`<h1>${heading}</h1>`);
    expect(markup).toContain('href="/"');
    expect(markup).toContain(`href="mailto:${EMAIL}"`);
  });
  it('is canonical at its own path', () => {
    expect(metadata.alternates?.canonical).toBe(path);
  });
  it('leaves no placeholder or private identifier in the page text', () => {
    expect(markup).not.toMatch(/\[[A-Z ]+\]/);
    expect(markup).not.toMatch(/\d{2}-\d{7}/);
    expect(markup).not.toContain('SUTUR-');
  });
});

it('gives the business address on every page', () => {
  for (const [, Page] of pages) expect(renderToStaticMarkup(<Page />)).toContain('1755 Highway 24 East, Vittoria, ON N0E 1W0, Canada');
});

it('dates the privacy policy', () => {
  expect(renderToStaticMarkup(<Privacy />)).toContain('Effective <time dateTime="2026-11-04">');
});

it('lists the support phone as a dialable link and the response time', () => {
  const markup = renderToStaticMarkup(<Support />);
  expect(markup).toContain('href="tel:+15194100617">+1 519 410 0617</a>');
  expect(markup).toContain('We answer within 2 business days.');
});

it('explains both the in-app path and the email path to deletion', () => {
  const markup = renderToStaticMarkup(<DeleteAccount />);
  expect(markup).toContain('<strong>Settings › Account › Delete account</strong>');
  expect(markup).toContain(`write to <a href="mailto:${EMAIL}">${EMAIL}</a> from the email address on your account`);
  expect(markup).toContain('<strong>within 30 days</strong>');
});

it('names the same in-app deletion path on the privacy and support pages', () => {
  for (const Page of [Privacy, Support]) expect(renderToStaticMarkup(<Page />)).toContain('<strong>Settings › Account › Delete account</strong>');
});
