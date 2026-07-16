'use client';

import { useEffect, useRef, useState } from 'react';
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
const modulo = (value: number, length: number) => (value % length + length) % length;

export function ModuleDeck() {
  const [active, setActive] = useState(0);
  const [drag, setDragState] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [recycling, setRecycling] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const dragRef = useRef(0);
  const settling = useRef(false);
  const wheelTimer = useRef<number | null>(null);
  const distance = () => (stageRef.current?.clientWidth || 600) * .82;
  const setDrag = (value: number) => { dragRef.current = value; setDragState(value); };
  const progress = Math.min(Math.abs(drag) / distance(), 1);

  useEffect(() => () => { if (wheelTimer.current) window.clearTimeout(wheelTimer.current); }, []);

  const settle = (direction?: Direction) => {
    const threshold = distance() * .16;
    const resolved = direction ?? (dragRef.current < -threshold ? 1 : dragRef.current > threshold ? -1 : undefined);
    if (!resolved || settling.current) { setInteracting(false); setDrag(0); return; }
    settling.current = true;
    setInteracting(false);
    setDrag(resolved * distance());
    window.setTimeout(() => {
      const outgoing = active;
      setRecycling(outgoing);
      setActive((current) => modulo(current + resolved, modules.length));
      setDrag(0);
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        setRecycling(null);
        settling.current = false;
      }));
    }, 360);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (settling.current) return;
    startX.current = event.clientX - dragRef.current;
    setInteracting(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interacting || settling.current) return;
    const limit = distance() * .82;
    setDrag(Math.max(-limit, Math.min(limit, event.clientX - startX.current)));
  };
  const onPointerUp = () => { if (interacting) settle(); };
  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (settling.current) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!delta) return;
    event.preventDefault();
    setInteracting(true);
    const limit = distance() * .82;
    setDrag(Math.max(-limit, Math.min(limit, dragRef.current - delta * .62)));
    if (wheelTimer.current) window.clearTimeout(wheelTimer.current);
    wheelTimer.current = window.setTimeout(() => settle(), 95);
  };

  return <section className={styles.deck} aria-label="Browse core Odoo modules">
    <div
      className={`${styles.stage} ${interacting ? styles.dragging : ''}`}
      ref={stageRef}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onKeyDown={(event) => { if (event.key === 'ArrowLeft') settle(-1); if (event.key === 'ArrowRight') settle(1); }}
    >
      {modules.map(([name, description, icon], index) => {
        const forward = modulo(index - active, modules.length);
        const previous = modulo(active - 1, modules.length) === index;
        const isCurrent = forward === 0;
        const isNext = forward === 1;
        const nextProgress = drag < 0 ? progress : 0;
        const previousProgress = drag > 0 ? progress : 0;
        let x = 88 + Math.max(forward - 1, 0) * 22;
        let y = Math.max(forward - 1, 0) * 7;
        let scale = Math.max(.85, .95 - Math.max(forward - 1, 0) * .018);
        let rotate = 3 + Math.max(forward - 1, 0) * .45;
        let rotateY = -5;
        let opacity = 1;
        if (isCurrent) { x = drag; y = 0; scale = 1; rotate = drag / 46; rotateY = -drag / 42; }
        if (isNext) { x = 88 * (1 - nextProgress); y = 7 * (1 - nextProgress); scale = .95 + .05 * nextProgress; rotate = 3 * (1 - nextProgress); rotateY = -5 * (1 - nextProgress); }
        if (previous && previousProgress > 0) { x = -88 * (1 - previousProgress); y = 7 * (1 - previousProgress); scale = .95 + .05 * previousProgress; rotate = -3 * (1 - previousProgress); rotateY = 5 * (1 - previousProgress); }
        if (recycling === index) opacity = 0;
        return <article
          className={`${styles.card} ${isCurrent ? styles.current : ''}`}
          key={name}
          aria-current={isCurrent ? 'true' : undefined}
          style={{ transform: `translateX(calc(-50% + ${x}px)) translateY(${y}px) scale(${scale}) rotateZ(${rotate}deg) rotateY(${rotateY}deg)`, zIndex: isCurrent ? 50 : previous && previousProgress > 0 ? 45 : 40 - forward, opacity }}
        >
          <div className={styles.cardHead}><span>{String(index + 1).padStart(2, '0')}</span><img src={icon} alt={`${name} icon`} width={104} height={104} /></div>
          <div><p className={styles.overline}>Odoo module</p><h3>{name}</h3><p className={styles.description}>{description}</p></div>
          <span className={styles.signature}>SUTUR × ODOO</span>
        </article>;
      })}
    </div>
    <div className={styles.controls}>
      <button type="button" onClick={() => settle(-1)} aria-label="Previous module">←</button>
      <p><b>{String(active + 1).padStart(2, '0')} / {String(modules.length).padStart(2, '0')}</b><span>Drag or scroll through the module deck.</span></p>
      <button type="button" onClick={() => settle(1)} aria-label="Next module">→</button>
    </div>
  </section>;
}
