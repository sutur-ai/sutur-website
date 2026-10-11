import { readFileSync } from 'node:fs';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PhotoshopVisual } from '../src/components/capabilities/PhotoshopVisual';
import styles from '../src/components/capabilities/Photoshop.module.css';

const visibility = vi.hoisted(() => ({ inView: false, ref: { current: null } }));
vi.mock('../src/lib/useInView', () => ({ useInView: () => visibility }));
vi.stubGlobal('React', React);
afterEach(() => { visibility.inView = false; });
const render = () => renderToStaticMarkup(React.createElement(PhotoshopVisual));
const css = readFileSync(new URL('../src/components/capabilities/Photoshop.module.css', import.meta.url), 'utf8');

describe('Photoshop visual', () => {
  it('keeps the replica accessible as one image, without decorative focus targets', () => {
    const markup = render();
    expect(markup).toContain('role="img"');
    expect(markup).toContain('aria-label="Rafic in Photoshop: it types a new headline, then changes the sun shape from orange to violet"');
    expect(markup).not.toMatch(/<(button|input|select)|tabindex=/);
    expect(markup).not.toMatch(/undefined|early.access|Mac/i);
    for (const copy of ['File', 'Type', 'Shape', 'Layers', 'Channels', 'Paths', 'Properties', 'spring-campaign.psd @ 50% (RGB/8)', '1600 px × 2000 px (72 ppi)', 'SALE −20%', '906FB1', 'Original kept', 'Stop']) {
      expect(markup).toContain(copy);
    }
    expect(markup).toContain('src="/brand/design-system/sutur-icon-soft.png"');
    expect(markup).not.toContain('/_blob/');
  });

  it('pauses all loops before observation and off screen, and resumes on screen', () => {
    expect(render()).toContain('class="vis rv idle"');
    visibility.inView = true;
    expect(render()).toContain('class="vis rv"');
    visibility.inView = false;
    expect(render()).toContain('class="vis rv idle"');
  });

  it('uses one synchronized fill animation for both swatches and the layer thumbnail', () => {
    const markup = render();
    expect(markup.match(new RegExp(`class="${styles['ps-sw']} ${styles.fill}"`, 'g'))).toHaveLength(2);
    expect(markup).toContain(`class="${styles['ps-th']} ${styles.sun}"`);
    expect(css).toContain('.ps-sw.fill{animation:sxpsfill 14s infinite both}');
    expect(css).toContain('.ps-th.sun{animation:sxpsfill 14s infinite both}');
    const frames = Object.fromEntries([...css.matchAll(/@keyframes (\w+)\{((?:[^{}]|\{[^{}]*\})*)\}/g)].map(match => [match[1], match[2]]));
    expect(frames.sxsun).toBe(frames.sxpsfill);
    expect(frames.sxsun).toBe('0%,58%{background:#f57e20}62%,92%{background:#906fb1}96%,100%{background:#f57e20}');
    expect(frames.sxpick).toBe('0%,52%{opacity:0;transform:scale(.95)}54%,63%{opacity:1;transform:none}65%,100%{opacity:0;transform:scale(.95)}');
    expect(frames.sxtype).toBe('0%,12%{clip-path:inset(0 100% 0 0)}36%,93%{clip-path:inset(0 0 0 0)}96%,100%{clip-path:inset(0 100% 0 0)}');
    expect(frames.sxo1).toBe('0%,47%{opacity:1}49%,100%{opacity:0}');
    expect(frames.sxo2).toBe('0%,48%{opacity:0}50%,94%{opacity:1}96%,100%{opacity:0}');
  });

  it('keeps the typed headline and text layer visible without any reduced-motion loop', () => {
    const reduced = css.split('@media(prefers-reduced-motion:reduce){')[1];
    expect(reduced).toContain('animation:none!important;transition:none!important');
    expect(reduced).toContain('.stg.o1{opacity:1}');
    expect(reduced).toContain('.stg.o2{opacity:0}');
    expect(reduced).toContain('.ps-type-t{clip-path:inset(0 0 0 0)}');
    expect(reduced).toContain('.ps-layer.l-new{opacity:1;max-height:40px;');
    expect(reduced).toContain('.ps-picker,.ps-sun-sel,.ps-tbox,.ps-caret,.ps-cur{opacity:0}');
  });

  it('preserves the phone layout and uses the shared application font', () => {
    expect(css).toContain('font-family:var(--font-app)');
    expect(css).toContain('.ps-menu svg{width:15px;height:15px;flex-shrink:0}');
    expect(css).toContain('@container vis (max-width: 620px){\n.ps-main{grid-template-columns:30px minmax(0,1fr)}\n.ps-side{display:none}\n.ps-sel:nth-of-type(n+3){display:none}');
    const component = readFileSync(new URL('../src/components/capabilities/PhotoshopVisual.tsx', import.meta.url), 'utf8');
    for (const match of component.matchAll(/styles\['([^']+)'\]/g)) {
      expect(css).toContain(`.${match[1]}`);
    }
  });
});
