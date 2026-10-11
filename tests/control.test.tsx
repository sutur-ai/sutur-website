import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Control } from '../src/components/sections/Control';

vi.stubGlobal('React', React);
it('renders four control cards with decorative icons on the deep section', () => {
  const markup = renderToStaticMarkup(<Control />);
  expect(markup).toContain('id="control" class="sec dark"');
  expect(markup.match(/<h3>/g)).toHaveLength(4);
  expect(markup.match(/<h[2-6]\b/g)).toEqual(['<h2', '<h3', '<h3', '<h3', '<h3']);
  expect(markup.match(/aria-hidden="true"/g)).toHaveLength(4);
  for (const heading of ['Asks before it sends or deletes', 'A private assistant for each person', 'Every step in plain sight', 'Stop it at any time']) expect(markup).toContain(heading);
  expect(markup).not.toContain('<figure');
});
