import { existsSync, readFileSync } from 'node:fs';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HubVisual } from '../src/components/capabilities/HubVisual';
import styles from '../src/components/capabilities/Hub.module.css';

const region = vi.hoisted(() => ({ inView: false, ref: { current: null }, observe: vi.fn() }));
vi.mock('../src/lib/useInView', () => ({ useInView: () => { region.observe(); return region; } }));
vi.stubGlobal('React', React);
afterEach(() => { region.inView = false; vi.clearAllMocks(); });
const render = () => renderToStaticMarkup(React.createElement(HubVisual));
const css = readFileSync(new URL('../src/components/capabilities/Hub.module.css', import.meta.url), 'utf8');

describe('hub visual', () => {
  it('connects all eight approved apps to the core at the approved positions', () => {
    const markup = render();
    expect(markup).toContain('role="img" aria-label="Rafic at the centre, connected to Outlook, Teams, HubSpot, Odoo, Drive, Slack, Jira and Gmail"');
    const nodes = [...markup.matchAll(/<div class="[^\"]*node[^\"]*" style="([^\"]+)"><img[^>]*src="([^\"]+)"/g)];
    const expected = [
      ['microsoftoutlook', 16, 20, '0s'], ['microsoft-teams', 50, 12, '-1s'],
      ['hubspot', 84, 20, '-2s'], ['odoo', 90, 50, '-3s'],
      ['google-drive', 84, 80, '-4s'], ['slack', 50, 88, '-5s'],
      ['jira', 16, 80, '-1.5s'], ['gmail', 10, 50, '-3.5s'],
    ];
    expect(nodes).toHaveLength(8);
    expected.forEach(([slug, x, y, delay], index) => {
      expect(nodes[index][1]).toBe(`left:${x}%;top:${y}%;animation-delay:${delay}`);
      expect(nodes[index][2]).toBe(`/brand/apps/${slug}.svg`);
      expect(markup).toContain(`x1="50" y1="50" x2="${x}" y2="${y}"`);
    });
    expect(markup.match(new RegExp(`class="${styles.in}"`, 'g'))).toHaveLength(4);
    for (const img of markup.matchAll(/<img ([^>]+)>/g)) {
      expect(img[1]).toMatch(/width="\d+" height="\d+" alt=""/);
      const src = img[1].match(/src="([^\"]+)"/)![1];
      expect(existsSync(new URL(`../public${src}`, import.meta.url))).toBe(true);
    }
    expect(markup).not.toMatch(/<(button|input)|tabindex=|\/_blob\//);
  });

  it('preserves the three done notes and pauses through one shared in-view region', () => {
    const markup = render();
    expect(region.observe).toHaveBeenCalledOnce();
    expect(markup).toContain('class="vis rv idle"');
    for (const [text, position] of [
      ['3 deals updated in HubSpot', 'left:60%;top:30%;animation-delay:0s'],
      ['Invoice matched in Odoo', 'left:56%;top:64%;animation-delay:4s'],
      ['Reply drafted in Outlook', 'left:18%;top:34%;animation-delay:2s'],
    ]) expect(markup).toContain(`style="${position}"><span class="${styles['ping-ok']}">✓</span>${text}`);
    region.inView = true;
    expect(render()).toContain('class="vis rv"');
    region.inView = false;
    expect(render()).toContain('class="vis rv idle"');
  });

  it('keeps static nodes, lines and visible notes under reduced motion with the approved phone rule', () => {
    const reduced = css.split('@media(prefers-reduced-motion:reduce)')[1];
    expect(reduced).toContain('.hub *,.core::before,.core::after{animation:none!important}');
    expect(reduced).toContain('.ping{opacity:1;transform:none}');
    expect(css).toContain('@container vis (max-width:620px){.ping{display:none}}');
    expect(css).toContain('height:clamp(400px,32cqi,620px)');
    expect(css).toContain('animation:sxflow 1.4s linear infinite');
    expect(css).toContain('animation:sxfloat 6s ease-in-out infinite');
    expect(css).toContain('animation:sxring 2.8s ease-out infinite');
    expect(css).toContain('animation:sxpop 8s ease-in-out infinite both');
  });
});
