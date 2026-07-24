import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import layoutStyles from './CompanyCapabilities.module.css';
import styles from './ERPImplementationVisual.module.css';

export type ERPPhase =
  | 'idle'
  | 'selecting-pos'
  | 'opening-pos'
  | 'adding-item'
  | 'item-added'
  | 'selecting-payment'
  | 'processing-payment'
  | 'payment-success'
  | 'selecting-accounting'
  | 'opening-accounting'
  | 'journal-items'
  | 'complete'
  | 'restoring'
  | 'restored';

export const ERP_SEQUENCE = {
  selectingPosMs: 850,
  openingPosMs: 950,
  addingItemMs: 1_500,
  itemAddedMs: 650,
  selectingPaymentMs: 850,
  processingPaymentMs: 950,
  paymentSuccessMs: 1_400,
  selectingAccountingMs: 900,
  openingAccountingMs: 650,
  journalItemsMs: 1_300,
  completeMs: 1_850,
  restoringMs: 800,
} as const;

const odooApps: ReadonlyArray<{
  name: string;
  icon: string;
  target?: 'pos' | 'accounting';
}> = [
  { name: 'Discuss', icon: '/brand/odoo-apps/discuss.png' },
  { name: 'Calendar', icon: '/brand/odoo-apps/calendar.png' },
  { name: 'Appointments', icon: '/brand/odoo-apps/appointments.png' },
  { name: 'Contacts', icon: '/brand/odoo-apps/contacts.png' },
  { name: 'CRM', icon: '/brand/odoo-modules/crm.png' },
  { name: 'Sales', icon: '/brand/odoo-modules/sales.png' },
  { name: 'Dashboards', icon: '/brand/odoo-apps/dashboards.png' },
  { name: 'Point of Sale', icon: '/brand/odoo-apps/point-of-sale.png', target: 'pos' },
  { name: 'Accounting', icon: '/brand/odoo-modules/accounting.png', target: 'accounting' },
  { name: 'Website', icon: '/brand/odoo-modules/ecommerce.png' },
  { name: 'Inventory', icon: '/brand/odoo-modules/inventory.png' },
  { name: 'Purchase', icon: '/brand/odoo-modules/purchasing.png' },
  { name: 'Manufacturing', icon: '/brand/odoo-modules/manufacturing.png' },
  { name: 'Settings', icon: '/brand/odoo-apps/settings.png' },
] as const;

const journalItems = [
  { account: '101200 Cash', label: 'Cash payment', debit: '$18.00', credit: '—' },
  { account: '400000 Product Sales', label: 'Mug', debit: '—', credit: '$16.36' },
  { account: '210200 Sales Tax 10%', label: 'Sales tax', debit: '—', credit: '$1.64' },
] as const;

const phaseTargets: Partial<Record<ERPPhase, string>> = {
  'selecting-pos': 'pos',
  'adding-item': 'product',
  'selecting-payment': 'payment',
  'selecting-accounting': 'accounting',
};

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

function WindowChrome({ phase }: { phase: ERPPhase }) {
  const title = ['idle', 'selecting-pos', 'selecting-accounting', 'restored'].includes(phase)
    ? 'Odoo · Apps'
    : ['opening-accounting', 'journal-items', 'complete', 'restoring'].includes(phase)
      ? 'Odoo · Accounting'
      : 'Odoo · Point of Sale';

  return (
    <header className={styles.windowChrome}>
      <div className={styles.windowControls}><i /><i /><i /></div>
      <span>{title}</span>
      <div className={styles.workspacePresence}><b>A</b><em>Sutur Workspace</em></div>
    </header>
  );
}

