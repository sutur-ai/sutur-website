import { readFileSync } from 'node:fs';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryTreeVisual } from '../src/components/capabilities/MemoryTreeVisual';

const region = vi.hoisted(() => ({ inView: false, ref: { current: null }, observe: vi.fn() }));
vi.mock('../src/lib/useInView', () => ({
  useInView: () => {
    region.observe();
    return { ref: region.ref, inView: region.inView };
  },
}));
vi.stubGlobal('React', React);
const css = readFileSync(new URL('../src/components/capabilities/MemoryTree.module.css', import.meta.url), 'utf8');
const render = () => renderToStaticMarkup(React.createElement(MemoryTreeVisual));
afterEach(() => { region.inView = false; vi.clearAllMocks(); });

describe('memory tree', () => {
  it('exposes the approved image description and reserves the root icon size', () => {
    const markup = render();
    expect(markup).toContain('role="img" aria-label="A tree: Rafic at the top, three decisions below it. From each decision Rafic learns something and files it into its memory: a new skill, a new habit and a new reminder"');
    expect(markup).toContain('src="/brand/design-system/sutur-icon-soft.png" width="34" height="34" alt=""');
    expect(markup.match(/<svg[^>]+aria-hidden="true"/g)).toHaveLength(9);
  });

  it('pauses the entire visual off screen and resumes through one observed region', () => {
    expect(render()).toContain('class="vis rv idle"');
    expect(region.observe).toHaveBeenCalledOnce();
    region.inView = true;
    expect(render()).toContain('class="vis rv"');
    expect(render()).not.toContain('idle');
  });

  it('keeps each decision, learned tag and new file in its approved order', () => {
    const markup = render();
    for (const text of [
      'Closed September&#x27;s books in 5 steps', 'Learned a skill',
      'Sent the Beit Mery quote as a PDF, in French', 'Learned a habit',
      'Wrote your brief on Monday morning', 'Learned a routine',
      'Rafic&#x27;s memory', 'Only yours',
    ]) expect(markup).toContain(text);
    const columns = markup.split(/<div class="[^"]*mem-col-h[^"]*">/).slice(1);
    expect(columns).toHaveLength(3);
    for (const [index, [name, file, existing]] of [
      ['Skills', 'monthly-close.md', 'supplier-follow-up.md'],
      ['Habits', 'quotes-pdf-in-french.md', 'copy-account-manager.md'],
      ['Reminders', 'Weekly brief · Mon 07:30', 'Overdue check · daily 09:00'],
    ].entries()) {
      expect(columns[index]).toContain(name);
      expect(columns[index]).toContain(`<span>${file}</span><em>New</em>`);
      expect(columns[index]).toContain(existing);
    }
    expect(markup.match(/<em>New<\/em>/g)).toHaveLength(3);
  });

  it('uses a 15 second sequence, with each arrival following its flight', () => {
    for (let index = 1; index <= 3; index++) {
      for (const prefix of ['sxd', 'sxl', 'sxf', 'sxm']) {
        expect(css).toMatch(new RegExp(`animation:${prefix}${index} 15s (?:ease-in-out )?infinite both`));
      }
      const arrival = 26 + (index - 1) * 30;
      expect(css).toMatch(new RegExp(`@keyframes sxf${index}[^\\n]*${arrival}%,100%[^\\n]*opacity:0`));
      expect(css).toMatch(new RegExp(`@keyframes sxm${index}[^\\n]*${arrival}%,96%[^\\n]*opacity:1`));
    }
    expect(css).toContain('animation:global(sxflow) 1.4s linear infinite');
    expect(css).toContain('animation:global(sxring) 2.8s ease-out infinite');
  });

  it('stacks on phone and shows the complete memory without motion', () => {
    expect(css).toContain('.tree{position:relative;height:clamp(600px,72cqi,740px)}');
    const phone = css.split('@container vis (max-width:620px)')[1].split('@media')[0];
    expect(phone).toContain('display:flex;flex-direction:column;gap:12px;padding:24px 16px');
    expect(phone).toContain('.tree-lines,.fly{display:none}');
    expect(phone).toContain('.tn,.mem{position:static;translate:none}');
    expect(phone).toContain('.mem-cols{grid-template-columns:minmax(0,1fr)}');
    const reduced = css.split('@media (prefers-reduced-motion: reduce)')[1];
    expect(reduced).toContain('animation: none !important');
    expect(reduced).toContain('.t-learn { opacity: 1; }');
    expect(reduced).toContain('.fly { display: none; }');
    expect(reduced).toMatch(/\.mf\.new\s*\{\s*opacity: 1;\s*max-height: 30px;\s*padding-block: 4px;\s*border-width: 1px;/);
  });
});
