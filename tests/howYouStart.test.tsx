import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { HowYouStart } from '../src/components/sections/HowYouStart';

vi.stubGlobal('React', React);
it('renders the three steps and approved migration copy before the founder band', () => {
  const markup = renderToStaticMarkup(<HowYouStart />);
  expect(markup).toContain('id="start"');
  expect(markup.match(/<h3>/g)).toHaveLength(3);
  expect(markup.match(/<h[2-6]\b/g)).toEqual(['<h2', '<h3', '<h3', '<h3']);
  for (const title of ['A 30-minute call', 'Plugged in', 'Full power from day one']) expect(markup).toContain(title);
  expect(markup).toContain('Rafic connects to the tools you already use. Nothing to migrate, nothing to move.');
  expect(markup).not.toContain('Nothing to install');
  expect(markup.indexOf('Full power from day one')).toBeLessThan(markup.indexOf('Founded by people from'));
});
