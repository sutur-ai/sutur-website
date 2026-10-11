import { readFileSync, readdirSync } from 'node:fs';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { APP_ROW_1, APP_ROW_2 } from '../src/content/apps';
import { AppsStrip } from '../src/components/apps/AppsStrip';

const visibility = vi.hoisted(() => ({ inView: false }));
vi.mock('../src/lib/useInView', () => ({ useInView: () => ({ ref: { current: null }, inView: visibility.inView }) }));
vi.stubGlobal('React', React);
afterEach(() => { visibility.inView = false; });

const expectedNames = [
  ['Outlook', 'Microsoft Teams', 'Gmail', 'Google Calendar', 'Slack', 'Notion', 'Jira', 'Asana', 'HubSpot', 'Salesforce', 'Odoo', 'SAP', 'QuickBooks', 'Xero', 'Stripe', 'Shopify', 'Zoom', 'WhatsApp', 'Zendesk', 'Airtable'],
  ['Figma', 'Canva', 'Photoshop', 'Illustrator', 'Premiere Pro', 'Blender', 'AutoCAD', 'Google Drive', 'Dropbox', 'Google Sheets', 'Google Meet', 'Miro', 'Mailchimp', 'Calendly', 'GitHub', 'Linear', 'Trello', 'WordPress', 'Webflow'],
];
const allApps = [...APP_ROW_1, ...APP_ROW_2];

function markup() { return renderToStaticMarkup(React.createElement(AppsStrip)); }

describe('rolling apps strip', () => {
  it('ships all 39 apps in the approved row order', () => {
    expect([APP_ROW_1, APP_ROW_2].map(row => row.map(app => app.name))).toEqual(expectedNames);
    expect(new Set(allApps.map(app => app.slug)).size).toBe(39);
    expect(allApps.every(app => app.description.length > 0)).toBe(true);
  });

  it('renders two equal copies per row and hides only the duplicates from assistive technology', () => {
    const html = markup();
    expect(html).toContain('aria-label="Apps Rafic works with"');
    const copies = [...html.matchAll(/<div class="[^"]*copy[^"]*"( aria-hidden="true")?>(.*?)<\/div>(?=<\/div>|<div class="[^"]*copy)/g)];
    expect(copies).toHaveLength(4);
    for (const [index, row] of [APP_ROW_1, APP_ROW_2].entries()) {
      const original = copies[index * 2], duplicate = copies[index * 2 + 1];
      expect(original[1]).toBeUndefined();
      expect(duplicate[1]).toBe(' aria-hidden="true"');
      expect(duplicate[2]).toBe(original[2]);
      expect(original[2].match(/<img /g)).toHaveLength(row.length);
      let previousPosition = -1;
      for (const app of row) {
        const position = original[2].indexOf(`>${app.name}</span>`);
        expect(position).toBeGreaterThan(previousPosition);
        expect(original[2]).toContain(`>${app.description}</span>`);
        previousPosition = position;
      }
    }
  });

  it('reserves logo dimensions and renders decorative images and the exact connection claim', () => {
    const html = markup();
    const images = html.match(/<img [^>]*>/g) ?? [];
    expect(images).toHaveLength(78);
    for (const image of images) {
      expect(image).toContain('width="23" height="23" alt=""');
      expect(image).toMatch(/src="\/brand\/apps\/[a-z-]+\.svg"/);
    }
    expect(html).toContain('Office, finance, sales, design, video, 3D. If your team works in it, Rafic can too.');
    expect(html).toContain('Any app with an API. Rafic proposes the connection, you approve it.');
  });

  it('starts paused and follows the foundation visibility state', () => {
    expect(markup()).toMatch(/<section class="[^"]* idle"/);
    visibility.inView = true;
    expect(markup()).not.toMatch(/<section class="[^"]* idle"/);
    visibility.inView = false;
    expect(markup()).toMatch(/<section class="[^"]* idle"/);
  });

  it('supplies every local SVG with a viewBox and no metadata or comments', () => {
    const directory = new URL('../public/brand/apps/', import.meta.url);
    expect(readdirSync(directory).sort()).toEqual(allApps.map(app => `${app.slug}.svg`).sort());
    for (const app of allApps) {
      const svg = readFileSync(new URL(`${app.slug}.svg`, directory), 'utf8');
      expect(svg).toMatch(/<svg\b[^>]*viewBox="[^"]+"/);
      expect(svg).not.toMatch(/<!--|<metadata\b|<\?xml/);
    }
  });
});