function OdooTopbar({ app }: { app?: 'Point of Sale' | 'Accounting' }) {
  return (
    <div className={styles.odooTopbar}>
      <div className={styles.odooBrand}>
        {app && <span className={styles.appGridGlyph}>⠿</span>}
        <b>odoo</b>
        {app && <strong>{app}</strong>}
      </div>
      <div className={styles.odooProfile}>
        <i className={styles.searchGlyph} />
        <span>4</span>
        <small>Sutur Workspace</small>
        <i className={styles.profileGlyph}>A</i>
      </div>
    </div>
  );
}

function AppLauncher({ emphasizeAccounting = false }: { emphasizeAccounting?: boolean }) {
  return (
    <section className={styles.odooHome} data-erp-scene="launcher">
      <OdooTopbar />
      <div className={styles.appLauncher}>
        {odooApps.map((app) => (
          <div
            className={`${styles.odooApp} ${app.target === 'accounting' && emphasizeAccounting ? styles.targetApp : ''}`}
            data-erp-target={app.target}
            key={app.name}
          >
            <i className={styles.appIcon}><img src={app.icon} alt="" /></i>
            <span>{app.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function POSRegister({ phase }: { phase: ERPPhase }) {
  const hasItem = phase === 'item-added' || phase === 'selecting-payment' || phase === 'processing-payment';
  const processingPayment = phase === 'processing-payment';
  return (
    <section className={styles.posRegister} data-erp-scene="pos-register">
      <header className={styles.posHeader}>
        <p><img src="/brand/odoo-apps/point-of-sale.png" alt="" /><strong>Sutur Shop</strong><span>POS/0001</span></p>
        <div><span>Orders</span><span>Customer</span><b>A</b></div>
      </header>
      <div className={styles.registerBody}>
        <div className={styles.catalogue}>
          <header><span>All products</span><div>Search products…</div></header>
          <div className={styles.productGrid}>
            <article className={`${styles.productCard} ${styles.productTarget}`} data-erp-target="product">
              <div className={styles.mugArt}><i /></div>
              <p><strong>Mug</strong><span>$18.00</span></p>
            </article>
            <article className={styles.productCard}><div className={styles.tshirtArt}><i /></div><p><strong>T-Shirt</strong><span>$24.00</span></p></article>
            <article className={styles.productCard}><div className={styles.pantsArt}><i /></div><p><strong>Pants</strong><span>$38.00</span></p></article>
          </div>
        </div>
        <aside className={styles.orderPanel} data-cart-state={hasItem ? 'filled' : 'empty'}>
          <header><p><strong>Order 0001</strong><span>Walk-in Customer</span></p><i>•••</i></header>
          <div className={styles.orderLines}>
            {hasItem ? (
              <article data-order-line>
                <div className={styles.orderThumbnail} data-cart-thumbnail="mug"><i /></div>
                <p><strong>Mug</strong><span>1 × $18.00</span></p>
                <b>$18.00</b>
              </article>
            ) : (
              <div className={styles.emptyCart}><i>＋</i><strong>Your cart is empty</strong><span>Select a product to start the order.</span></div>
            )}
          </div>
          <div className={styles.orderTotals}>
            <p><span>Untaxed</span><b>{hasItem ? '$16.36' : '$0.00'}</b></p>
            <p><span>Tax 10%</span><b>{hasItem ? '$1.64' : '$0.00'}</b></p>
            <p><strong>Total</strong><strong>{hasItem ? '$18.00' : '$0.00'}</strong></p>
          </div>
          <div
            className={styles.paymentButton}
            data-enabled={hasItem}
            data-payment-state={!hasItem ? 'disabled' : processingPayment ? 'loading' : 'ready'}
            data-erp-target="payment"
          >
            {processingPayment && <i data-payment-spinner />}
            <span>{processingPayment ? 'Processing payment…' : 'Payment'}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

function PaidReceipt() {
  return (
    <section className={styles.receiptScene} data-erp-scene="receipt">
      <OdooTopbar app="Point of Sale" />
      <div className={styles.receiptWorkspace}>
        <article className={styles.receiptPaper}>
          <i>✓</i><h2>Payment successful</h2><span>Order 0001 · Cash</span>
          <div><p><span>Mug × 1</span><b>$18.00</b></p><p><span>Tax included</span><b>$1.64</b></p><p><strong>Total</strong><strong>$18.00</strong></p></div>
        </article>
        <aside>
          <p><strong>Payment complete</strong><span>The sale is saved. Returning to the Odoo home page…</span></p>
          <div className={styles.homeReturnStatus}><i>⌂</i><span>Back to apps</span></div>
        </aside>
      </div>
    </section>
  );
}

function AccountingJournal({ phase }: { phase: ERPPhase }) {
  const revealRows = ['journal-items', 'complete', 'restoring'].includes(phase);
  return (
    <section className={styles.accountingScene} data-erp-scene="accounting" data-journal-revealed={revealRows}>
      <OdooTopbar app="Accounting" />
      <div className={styles.accountingBody}>
        <main className={styles.journalWorkspace}>
          <header>
            <p><span>Accounting / Journal Items</span><strong>Journal Items</strong></p>
          </header>
          <div className={styles.sessionSummary}>
            <p><img src="/brand/odoo-apps/point-of-sale.png" alt="" /><span><strong>POS/0001 · Sutur Shop</strong><small>Paid just now · 1 order</small></span></p>
            <b data-entry-status={revealRows ? 'posted' : 'loading'}>{revealRows ? 'Posted' : 'Loading entry…'}</b>
          </div>
          <div className={styles.journalTable} data-journal-table>
            <div className={styles.tableHead}><span>Account</span><span>Label</span><span>Debit</span><span>Credit</span></div>
            {journalItems.map((item, index) => (
              <div className={styles.journalRow} data-journal-row key={item.account} style={{ '--row-index': index } as CSSProperties}>
                <span><b>{item.account.split(' ')[0]}</b>{' '}{item.account.split(' ').slice(1).join(' ')}</span>
                <span><b>{item.label}</b><small>Sutur Shop/0001</small></span>
                <strong>{item.debit}</strong><strong>{item.credit}</strong>
              </div>
            ))}
            <footer><span>3 journal items</span><span /><strong>$18.00</strong><strong>$18.00</strong></footer>
          </div>
        </main>
      </div>
      {phase === 'opening-accounting' && <div className={styles.accountingLoader}><i /><span>Opening journal items</span></div>}
    </section>
  );
}

export function ERPImplementationVisual({ active }: { active: boolean }) {
  const [internalPhase, setInternalPhase] = useState<ERPPhase>('idle');
  const [cursorPoint, setCursorPoint] = useState<{ x: number; y: number } | null>(null);
  const runRef = useRef(0);
  const hasRunRef = useRef(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const phase = internalPhase;
  const cursorTarget = phaseTargets[phase];

  useLayoutEffect(() => {
    const shell = windowRef.current;
    if (!shell || !cursorTarget) {
      setCursorPoint(null);
      return;
    }
    const target = shell.querySelector<HTMLElement>(`[data-erp-target="${cursorTarget}"]`);
    if (!target) {
      setCursorPoint(null);
      return;
    }

    const alignCursor = () => {
      const shellBox = shell.getBoundingClientRect();
      const targetBox = target.getBoundingClientRect();
      setCursorPoint({
        x: targetBox.left - shellBox.left + targetBox.width / 2,
        y: targetBox.top - shellBox.top + targetBox.height / 2,
      });
    };

    alignCursor();
    const alignmentFrame = window.requestAnimationFrame(alignCursor);
    const settledAlignment = window.setTimeout(alignCursor, 460);
    const observer = new ResizeObserver(alignCursor);
    observer.observe(shell);
    observer.observe(target);
    return () => {
      window.cancelAnimationFrame(alignmentFrame);
      window.clearTimeout(settledAlignment);
      observer.disconnect();
    };
  }, [cursorTarget, phase]);

  useEffect(() => {
    if (!active) {
      runRef.current += 1;
      hasRunRef.current = false;
      setInternalPhase('idle');
      return;
    }
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInternalPhase('complete');
      return;
    }

    const run = ++runRef.current;
    const currentRun = () => runRef.current === run;
    const step = async (next: ERPPhase, duration: number) => {
      if (!currentRun()) return false;
      setInternalPhase(next);
      await wait(duration);
      return currentRun();
    };

    const runSequence = async () => {
      if (!await step('selecting-pos', ERP_SEQUENCE.selectingPosMs)) return;
      if (!await step('opening-pos', ERP_SEQUENCE.openingPosMs)) return;
      if (!await step('adding-item', ERP_SEQUENCE.addingItemMs)) return;
      if (!await step('item-added', ERP_SEQUENCE.itemAddedMs)) return;
      if (!await step('selecting-payment', ERP_SEQUENCE.selectingPaymentMs)) return;
      if (!await step('processing-payment', ERP_SEQUENCE.processingPaymentMs)) return;
      if (!await step('payment-success', ERP_SEQUENCE.paymentSuccessMs)) return;
      if (!await step('selecting-accounting', ERP_SEQUENCE.selectingAccountingMs)) return;
      if (!await step('opening-accounting', ERP_SEQUENCE.openingAccountingMs)) return;
      if (!await step('journal-items', ERP_SEQUENCE.journalItemsMs)) return;
      if (!await step('complete', ERP_SEQUENCE.completeMs)) return;
      if (!await step('restoring', ERP_SEQUENCE.restoringMs)) return;
      setInternalPhase('restored');
    };

    void runSequence();
    return () => { runRef.current += 1; };
  }, [active]);

  const launcher = phase === 'idle' || phase === 'selecting-pos' || phase === 'restored';
  const register = ['opening-pos', 'adding-item', 'item-added', 'selecting-payment', 'processing-payment'].includes(phase);
  const receipt = phase === 'payment-success';
  const selectingAccounting = phase === 'selecting-accounting';
  const accounting = ['opening-accounting', 'journal-items', 'complete', 'restoring'].includes(phase);
  const cursorClick = ['selecting-pos', 'adding-item', 'selecting-payment', 'selecting-accounting'].includes(phase);

  return (
    <div
      className={`${layoutStyles.visual} ${styles.erpVisual}`}
      data-erp-phase={phase}
      aria-hidden="true"
    >
      <div className={styles.productWindow} ref={windowRef}>
        <WindowChrome phase={phase} />
        <div className={styles.sceneViewport}>
          {launcher && <AppLauncher />}
          {register && <POSRegister phase={phase} />}
          {receipt && <PaidReceipt />}
          {selectingAccounting && <AppLauncher emphasizeAccounting />}
          {accounting && <AccountingJournal phase={phase} />}
        </div>

        <svg
          className={styles.mouseCursor}
          data-erp-cursor={cursorTarget ?? 'hidden'}
          data-cursor-click={cursorClick}
          style={cursorPoint ? {
            '--cursor-target-x': `${cursorPoint.x}px`,
            '--cursor-target-y': `${cursorPoint.y}px`,
          } as CSSProperties : undefined}
          viewBox="0 0 24 28"
        >
          <path d="M0 0 17.2 12.5 10 14l4.3 7.4-4.1 2.1-4-7.4-5 5.1L0 0Z" />
        </svg>

        <div className={styles.progressRail} data-erp-progress={phase}>
          <span data-step="pos"><i />POS sale</span>
          <b />
          <span data-step="sale"><i />Payment</span>
          <b />
          <span data-step="accounting"><i />Journal entry</span>
        </div>

        <div className={styles.completionToast} data-completion-toast={phase === 'complete' || phase === 'restoring'}>
          <i>✓</i><p><strong>Sale reconciled</strong><span>POS/0001 · Debits and credits balance</span></p>
        </div>
      </div>
    </div>
  );
}
