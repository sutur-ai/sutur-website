'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ModuleDeck.module.css';

const modules = [
  ['CRM', '/brand/odoo-modules/crm.png'],
  ['Sales', '/brand/odoo-modules/sales.png'],
  ['Accounting', '/brand/odoo-modules/accounting.png'],
  ['Inventory', '/brand/odoo-modules/inventory.png'],
  ['Purchasing', '/brand/odoo-modules/purchasing.png'],
  ['Manufacturing', '/brand/odoo-modules/manufacturing.png'],
] as const;

function signedDistance(index: number, active: number) {
  const distance = index - active;
  const half = modules.length / 2;
  return distance > half ? distance - modules.length : distance < -half ? distance + modules.length : distance;
}

export function ModuleDeck() {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);
  const previous = useCallback(() => setActive((current) => (current - 1 + modules.length) % modules.length), []);
  const next = useCallback(() => setActive((current) => (current + 1) % modules.length), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') previous();
      if (event.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [next, previous]);

  return (
    <section
      className={styles.deck}
      aria-label="Browse core Odoo modules"
      tabIndex={0}
      onWheel={(event) => { if (Math.abs(event.deltaY) > 12) { event.preventDefault(); event.deltaY > 0 ? next() : previous(); } }}
      onPointerDown={(event) => { touchStart.current = event.clientX; }}
      onPointerUp={(event) => { if (touchStart.current === null) return; const distance = event.clientX - touchStart.current; if (Math.abs(distance) > 35) distance > 0 ? previous() : next(); touchStart.current = null; }}
    >
      <div className={styles.stage} aria-live="polite">
        {modules.map(([name, icon], index) => {
          const position = signedDistance(index, active);
          const isActive = position === 0;
          return <button
            className={`${styles.card} ${isActive ? styles.active : ''}`}
            key={name}
            type="button"
            aria-label={`Show ${name}`}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => setActive(index)}
            style={{ '--position': position, '--depth': Math.abs(position) } as React.CSSProperties}
          >
            <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
            <img src={icon} alt="" width={100} height={100} />
            <strong>{name}</strong>
            {isActive && <span className={styles.current}>Odoo module</span>}
          </button>;
        })}
      </div>
      <div className={styles.controls}>
        <button type="button" onClick={previous} aria-label="Previous module">←</button>
        <p><b>{String(active + 1).padStart(2, '0')}</b> / {String(modules.length).padStart(2, '0')} <span>Scroll, swipe, or use the arrows</span></p>
        <button type="button" onClick={next} aria-label="Next module">→</button>
      </div>
    </section>
  );
}
