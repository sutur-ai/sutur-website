import { existsSync, readFileSync } from 'node:fs';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NightShiftVisual } from '../src/components/capabilities/NightShiftVisual';
import styles from '../src/components/capabilities/NightShift.module.css';

const region = vi.hoisted(() => ({ inView: false, ref: { current: null }, observe: vi.fn() }));
vi.mock('../src/lib/useInView', () => ({ useInView: () => { region.observe(); return region; } }));
vi.stubGlobal('React', React);
afterEach(() => { region.inView = false; vi.clearAllMocks(); });
const render = () => renderToStaticMarkup(React.createElement(NightShiftVisual));
const css = readFileSync(new URL('../src/components/capabilities/NightShift.module.css', import.meta.url), 'utf8');

describe('night shift visual', () => {
  it('renders the approved overnight sequence and morning brief verbatim', () => {
    const markup = render();
    expect(markup).toContain('role="img" aria-label="Overnight, Rafic logs orders, matches payments, reads supplier replies and drafts follow-ups, then sends a morning brief"');
    expect(markup).toContain('Rafic&#x27;s night shift');
    expect(markup).toContain('You: offline');
    const rows = markup.split(`<div class="${styles.frow}"`).slice(1);
    expect(rows).toHaveLength(6);
    [
      ['18:00', '0s', 'You log off', 'Rafic picks up tonight&#x27;s schedule'],
      ['19:00', '1.2s', 'Logged today&#x27;s 86 orders', 'Shopify to your ERP'],
      ['22:30', '2.4s', 'Matched 41 payments to invoices', '2 didn&#x27;t match, flagged for you'],
      ['02:00', '3.6s', 'Read 12 supplier replies', 'One delivery moved to Thursday'],
      ['05:30', '4.8s', 'Drafted 3 client follow-ups', 'Waiting for your yes'],
      ['07:30', '6s', 'Good morning, Maya. 3 things need you.', 'Your brief is ready in Rafic'],
    ].forEach(([time, delay, text, sub], index) => {
      for (const copy of [time, text, sub]) expect(rows[index]).toContain(copy);
      expect(rows[index]).toContain(`style="animation-delay:${delay}"`);
    });
    expect(rows[0]).toContain(`class="${styles.fcard} ${styles.off}"`);
    expect(rows[5]).toContain(`class="${styles.fcard} ${styles.brief}"`);
    expect(rows[5]).toContain(`class="${styles.fdot} ${styles.brief}"`);
    expect(markup).not.toMatch(/<(button|input)|tabindex=|\/_blob\//);
    const imgs = [...markup.matchAll(/<img src="([^\"]+)" width="20" height="20" alt=""/g)];
    expect(imgs).toHaveLength(5);
    expect(imgs.map(img => img[1])).toEqual(['/brand/apps/shopify.svg', '/brand/apps/quickbooks.svg', '/brand/apps/gmail.svg', '/brand/apps/hubspot.svg', '/brand/design-system/sutur-icon-soft.png']);
    for (const img of imgs) expect(existsSync(new URL(`../public${img[1]}`, import.meta.url))).toBe(true);
  });

  it('pauses and resumes every loop through its own shared region', () => {
    expect(render()).toContain('class="vis rv idle"');
    expect(region.observe).toHaveBeenCalledOnce();
    region.inView = true;
    expect(render()).toContain('class="vis rv"');
    region.inView = false;
    expect(render()).toContain('class="vis rv idle"');
  });

  it('reveals sequentially over ten seconds and shows the complete timeline without motion', () => {
    expect(css).toContain('animation:sxfill 10s linear infinite both');
    expect(css).toContain('animation:sxrow 10s ease-in-out infinite both');
    const reduced = css.split('@media(prefers-reduced-motion:reduce)')[1];
    expect(reduced).toContain('.shift *{animation:none!important}');
    expect(reduced).toContain('.frow{opacity:1;transform:none}');
    expect(reduced).toContain('.vline-fill{height:100%}');
    expect(css).toContain('grid-template-columns:48px 18px minmax(0,1fr)');
    expect(css).toContain('gap:12px;flex-wrap:wrap');
  });
});
