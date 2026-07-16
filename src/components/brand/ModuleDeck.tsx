'use client';

import { useRef, useState } from 'react';
import styles from './ModuleDeck.module.css';

const modules = [
  ['CRM', 'Relationships, pipeline, and the next right move.', '/brand/odoo-modules/crm.png'],
  ['Sales', 'Quotes, approvals, and every deal in one place.', '/brand/odoo-modules/sales.png'],
  ['Accounting', 'Invoices, payments, and live financial visibility.', '/brand/odoo-modules/accounting.png'],
  ['Inventory', 'Reliable stock, movements, and replenishment.', '/brand/odoo-modules/inventory.png'],
  ['Purchasing', 'Demand, suppliers, and purchase follow-through.', '/brand/odoo-modules/purchasing.png'],
  ['Manufacturing', 'Work orders, planning, and production control.', '/brand/odoo-modules/manufacturing.png'],
] as const;

const shelf = 188;
const shelfStep = 15;

function cardState(index: number, progress: number) {
  const position = index + 1 - progress;
  const depth = Math.min(Math.abs(position), 4);
  if (position >= 1) return { x: shelf + (position - 1) * shelfStep, rotate: 0, scale: .92, depth };
  if (position > 0) return { x: shelf * position, rotate: 0, scale: 1 - .08 * position, depth };
  if (position > -1) return { x: shelf * position, rotate: 0, scale: 1 + .08 * position, depth };
  return { x: -shelf + (position + 1) * shelfStep, rotate: 0, scale: .92, depth };
}

export function ModuleDeck() {
  const [progress, setProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const current = Math.max(0, Math.min(modules.length - 1, Math.round(progress) - 1));
  const goTo = (nextProgress: number) => trackRef.current?.scrollTo({ left: Math.max(0, Math.min(modules.length, nextProgress)) * trackRef.current.clientWidth, behavior: 'smooth' });

  return <section className={styles.deck} aria-label="Browse core Odoo modules">
    <div
      className={styles.track}
      ref={trackRef}
      tabIndex={0}
      onScroll={(event) => setProgress(event.currentTarget.scrollLeft / event.currentTarget.clientWidth)}
      onWheel={(event) => { if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) { event.preventDefault(); trackRef.current?.scrollBy({ left: event.deltaY, behavior: 'auto' }); } }}
      onKeyDown={(event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(Math.round(progress) - 1); } if (event.key === 'ArrowRight') { event.preventDefault(); goTo(Math.round(progress) + 1); } }}
    >
      <div className={styles.spacer}>
        <div className={styles.stage} aria-live="polite">
          {modules.map(([name, description, icon], index) => {
            const state = cardState(index, progress);
            const isCurrent = Math.abs(index + 1 - progress) < .5;
            return <article
              className={`${styles.card} ${isCurrent ? styles.current : ''}`}
              key={name}
              style={{ transform: `translateX(calc(-50% + ${state.x}px)) translateZ(${-state.depth * 35}px) rotateY(${state.rotate}deg) scale(${state.scale})`, zIndex: Math.round(100 - state.depth) }}
              aria-current={isCurrent ? 'true' : undefined}
            >
              <div className={styles.cardHead}><span>{String(index + 1).padStart(2, '0')}</span><img src={icon} alt={`${name} icon`} width={104} height={104} /></div>
              <div><p className={styles.overline}>Odoo module</p><h3>{name}</h3><p className={styles.description}>{description}</p></div>
              <span className={styles.spine}>SUTUR × ODOO</span>
            </article>;
          })}
        </div>
        <div className={styles.snapPoints} aria-hidden="true">{Array.from({ length: modules.length + 1 }, (_, index) => <span key={index} />)}</div>
      </div>
    </div>
    <div className={styles.controls}>
      <button type="button" onClick={() => goTo(Math.round(progress) - 1)} aria-label="Move cards left">←</button>
      <p><b>{progress < .5 ? 'START' : `${String(current + 1).padStart(2, '0')} / ${String(modules.length).padStart(2, '0')}`}</b><span>Swipe left to open the next module.</span></p>
      <button type="button" onClick={() => goTo(Math.round(progress) + 1)} aria-label="Move cards right">→</button>
    </div>
  </section>;
}
