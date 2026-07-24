import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  HONEYCOMB_GEOMETRY,
  INTEGRATION_VIEW_BOX,
  integrationLayout,
} from '../src/components/sections/CompanyCapabilities.geometry';

const page = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8');
const component = readFileSync(
  new URL('../src/components/sections/CompanyCapabilities.tsx', import.meta.url),
  'utf8',
);
const geometrySource = readFileSync(
  new URL('../src/components/sections/CompanyCapabilities.geometry.ts', import.meta.url),
  'utf8',
);
const header = readFileSync(
  new URL('../src/components/sections/Header.tsx', import.meta.url),
  'utf8',
);
const navigation = readFileSync(
  new URL('../src/components/sections/navigation.ts', import.meta.url),
  'utf8',
);
const styles = readFileSync(
  new URL('../src/components/sections/CompanyCapabilities.module.css', import.meta.url),
  'utf8',
);

const integrations = [
  ['Odoo ERP', 'odoo.svg'],
  ['Gmail', 'gmail.svg'],
  ['Notion', 'notion.svg'],
  ['Slack', 'slack.svg'],
  ['Discord', 'discord.svg'],
  ['Obsidian', 'obsidian.svg'],
  ['SAP', 'sap.svg'],
  ['AutoCAD', 'autocad.svg'],
  ['Salesforce', 'salesforce.svg'],
  ['Google Drive', 'google-drive.svg'],
  ['HubSpot', 'hubspot.svg'],
  ['Microsoft Teams', 'microsoft-teams.svg'],
] as const;

const officialOdooApps = [
  { name: 'Discuss', asset: 'odoo-apps/discuss.png', source: 'odoo/odoo@19.0:addons/mail/static/description/icon.png', sha256: 'aee37c7289881ef9de67cf2360624d5d04c8f91ecd610aca2de845d910e40a11' },
  { name: 'Calendar', asset: 'odoo-apps/calendar.png', source: 'odoo/odoo@19.0:addons/calendar/static/description/icon.png', sha256: '0d331aabd5da2e9a68a20a716f967d3129a1f41916b738cd70fb5c9f81d19d81' },
  { name: 'Appointments', asset: 'odoo-apps/appointments.png', source: 'odoo/enterprise@19.0:appointment/static/description/icon.png', sha256: '4f6cd75d814bd499998f16bab9b453d239351eed286c15a5f93c1cb1610d7deb' },
  { name: 'Contacts', asset: 'odoo-apps/contacts.png', source: 'odoo/odoo@19.0:addons/contacts/static/description/icon.png', sha256: 'eb4f5b58d9e8e05d0f49200b8cdb8741bf0854f4a016f030966c95f0dea5bb4b' },
  { name: 'CRM', asset: 'odoo-modules/crm.png', source: 'odoo/odoo@19.0:addons/crm/static/description/icon.png', sha256: '895078dc53b8f3e9423a941b1cbad20f941207ced26458da50ab9b41911d2524' },
  { name: 'Sales', asset: 'odoo-modules/sales.png', source: 'odoo/odoo@19.0:addons/sale/static/description/icon.png', sha256: '82725c69a7d44563e4ae641586dabd4b228b38a463423c0affeedb6c3d6afef6' },
  { name: 'Dashboards', asset: 'odoo-apps/dashboards.png', source: 'odoo/odoo@19.0:addons/spreadsheet_dashboard/static/description/icon.png', sha256: '9e7ec953ff206b4774174441e67f5c081f6c26ce2e656d76a6bc4a555f295a2e' },
  { name: 'Point of Sale', asset: 'odoo-apps/point-of-sale.png', source: 'odoo/odoo@19.0:addons/point_of_sale/static/description/icon.png', sha256: '27072aa3c7778c661d61d0b8c8b5fb792a71adae02cabf072e0ff2bf563397cd' },
  { name: 'Accounting', asset: 'odoo-modules/accounting.png', source: 'odoo/odoo@19.0:addons/account/static/description/icon.png', sha256: 'a6e040cfe180bc94b2d995f88cac2de850e4a0c1335de6c965008011d463b3e2' },
  { name: 'Website', asset: 'odoo-modules/ecommerce.png', source: 'odoo/odoo@19.0:addons/website_sale/static/description/icon.png', sha256: '813ff822f41657021b61651f5f5a3d85f4815f3c47c61addd0dae84699ef998e' },
  { name: 'Inventory', asset: 'odoo-modules/inventory.png', source: 'odoo/odoo@19.0:addons/stock/static/description/icon.png', sha256: 'bc24a42da24aa473bacebf35de67920e09cb0ed505d342166e83bbe0ff4a00e5' },
  { name: 'Purchase', asset: 'odoo-modules/purchasing.png', source: 'odoo/odoo@19.0:addons/purchase/static/description/icon.png', sha256: '249ed76bcab16418780dcd2eb56d2c04051e88a3ab483e65b3e7477e106db5fc' },
  { name: 'Manufacturing', asset: 'odoo-modules/manufacturing.png', source: 'odoo/odoo@19.0:addons/mrp/static/description/icon.png', sha256: 'f079eb9c7b1574570ac3c9582acc65a3262627f3f055b1382d1c725665e17b4d' },
  { name: 'Settings', asset: 'odoo-apps/settings.png', source: 'odoo/odoo@19.0:odoo/addons/base/static/description/settings.png', sha256: 'ebf6553804c9c8c917d088491f0121461b07742d6e14d132ef4446b49e14067e' },
] as const;

