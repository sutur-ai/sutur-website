'use client';

import { useInView } from '../../lib/useInView';
import styles from './NightShift.module.css';

const rows = [
  { time: '18:00', delay: '0s', text: 'You log off', sub: "Rafic picks up tonight's schedule", variant: 'off' },
  { time: '19:00', delay: '1.2s', text: "Logged today's 86 orders", sub: 'Shopify to your ERP', icon: '/brand/apps/shopify.svg' },
  { time: '22:30', delay: '2.4s', text: 'Matched 41 payments to invoices', sub: "2 didn't match, flagged for you", icon: '/brand/apps/quickbooks.svg' },
  { time: '02:00', delay: '3.6s', text: 'Read 12 supplier replies', sub: 'One delivery moved to Thursday', icon: '/brand/apps/gmail.svg' },
  { time: '05:30', delay: '4.8s', text: 'Drafted 3 client follow-ups', sub: 'Waiting for your yes', icon: '/brand/apps/hubspot.svg' },
  { time: '07:30', delay: '6s', text: 'Good morning, Maya. 3 things need you.', sub: 'Your brief is ready in Rafic', icon: '/brand/design-system/sutur-icon-soft.png', variant: 'brief' },
];

export function NightShiftVisual() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`vis rv${inView ? '' : ' idle'}`} role="img" aria-label="Overnight, Rafic logs orders, matches payments, reads supplier replies and drafts follow-ups, then sends a morning brief">
      <div className={styles.shift}>
        <div className={styles['shift-top']}>
          <div className={styles['shift-t']}>
            <span className={styles.moon}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg></span>
            Rafic&apos;s night shift
          </div>
          <span className={styles.offline}><span className={styles['offline-dot']} />You: offline</span>
        </div>
        <div className={styles.feed}>
          <div className={styles.vline}><div className={styles['vline-fill']} /></div>
          {rows.map(row => (
            <div key={row.time} className={styles.frow} style={{ animationDelay: row.delay }}>
              <span className={styles.ftime}>{row.time}</span>
              <span className={`${styles.fdot}${row.variant === 'brief' ? ` ${styles.brief}` : ''}`} />
              <div className={`${styles.fcard}${row.variant ? ` ${styles[row.variant]}` : ''}`}>
                {row.icon && <img src={row.icon} width="20" height="20" alt="" />}
                <span className={styles.ftxt}>{row.text}<span className={styles.fsub}>{row.sub}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
