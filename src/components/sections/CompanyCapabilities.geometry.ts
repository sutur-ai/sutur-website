export const integrationRows = [
  [
    { label: 'Odoo ERP', icon: '/brand/integrations/odoo.svg', brand: 'odoo', format: 'wide' },
    { label: 'Gmail', icon: '/brand/integrations/gmail.svg', brand: 'gmail', format: 'square' },
    { label: 'Notion', icon: '/brand/integrations/notion.svg', brand: 'notion', format: 'square' },
    { label: 'Slack', icon: '/brand/integrations/slack.svg', brand: 'slack', format: 'square' },
  ],
  [
    { label: 'Discord', icon: '/brand/integrations/discord.svg', brand: 'discord', format: 'square' },
    { label: 'Obsidian', icon: '/brand/integrations/obsidian.svg', brand: 'obsidian', format: 'square' },
    { label: 'Sutur Agent', icon: '/brand/sutur-logo-en.png', brand: 'sutur', format: 'core' },
    { label: 'SAP', icon: '/brand/integrations/sap.svg', brand: 'sap', format: 'wide' },
    { label: 'AutoCAD', icon: '/brand/integrations/autocad.svg', brand: 'autocad', format: 'square' },
  ],
  [
    { label: 'Salesforce', icon: '/brand/integrations/salesforce.svg', brand: 'salesforce', format: 'wide' },
    { label: 'Google Drive', icon: '/brand/integrations/google-drive.svg', brand: 'drive', format: 'square' },
    { label: 'HubSpot', icon: '/brand/integrations/hubspot.svg', brand: 'hubspot', format: 'wide' },
    { label: 'Microsoft Teams', icon: '/brand/integrations/microsoft-teams.svg', brand: 'teams', format: 'square' },
  ],
] as const;

const HEX_RADIUS = 48;
const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS;
const HONEYCOMB_PADDING = 2;
const HONEYCOMB_WIDTH = 5 * HEX_WIDTH + 2 * HONEYCOMB_PADDING;
const HONEYCOMB_HEIGHT = 5 * HEX_RADIUS + 2 * HONEYCOMB_PADDING;
const roundSvg = (value: number) => Number(value.toFixed(3));

export const HONEYCOMB_GEOMETRY = {
  radius: HEX_RADIUS,
  width: HEX_WIDTH,
  padding: HONEYCOMB_PADDING,
  viewBoxWidth: HONEYCOMB_WIDTH,
  viewBoxHeight: HONEYCOMB_HEIGHT,
} as const;

export const INTEGRATION_VIEW_BOX =
  `0 0 ${roundSvg(HONEYCOMB_WIDTH)} ${roundSvg(HONEYCOMB_HEIGHT)}`;

function integrationCenter(rowLength: number, rowIndex: number, appIndex: number) {
  const firstCenterX = HONEYCOMB_PADDING + (rowLength === 5 ? HEX_WIDTH / 2 : HEX_WIDTH);

  return {
    x: firstCenterX + appIndex * HEX_WIDTH,
    y: HONEYCOMB_PADDING + HEX_RADIUS + rowIndex * HEX_RADIUS * 1.5,
  };
}

function hexPoints(centerX: number, centerY: number) {
  const halfWidth = HEX_WIDTH / 2;

  return [
    `${roundSvg(centerX)},${roundSvg(centerY - HEX_RADIUS)}`,
    `${roundSvg(centerX + halfWidth)},${roundSvg(centerY - HEX_RADIUS / 2)}`,
    `${roundSvg(centerX + halfWidth)},${roundSvg(centerY + HEX_RADIUS / 2)}`,
    `${roundSvg(centerX)},${roundSvg(centerY + HEX_RADIUS)}`,
    `${roundSvg(centerX - halfWidth)},${roundSvg(centerY + HEX_RADIUS / 2)}`,
    `${roundSvg(centerX - halfWidth)},${roundSvg(centerY - HEX_RADIUS / 2)}`,
  ].join(' ');
}

export const integrationLayout = integrationRows.map((row, rowIndex) =>
  row.map((app, appIndex) => {
    const { x: centerX, y: centerY } = integrationCenter(row.length, rowIndex, appIndex);

    return {
      app,
      centerX,
      centerY,
      points: hexPoints(centerX, centerY),
    };
  }),
);
