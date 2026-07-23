import styles from './CompanyCapabilities.module.css';

const capabilities = [
  {
    number: '01',
    label: 'AI agent architecture',
    title: 'An AI layer that understands the full picture.',
    description:
      'We connect your ERP, documents, messages, and internal knowledge through a permission-aware agent architecture. It brings context into every step and removes repetitive follow-through.',
    cta: 'Design your agent architecture',
    visual: 'agent',
  },
  {
    number: '02',
    label: 'Odoo ERP implementation',
    title: 'One reliable system for the whole operation.',
    description:
      'We implement Odoo around your real operation — from CRM and accounting to inventory, purchasing, and delivery — so your team works from one source of truth.',
    cta: 'Plan your ERP implementation',
    visual: 'erp',
  },
  {
    number: '03',
    label: 'Custom development',
    title: 'Built for you. Grounded in Lebanon.',
    description:
      'We design software around your workflow and the Lebanese market, including bilingual teams, local payment realities, and the exceptions generic products miss.',
    cta: 'Discuss your custom build',
    visual: 'custom',
  },
] as const;

const integrationRows = [
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

const integrationLayout = [
  { y: 48, centers: [64, 149, 233, 318] },
  { y: 128, centers: [22, 106, 191, 276, 360] },
  { y: 208, centers: [64, 149, 233, 318] },
] as const;

function hexPoints(centerX: number, centerY: number) {
  return [
    `${centerX - 21},${centerY - 48}`,
    `${centerX + 21},${centerY - 48}`,
    `${centerX + 42},${centerY}`,
    `${centerX + 21},${centerY + 48}`,
    `${centerX - 21},${centerY + 48}`,
    `${centerX - 42},${centerY}`,
  ].join(' ');
}

export type VisualKind = (typeof capabilities)[number]['visual'];

function WindowChrome({ title }: { title: string }) {
  return (
    <div className={styles.windowChrome}>
      <div className={styles.windowControls}>
        <i />
        <i />
        <i />
      </div>
      <span>{title}</span>
    </div>
  );
}

export function CapabilityVisual({ kind }: { kind: VisualKind }) {
  if (kind === 'erp') {
    return (
      <div className={`${styles.visual} ${styles.erpVisual}`} aria-hidden="true">
        <div className={styles.productWindow}>
          <WindowChrome title="Odoo · Apps" />
          <div className={styles.odooHome}>
            <div className={styles.odooTopbar}>
              <b>odoo</b>
              <div className={styles.odooProfile}>
                <i className={styles.searchGlyph} />
                <span>4</span>
                <small>Sutur Workspace</small>
                <i className={styles.profileGlyph}>A</i>
              </div>
            </div>
            <div className={styles.appLauncher}>
              <div className={styles.odooApp}>
                <i className={`${styles.appIcon} ${styles.discussIcon}`}>D</i>
                <span>Discuss</span>
              </div>
              <div className={styles.odooApp}>
                <i className={`${styles.appIcon} ${styles.calendarIcon}`}>31</i>
                <span>Calendar</span>
              </div>
              <div className={styles.odooApp}>
                <i className={`${styles.appIcon} ${styles.appointmentsIcon}`}>31<small>✓</small></i>
                <span>Appointments</span>
              </div>
              <div className={styles.odooApp}>
                <i className={`${styles.appIcon} ${styles.contactsIcon}`}>ID</i>
                <span>Contacts</span>
              </div>
              <div className={styles.odooApp}>
                <i className={styles.appIcon}><img src="/brand/odoo-modules/crm.png" alt="" /></i>
                <span>CRM</span>
              </div>
              <div className={styles.odooApp}>
                <i className={styles.appIcon}><img src="/brand/odoo-modules/sales.png" alt="" /></i>
                <span>Sales</span>
              </div>
              <div className={styles.odooApp}>
                <i className={`${styles.appIcon} ${styles.dashboardIcon}`}><small /><small /><small /></i>
                <span>Dashboards</span>
              </div>
              <div className={styles.odooApp}>
                <i className={`${styles.appIcon} ${styles.posIcon}`}>POS</i>
                <span>Point of Sale</span>
              </div>
              <div className={styles.odooApp}>
                <i className={styles.appIcon}><img src="/brand/odoo-modules/accounting.png" alt="" /></i>
                <span>Accounting</span>
              </div>
              <div className={styles.odooApp}>
                <i className={styles.appIcon}><img src="/brand/odoo-modules/ecommerce.png" alt="" /></i>
                <span>Website</span>
              </div>
              <div className={styles.odooApp}>
                <i className={styles.appIcon}><img src="/brand/odoo-modules/inventory.png" alt="" /></i>
                <span>Inventory</span>
              </div>
              <div className={styles.odooApp}>
                <i className={styles.appIcon}><img src="/brand/odoo-modules/purchasing.png" alt="" /></i>
                <span>Purchase</span>
              </div>
              <div className={styles.odooApp}>
                <i className={styles.appIcon}><img src="/brand/odoo-modules/manufacturing.png" alt="" /></i>
                <span>Manufacturing</span>
              </div>
              <div className={styles.odooApp}>
                <i className={`${styles.appIcon} ${styles.settingsIcon}`}><small /><b /></i>
                <span>Settings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'custom') {
    return (
      <div className={`${styles.visual} ${styles.customVisual}`} aria-hidden="true">
        <div className={styles.productWindow}>
          <WindowChrome title="sutur-workflows · VS Code" />
          <div className={styles.editorShell}>
            <div className={styles.fileTree}>
              <strong>EXPLORER</strong>
              <span>⌄ sutur-odoo</span>
              <span>⌄ src</span>
              <i className={styles.activeFile}>purchase_order.py</i>
              <i>inventory_sync.py</i>
              <i>supplier_rules.py</i>
              <span>› tests</span>
              <i>README.md</i>
            </div>
            <div className={styles.editorPane}>
              <div className={styles.editorTab}>
                <span>purchase_order.py</span>
                <i>M</i>
              </div>
              <code className={styles.codeEditor}>
                <span className={styles.codeLine}><b>41</b><em> </em><i>def create_purchase_order(request):</i></span>
                <span className={`${styles.codeLine} ${styles.removedLine}`}><b>42</b><em>−</em><i>supplier = request[&quot;supplier&quot;]</i></span>
                <span className={`${styles.codeLine} ${styles.addedLine}`}><b>42</b><em>+</em><i>supplier = resolve_supplier(</i></span>
                <span className={`${styles.codeLine} ${styles.addedLine}`}><b>43</b><em>+</em><i>request.supplier_id)</i></span>
                <span className={`${styles.codeLine} ${styles.addedLine}`}><b>44</b><em>+</em><i>quantity = validate_quantity(</i></span>
                <span className={`${styles.codeLine} ${styles.addedLine}`}><b>45</b><em>+</em><i>request.quantity)</i></span>
                <span className={`${styles.codeLine} ${styles.removedLine}`}><b>46</b><em>−</em><i>return draft</i></span>
                <span className={`${styles.codeLine} ${styles.addedLine}`}><b>46</b><em>+</em><i>return odoo.purchase.create(</i></span>
                <span className={styles.codeLine}><b>47</b><em> </em><i>supplier, quantity)</i></span>
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.visual} ${styles.agentVisual}`} aria-hidden="true">
      <div className={styles.integrationField}>
        <svg
          className={styles.integrationGrid}
          viewBox="0 0 382 241"
          preserveAspectRatio="xMidYMid meet"
        >
          {integrationRows.flatMap((row, rowIndex) => (
            row.map((app, appIndex) => {
              const centerX = integrationLayout[rowIndex].centers[appIndex];
              const centerY = integrationLayout[rowIndex].y;
              const isCore = app.brand === 'sutur';
              const logoWidth = isCore ? 58 : app.format === 'wide' ? 50 : 36;
              const logoHeight = isCore ? 25 : app.format === 'wide' ? 30 : 36;

              return (
                <g key={app.label}>
                  <polygon
                    className={`${styles.integrationHex} ${isCore ? styles.coreHex : ''}`}
                    points={hexPoints(centerX, centerY)}
                  />
                  <image
                    className={isCore ? styles.suturCoreLogo : styles.integrationLogo}
                    href={app.icon}
                    x={centerX - logoWidth / 2}
                    y={centerY - logoHeight / 2}
                    width={logoWidth}
                    height={logoHeight}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </g>
              );
            })
          ))}
        </svg>
      </div>
    </div>
  );
}

export function CompanyCapabilities() {
  return (
    <section
      className={`section scroll-section surface-paper ${styles.section}`}
      id="capabilities"
      aria-labelledby="capabilities-title"
    >
      <div className={styles.intro}>
        <div>
          <p className="eyebrow">What sutur builds</p>
          <h2 id="capabilities-title">
            One connected business.
            <br />
            {' '}<em>Three ways to move it forward.</em>
          </h2>
        </div>
        <p className={styles.summary}>
          We create the operating foundation, the tools that fit, and the
          intelligence layer above them. Every engagement starts with how your
          business actually works.
        </p>
      </div>

      <div className={styles.capabilityGrid} role="list">
        {capabilities.map((capability) => (
          <article className={styles.capability} role="listitem" key={capability.number}>
            <CapabilityVisual kind={capability.visual} />
            <div className={styles.capabilityCopy}>
              <div className={styles.capabilityLabel}>
                <span>{capability.number}</span>
                <p>{capability.label}</p>
              </div>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
              <a href="#book" aria-label={`${capability.cta} — book a discovery call`}>
                {capability.cta} <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