describe('company capabilities section', () => {
  it('keeps Alex’s focused three-offer section and its semantic structure', () => {
    expect(page).toContain('<CompanyCapabilities />');
    expect(page).not.toContain('<ModuleGrid />');
    expect(page).not.toContain('<KnowledgeDiagram />');
    expect(page).not.toContain('<ProcessTimeline />');
    expect(component).toContain('id="capabilities"');
    expect(component).toContain('aria-labelledby="capabilities-title"');
    expect(component).toContain('role="list"');
    expect(component).toContain('role="listitem"');
    expect(component.match(/visual: '(?:erp|custom|agent)'/g)).toHaveLength(3);
  });

  it('preserves Alex’s approved offer order: AI, ERP, custom development', () => {
    const agentIndex = component.indexOf("label: 'AI agent architecture'");
    const erpIndex = component.indexOf("label: 'ERP implementation'");
    const customIndex = component.indexOf("label: 'Custom development'");

    expect(agentIndex).toBeGreaterThan(-1);
    expect(agentIndex).toBeLessThan(erpIndex);
    expect(erpIndex).toBeLessThan(customIndex);
    expect(component).toContain("number: '01',\n    label: 'AI agent architecture'");
    expect(component).toContain("number: '02',\n    label: 'ERP implementation'");
    expect(component).toContain("number: '03',\n    label: 'Custom development'");
  });

  it('keeps full-edge, flat product windows at the centralized visual size', () => {
    expect(styles).toMatch(
      /\.visual\s*{[^}]*height:\s*var\(--capability-visual-height\)[^}]*background:\s*var\(--deep-interface\)/s,
    );
    expect(styles).toMatch(/\.productWindow\s*{[^}]*inset:\s*0[^}]*border:\s*0/s);
    expect(styles).not.toContain('backdrop-filter');
    expect(styles).not.toContain('gradient(');
  });

  it('uses only Sutur signal colors in product-window chrome', () => {
    expect(component).toContain('function WindowChrome');
    expect(component).toContain('className={styles.windowControls}');
    expect(styles).toMatch(/\.windowControls i\s*{[^}]*background:\s*var\(--active-orange\)/s);
    expect(styles).toMatch(
      /\.windowControls i:nth-child\(2\)\s*{[^}]*background:\s*var\(--soft-signal\)/s,
    );
    expect(styles).toMatch(
      /\.windowControls i:nth-child\(3\)\s*{[^}]*background:\s*var\(--data-violet\)/s,
    );
  });

  it('keeps the complete Odoo launcher with official app artwork and a readable custom-development diff', () => {
    const hashes = new Set<string>();

    for (const { name, asset, source, sha256 } of officialOdooApps) {
      const assetUrl = new URL(`../public/brand/${asset}`, import.meta.url);
      expect(component).toContain(`name: '${name}'`);
      expect(component).toContain(`icon: '/brand/${asset}'`);
      expect(existsSync(assetUrl)).toBe(true);
      expect(source).toMatch(/^odoo\/(?:odoo|enterprise)@19\.0:/);
      expect(createHash('sha256').update(readFileSync(assetUrl)).digest('hex')).toBe(sha256);
      hashes.add(sha256);
    }
    expect(hashes.size).toBe(officialOdooApps.length);
    expect(component).toContain('<img src={app.icon} alt="" />');
    expect(component).not.toMatch(
      /styles\.(?:discuss|calendar|appointments|contacts|dashboard|pos|settings)Icon/,
    );
    expect(component).toContain('className={styles.fileTree}');
    expect(component).toContain('purchase_order.py');
    expect(component).toContain('resolve_supplier');
    expect(component).toContain('validate_quantity');
    expect(component).toContain('className={`${styles.codeLine} ${styles.removedLine}`}');
    expect(component).toContain('className={`${styles.codeLine} ${styles.addedLine}`}');
  });

  it('preserves the chrome-free responsive honeycomb and every downloaded brand asset', () => {
    expect(integrationLayout.map((row) => row.length)).toEqual([4, 5, 4]);
    expect(integrationLayout.flat()).toHaveLength(13);
    expect(INTEGRATION_VIEW_BOX).toBe('0 0 419.692 244');
    expect(component).toContain('viewBox={INTEGRATION_VIEW_BOX}');
    expect(component).toContain('preserveAspectRatio="xMidYMid meet"');
    expect(component).toContain('className={styles.integrationGrid}');
    expect(component).toContain('<polygon');
    expect(component).toContain('<image');
    expect(styles).toMatch(/\.agentVisual\s*{[^}]*container-type:\s*inline-size/s);
    expect(styles).toMatch(/\.integrationGrid\s*{[^}]*\b5cqi\b[^}]*height:\s*auto/s);
    expect(styles).toMatch(/\.integrationHex\s*{[^}]*vector-effect:\s*non-scaling-stroke/s);

    const cells = integrationLayout.flat().map(({ centerX, centerY, points }) => ({
      centerX,
      centerY,
      points: points.split(' ').map((point) => point.split(',').map(Number)),
    }));
    const allCoordinates = cells.flatMap(({ points }) => points);
    const distances = cells.flatMap((cell, index) =>
      cells.slice(index + 1).map((other) =>
        Math.hypot(cell.centerX - other.centerX, cell.centerY - other.centerY),
      ),
    );

    for (const { points } of cells) {
      expect(points).toHaveLength(6);
      points.forEach((point, index) => {
        const nextPoint = points[(index + 1) % points.length];
        expect(Math.hypot(nextPoint[0] - point[0], nextPoint[1] - point[1])).toBeCloseTo(
          HONEYCOMB_GEOMETRY.radius,
          2,
        );
      });
    }
    expect(Math.min(...distances)).toBeCloseTo(HONEYCOMB_GEOMETRY.width, 2);
    expect(Math.min(...allCoordinates.map(([x]) => x))).toBeGreaterThanOrEqual(0);
    expect(Math.max(...allCoordinates.map(([x]) => x))).toBeLessThanOrEqual(
      HONEYCOMB_GEOMETRY.viewBoxWidth,
    );
    expect(Math.min(...allCoordinates.map(([, y]) => y))).toBeGreaterThanOrEqual(0);
    expect(Math.max(...allCoordinates.map(([, y]) => y))).toBeLessThanOrEqual(
      HONEYCOMB_GEOMETRY.viewBoxHeight,
    );

    for (const [app, asset] of integrations) {
      expect(geometrySource).toContain(`label: '${app}'`);
      expect(geometrySource).toContain(`icon: '/brand/integrations/${asset}'`);
      expect(existsSync(new URL(`../public/brand/integrations/${asset}`, import.meta.url))).toBe(true);
    }

    const agentVisual = component.slice(
      component.indexOf('className={`${styles.visual} ${styles.agentVisual}`'),
      component.indexOf('export function CompanyCapabilities'),
    );
    expect(agentVisual).not.toContain('<WindowChrome');
    expect(agentVisual).not.toContain('styles.productWindow');
  });

  it('changes from three columns to split rows before product UIs compress, then stacks compact cards early', () => {
    expect(styles).toMatch(/\.capabilityGrid\s*{[^}]*grid-template-columns:\s*repeat\(3,/s);
    expect(styles).toMatch(
      /@media \(max-width: 1120px\)[\s\S]*?\.capabilityGrid\s*{[^}]*grid-template-columns:\s*1fr/s,
    );
    expect(styles).toMatch(
      /@media \(max-width: 840px\)[\s\S]*?\.capability\s*{[^}]*grid-template-columns:\s*1fr/s,
    );
    expect(styles).toMatch(
      /@media \(max-width: 840px\)[\s\S]*?\.visual\.agentVisual\s*{[^}]*height:\s*clamp\(14rem, 52vw, 20rem\)/s,
    );
  });

  it('runs the accepted cancellable workflow, restores over open apps, and requires a new hover edge', () => {
    for (const phase of [
      'idle',
      'collapsing',
      'typing',
      'understanding',
      'checking',
      'drafting',
      'validated',
      'selecting-teams',
      'opening-teams',
      'selecting-gmail',
      'opening-gmail',
      'restoring',
      'restored',
    ]) {
      expect(component).toContain(`| '${phase}'`);
    }
    expect(component).not.toMatch(/\| '(?:complete|completed)'/);
    expect(component).toContain(
      'I am running late 1h over my schedule, check my teams meetings',
    );
    expect(component).toContain('data-agent-phase={visiblePhase}');
    expect(component).toContain('data-agent-task="understanding"');
    expect(component).toContain("'opening-gmail': { next: 'restoring'");
    expect(component).toContain("restoring: { next: 'restored'");
    expect(component).not.toContain("'opening-gmail': { next: 'complete'");
    expect(component).toContain('data-agent-user-avatar');
    expect(component).toContain('/brand/design-system/sutur-agent-favicon.png');
    expect(component).toContain('data-agent-review-workspace');
    expect(component).toContain('data-agent-review-window="teams"');
    expect(component).toContain('data-agent-review-window="gmail"');
    expect(component).toContain('data-agent-restore-backdrop');
    expect(component).toContain('data-agent-stack-layer');
    expect(component).toContain('data-agent-app-stack');
    const agentVisualSource = component.slice(
      component.indexOf('function AgentAvatar'),
      component.indexOf('export function CapabilityVisual'),
    );
    expect(agentVisualSource).not.toContain('<button');
    expect(agentVisualSource.match(/data-agent-control/g)).toHaveLength(2);
    expect(component).toContain("window.matchMedia('(prefers-reduced-motion: reduce)')");
    expect(component).toContain(
      'onPointerEnter={isAgent ? activateAgentHover : undefined}',
    );
    expect(component).toContain(
      'onPointerDown={isAgent ? trackAgentPointer : undefined}',
    );
    expect(component).toContain(
      'onPointerLeave={isAgent ? () => setAgentHovered(false) : undefined}',
    );
    expect(component).toContain(
      'onFocusCapture={isAgent ? activateAgentFocus : undefined}',
    );
    expect(component).toContain(
      'onKeyDownCapture={isAgent ? activateAgentKeyboard : undefined}',
    );
    expect(component).toContain("touchInteractionRef.current = event.pointerType === 'touch'");
    expect(component).toContain('onBlurCapture={isAgent ? releaseAgentFocus : undefined}');
    expect(component).toContain('const sequenceIdRef = useRef(0)');
    expect(component).toContain('if (sequenceIdRef.current === sequenceId) setPhase');
    expect(component).toContain("'--stack-x': `${stackCenterX - centerX}px`");
    expect(component).toContain("'--stack-y': `${stackCenterY - centerY}px`");
    expect(component).toContain("'--stack-enter-delay': `${(integrationCount - cellIndex - 1) * 22}ms`");
    expect(component).toContain("'--stack-exit-delay': `${cellIndex * 22}ms`");
    expect(component).toContain('data-agent-app="teams"');
    expect(component).toContain('data-agent-app="gmail"');
    expect(component.match(/<span data-agent-app-badge>1<\/span>/g)).toHaveLength(2);
    expect(styles).toMatch(
      /\.agentActive \.integrationCell\s*{[^}]*translate\(var\(--stack-x\), var\(--stack-y\)\)[^}]*scale\(0\.46\)/s,
    );
    expect(styles).toMatch(/\.integrationCell\s*{[^}]*transition-delay:\s*var\(--stack-exit-delay\)/s);
    expect(styles).toMatch(
      /\.agentActive \.integrationCell\s*{[^}]*transition-delay:\s*var\(--stack-enter-delay\)/s,
    );
    expect(styles).toMatch(/\.agentReviewWorkspace\s*{[^}]*z-index:\s*4/s);
    expect(styles).toMatch(/\.agentRestoreBackdrop\s*{[^}]*z-index:\s*5[^}]*agent-restore-backdrop-in/s);
    expect(styles).toMatch(/\.integrationField\s*{[^}]*z-index:\s*6/s);
    expect(styles).toMatch(/\.agentValidatedApps\s*{[^}]*z-index:\s*8/s);
    expect(styles).toContain('@keyframes agent-macos-window-open');
    expect(styles).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.integrationCell,[\s\S]*?\.agentDesktop,[\s\S]*?\.agentCursor\s*{[^}]*transition:\s*none/s,
    );
    expect(styles).toMatch(/\.agentRestoreBackdrop\s*{\s*opacity:\s*1;\s*animation:\s*none;/s);
  });

  it('keeps capability and global navigation pointed at live destinations', () => {
    expect(page).toContain('href="#capabilities"');
    expect(navigation).toContain("['Capabilities', '#capabilities']");
    expect(header).toContain('sectionLinks.map');
    expect(component).toContain('href="#book"');
  });
});
