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

function CapabilityVisual({ kind }: { kind: VisualKind }) {
  if (kind === 'erp') {
    return (
      <div className={`${styles.visual} ${styles.erpVisual}`} aria-hidden="true">
        <div className={styles.appWindow}>
          <div className={styles.windowBar}>
            <span />
            <span />
            <span />
            <b>Odoo ERP</b>
          </div>
          <div className={styles.erpBody}>
            <div className={styles.erpNav}>
              <i className={styles.activeModule}>CRM</i>
              <i>Accounting</i>
              <i>Inventory</i>
              <i>Purchase</i>
            </div>
            <div className={styles.erpDashboard}>
              <span className={styles.status}>All systems connected</span>
              <div className={styles.metricRow}>
                <i />
                <i />
                <i />
              </div>
              <div className={styles.chart}>
                <i />
                <i />
                <i />
                <i />
                <i />
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
        <div className={styles.localeRow}>
          <span>EN</span>
          <span lang="ar">عربي</span>
          <span>LBP / USD</span>
        </div>
        <div className={styles.customWindow}>
          <div className={styles.customHeader}>
            <span>Workflow built around you</span>
            <i>LIVE</i>
          </div>
          <div className={styles.flowRow}>
            <span>Request</span>
            <b>→</b>
            <span>Local rules</span>
            <b>→</b>
            <span>Done</span>
          </div>
          <div className={styles.codeLines}>
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.visual} ${styles.agentVisual}`} aria-hidden="true">
      <div className={`${styles.agentNode} ${styles.agentNodeOdoo}`}>Odoo</div>
      <div className={`${styles.agentNode} ${styles.agentNodeDocs}`}>Docs</div>
      <div className={`${styles.agentNode} ${styles.agentNodeInbox}`}>Inbox</div>
      <div className={`${styles.agentNode} ${styles.agentNodeTeam}`}>Team</div>
      <span className={styles.agentRing} />
      <div className={styles.agentCore}>
        <b>S</b>
        <small>Business context</small>
      </div>
      <div className={styles.answerCard}>
        <span>Next step ready</span>
        <b>Approve supplier plan →</b>
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

      <div
        className={styles.architecture}
        role="img"
        aria-label="Sutur connects business systems and knowledge to clear decisions and completed work"
      >
        <div className={styles.architectureTopline}>
          <span>YOUR BUSINESS, CONNECTED END TO END</span>
          <span><i /> Context stays with the work</span>
        </div>
        <div className={styles.architectureBody}>
          <div className={styles.sourceNodes}>
            <span>CRM</span>
            <span>Accounting</span>
            <span>Inventory</span>
            <span>Documents</span>
          </div>
          <span className={`${styles.flowLine} ${styles.flowLineIn}`} />
          <div className={styles.suturCore}>
            <b>S</b>
            <span>SUTUR CONTEXT</span>
            <small>Odoo · Custom systems · AI agents</small>
          </div>
          <span className={`${styles.flowLine} ${styles.flowLineOut}`} />
          <div className={styles.outcomeNodes}>
            <span>Answer with evidence <b>↗</b></span>
            <span>Next step prepared <b>↗</b></span>
            <span>Follow-through handled <b>↗</b></span>
          </div>
        </div>
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
