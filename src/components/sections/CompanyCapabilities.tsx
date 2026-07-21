import styles from './CompanyCapabilities.module.css';

const capabilities = [
  {
    number: '01',
    label: 'Odoo ERP implementation',
    title: 'One reliable system for the whole operation.',
    description:
      'We implement Odoo around your real operation — from CRM and accounting to inventory, purchasing, and delivery — so your team works from one source of truth.',
    cta: 'Plan your ERP implementation',
    visual: 'erp',
  },
  {
    number: '02',
    label: 'Custom development',
    title: 'Built for you. Grounded in Lebanon.',
    description:
      'We design software around your workflow and the Lebanese market, including bilingual teams, local payment realities, and the exceptions generic products miss.',
    cta: 'Discuss your custom build',
    visual: 'custom',
  },
  {
    number: '03',
    label: 'AI agent architecture',
    title: 'An AI layer that understands the full picture.',
    description:
      'We connect your ERP, documents, messages, and internal knowledge through a permission-aware agent architecture. It brings context into every step and removes repetitive follow-through.',
    cta: 'Design your agent architecture',
    visual: 'agent',
  },
] as const;

type VisualKind = (typeof capabilities)[number]['visual'];

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

function CapabilityVisual({ kind }: { kind: VisualKind }) {
  if (kind === 'erp') {
    return (
      <div className={`${styles.visual} ${styles.erpVisual}`} aria-hidden="true">
        <div className={styles.productWindow}>
          <WindowChrome title="Odoo · Apps" />
          <div className={styles.odooHome}>
            <div className={styles.odooBrand}>
              <b>odoo</b>
              <span>Good evening, Sutur</span>
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
                <i className={styles.appIcon}><img src="/brand/odoo-modules/crm.png" alt="" /></i>
                <span>CRM</span>
              </div>
              <div className={styles.odooApp}>
                <i className={styles.appIcon}><img src="/brand/odoo-modules/sales.png" alt="" /></i>
                <span>Sales</span>
              </div>
              <div className={styles.odooApp}>
                <i className={styles.appIcon}><img src="/brand/odoo-modules/accounting.png" alt="" /></i>
                <span>Accounting</span>
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
      <div className={styles.productWindow}>
        <WindowChrome title="Sutur Agent · Operations" />
        <div className={styles.chatApp}>
          <div className={styles.chatHeader}>
            <i>S</i>
            <span>
              <b>Sutur Operations Agent</b>
              <small>Connected to Odoo · online</small>
            </span>
          </div>
          <div className={styles.chatMessages}>
            <div className={`${styles.chatMessage} ${styles.userMessage}`}>
              <span>Create a purchase order from Supplier X for 350 units of the Brown Winter Jacket.</span>
              <small>09:41 ✓✓</small>
            </div>
            <div className={`${styles.chatMessage} ${styles.agentMessage}`}>
              <span>Draft PO P00042 created — 350 × Brown Winter Jacket from Supplier X. Ready for approval.</span>
              <small>09:41</small>
            </div>
            <div className={`${styles.chatMessage} ${styles.userMessage}`}>
              <span>What else needs attention today?</span>
              <small>09:42 ✓✓</small>
            </div>
            <div className={`${styles.chatMessage} ${styles.agentMessage}`}>
              <span>Two items are below safety stock. Replenishment drafts are ready.</span>
              <small>09:42</small>
            </div>
          </div>
          <div className={styles.chatComposer}>
            <span>Message Sutur Agent</span>
            <i>↑</i>
          </div>
        </div>
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
          <p className="eyebrow">WHAT SUTUR BUILDS</p>
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
