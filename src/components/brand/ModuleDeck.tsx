'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './ModuleDeck.module.css';

const moduleCards = [
  { name: 'CRM', eyebrow: 'Relationships, in context', copy: 'Every lead, conversation, next step, and commercial signal in one calm workspace.', accent: 'violet', glyph: '↗', metric: 'Pipeline clarity' },
  { name: 'Sales', eyebrow: 'From quote to close', copy: 'Build polished proposals, keep approvals moving, and give your team one view of every deal.', accent: 'orange', glyph: '✦', metric: 'Faster quotes' },
  { name: 'Accounting', eyebrow: 'Numbers that stay current', copy: 'Bring invoicing, payments, reconciliation, and reporting into the same operational rhythm.', accent: 'gold', glyph: '∿', metric: 'Live financials' },
  { name: 'Inventory', eyebrow: 'Stock without guesswork', copy: 'See availability, movements, replenishment, and warehouse decisions before they become urgent.', accent: 'blue', glyph: '◫', metric: 'Reliable stock' },
  { name: 'Purchasing', eyebrow: 'A cleaner supply flow', copy: 'Turn demand into controlled purchasing, supplier visibility, and dependable follow-through.', accent: 'green', glyph: '⌁', metric: 'Smarter buying' },
  { name: 'Manufacturing', eyebrow: 'Built for the floor', copy: 'Connect bills of materials, work orders, planning, and quality with the rest of the business.', accent: 'rose', glyph: '◈', metric: 'Connected production' },
] as const;

export function ModuleDeck() {
  const [active, setActive] = useState(0);
  const previous = useCallback(() => setActive((current) => (current - 1 + moduleCards.length) % moduleCards.length), []);
  const next = useCallback(() => setActive((current) => (current + 1) % moduleCards.length), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') previous();
      if (event.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [next, previous]);

  return (
    <section className={styles.deck} aria-label="Explore Odoo modules" tabIndex={0}>
      <div className={styles.stage} aria-live="polite">
        {moduleCards.map((card, index) => {
          const offset = (index - active + moduleCards.length) % moduleCards.length;
          const isActive = offset === 0;
          const isVisible = offset < 3;
          return (
            <article
              className={`${styles.card} ${styles[card.accent]} ${isActive ? styles.active : ''} ${!isVisible ? styles.hidden : ''}`}
              key={card.name}
              aria-hidden={!isActive}
              style={{ '--stack': offset } as React.CSSProperties}
            >
              <div className={styles.cardTop}><span>{String(index + 1).padStart(2, '0')}</span><span className={styles.glyph}>{card.glyph}</span></div>
              <div className={styles.cardCopy}><p>{card.eyebrow}</p><h3>{card.name}</h3><span>{card.copy}</span></div>
              <div className={styles.cardFooter}><i /><b>{card.metric}</b></div>
            </article>
          );
        })}
      </div>
      <div className={styles.controls}>
        <div><span className={styles.counter}>{String(active + 1).padStart(2, '0')}</span><span className={styles.total}> / {String(moduleCards.length).padStart(2, '0')}</span></div>
        <div className={styles.buttons}>
          <button type="button" onClick={previous} aria-label="Previous Odoo module">←</button>
          <button type="button" onClick={next} aria-label="Next Odoo module">→</button>
        </div>
      </div>
      <p className={styles.hint}>Use the arrows or your keyboard to browse the stack.</p>
    </section>
  );
}
