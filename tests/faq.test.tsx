import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Faq } from '../src/components/sections/Faq';
import { SX_FAQ } from '../src/content/faq';

vi.stubGlobal('React', React);
it('links five accordion buttons to labelled panels with only the first answer open', () => {
  const markup = renderToStaticMarkup(<Faq />);
  expect(markup).toContain('id="faq"');
  expect(markup.match(/aria-expanded="true"/g)).toHaveLength(1);
  expect(markup.match(/aria-expanded="false"/g)).toHaveLength(4);
  expect(markup.match(/hidden=""/g)).toHaveLength(4);
  SX_FAQ.forEach((faq, index) => {
    expect(markup).toContain(faq.q);
    expect(markup).toContain(`aria-controls="faq-answer-${index}"`);
    expect(markup).toContain(`id="faq-answer-${index}" role="region" aria-labelledby="faq-question-${index}"`);
    if (index === 0) expect(markup).toContain(faq.a);
    else expect(markup).not.toContain(faq.a);
  });
  expect(SX_FAQ[4].a).toBe('We quote after the call, once we know the workflow and the size of your team.');
});
