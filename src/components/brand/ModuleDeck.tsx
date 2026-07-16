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

export function ModuleDeck() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  const scrollTo = (index: number) => cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  const previous = () => scrollTo((active - 1 + modules.length) % modules.length);
  const next = () => scrollTo((active + 1) % modules.length);
  const updateActive = () => {
    const track = trackRef.current;
    if (!track) return;
    const middle = track.getBoundingClientRect().left + track.clientWidth / 2;
    let nearest = active;
    let smallestDistance = Infinity;
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - middle);
      if (distance < smallestDistance) { smallestDistance = distance; nearest = index; }
    });
    setActive((current) => current === nearest ? current : nearest);
  };

  return <section className={styles.deck} aria-label="Browse core Odoo modules">
    <div
      className={styles.track}
      ref={trackRef}
      tabIndex={0}
      onScroll={updateActive}
      onKeyDown={(event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); previous(); } if (event.key === 'ArrowRight') { event.preventDefault(); next(); } }}
      onWheel={(event) => { if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) { event.preventDefault(); trackRef.current?.scrollBy({ left: event.deltaY, behavior: 'auto' }); } }}
    >
      {modules.map(([name, description, icon], index) => <article className={styles.card} key={name} ref={(card) => { cardRefs.current[index] = card; }} aria-current={active === index ? 'true' : undefined}>
        <div className={styles.cardHead}><span>{String(index + 1).padStart(2, '0')}</span><img src={icon} alt={`${name} icon`} width={100} height={100} /></div>
        <div><p className={styles.overline}>Odoo module</p><h3>{name}</h3><p className={styles.description}>{description}</p></div>
        <span className={styles.spine}>SUTUR × ODOO</span>
      </article>)}
    </div>
    <div className={styles.controls}>
      <button type="button" onClick={previous} aria-label="Previous module">←</button>
      <p><b>{String(active + 1).padStart(2, '0')}</b> / {String(modules.length).padStart(2, '0')}<span>Scroll freely. It settles on the closest module.</span></p>
      <button type="button" onClick={next} aria-label="Next module">→</button>
    </div>
  </section>;
}
