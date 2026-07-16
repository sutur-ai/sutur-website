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

type Direction = -1 | 1;

export function ModuleDeck() {
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const settling = useRef(false);
  const distance = () => (stageRef.current?.clientWidth || 600) * .82;
  const progress = Math.min(Math.abs(drag) / distance(), 1);

  const completeSwipe = (direction: Direction) => {
    if (settling.current || (direction === 1 && active === modules.length - 1) || (direction === -1 && active === 0)) { setDrag(0); return; }
    settling.current = true;
    setDragging(false);
    setDrag(direction * distance());
    window.setTimeout(() => {
      setActive((current) => current + direction);
      setDrag(0);
      settling.current = false;
    }, 360);
  };

  const moveWithArrow = (direction: Direction) => completeSwipe(direction);
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (settling.current) return;
    startX.current = event.clientX;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || settling.current) return;
    const raw = event.clientX - startX.current;
    const allowed = raw > 0 && active === 0 ? raw * .18 : raw < 0 && active === modules.length - 1 ? raw * .18 : raw;
    setDrag(Math.max(-distance() * .8, Math.min(distance() * .8, allowed)));
  };
  const onPointerUp = () => {
    if (!dragging) return;
    const threshold = distance() * .17;
    if (drag < -threshold) completeSwipe(1);
    else if (drag > threshold) completeSwipe(-1);
    else { setDragging(false); setDrag(0); }
  };

  return <section className={styles.deck} aria-label="Browse core Odoo modules">
    <div
      className={`${styles.stage} ${dragging ? styles.dragging : ''}`}
      ref={stageRef}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={(event) => { if (event.key === 'ArrowLeft') moveWithArrow(-1); if (event.key === 'ArrowRight') moveWithArrow(1); }}
    >
      {modules.map(([name, description, icon], index) => {
        const relative = index - active;
        const isCurrent = relative === 0;
        const isNext = relative === 1;
        const isPrevious = relative === -1;
        const nextProgress = drag < 0 ? progress : 0;
        const previousProgress = drag > 0 ? progress : 0;
        let x = 62 + Math.max(relative - 1, 0) * 14;
        let y = Math.max(relative - 1, 0) * 2;
        let scale = .94;
        let rotate = 3;
        let rotateY = -5;
        let opacity = relative < 0 ? 0 : 1;
        if (isCurrent) { x = drag; y = 0; scale = 1; rotate = drag / 42; rotateY = -drag / 34; }
        if (isNext) { x = 62 * (1 - nextProgress); y = 2 * (1 - nextProgress); scale = .94 + .06 * nextProgress; rotate = 3 * (1 - nextProgress); rotateY = -5 * (1 - nextProgress); }
        if (isPrevious && previousProgress > 0) { x = -62 * (1 - previousProgress); y = 2 * (1 - previousProgress); scale = .94 + .06 * previousProgress; rotate = -3 * (1 - previousProgress); rotateY = 5 * (1 - previousProgress); opacity = 1; }
        return <article
          className={`${styles.card} ${isCurrent ? styles.current : ''}`}
          key={name}
          aria-current={isCurrent ? 'true' : undefined}
          style={{ transform: `translateX(calc(-50% + ${x}px)) translateY(${y}px) scale(${scale}) rotateZ(${rotate}deg) rotateY(${rotateY}deg)`, zIndex: 20 - Math.max(relative, 0), opacity }}
        >
          <div className={styles.cardHead}><span>{String(index + 1).padStart(2, '0')}</span><img src={icon} alt={`${name} icon`} width={104} height={104} /></div>
          <div><p className={styles.overline}>Odoo module</p><h3>{name}</h3><p className={styles.description}>{description}</p></div>
          <span className={styles.signature}>SUTUR × ODOO</span>
        </article>;
      })}
    </div>
    <div className={styles.controls}>
      <button type="button" onClick={() => moveWithArrow(-1)} disabled={active === 0} aria-label="Previous module">←</button>
      <p><b>{String(active + 1).padStart(2, '0')} / {String(modules.length).padStart(2, '0')}</b><span>Drag the front card to browse modules.</span></p>
      <button type="button" onClick={() => moveWithArrow(1)} disabled={active === modules.length - 1} aria-label="Next module">→</button>
    </div>
  </section>;
}
