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
type Phase = 'idle' | 'dragging' | 'settling' | 'resetting';

const modulo = (value: number, length: number) => (value % length + length) % length;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const SETTLE_MS = 500;

export function ModuleDeck() {
  const [active, setActive] = useState(0);
  const [dragX, setDragState] = useState(0);
  const [motionSide, setMotionSide] = useState<Direction | 0>(0);
  const [phase, setPhaseState] = useState<Phase>('idle');
  const [recycling, setRecycling] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activePointer = useRef<number | null>(null);
  const originX = useRef(0);
  const dragRef = useRef(0);
  const phaseRef = useRef<Phase>('idle');
  const lastSample = useRef({ x: 0, time: 0 });
  const velocity = useRef(0);
  const settleTimer = useRef<number | null>(null);

  const setPhase = (next: Phase) => {
    phaseRef.current = next;
    setPhaseState(next);
  };

  const setDrag = (next: number) => {
    dragRef.current = next;
    setDragState(next);
  };

  const cardWidth = () => {
    const card = stageRef.current?.querySelector<HTMLElement>('article');
    return card?.offsetWidth ?? 330;
  };

  const exitDistance = () => cardWidth() * 1.22;

  const finishReset = (recycledCard?: number) => {
    if (recycledCard !== undefined) setRecycling(recycledCard);
    setPhase('resetting');
    setDrag(0);
    setMotionSide(0);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      setPhase('idle');
      setRecycling(null);
    }));
  };

  const complete = (direction?: Direction) => {
    if (phaseRef.current === 'settling' || phaseRef.current === 'resetting') return;

    const width = cardWidth();
    const threshold = width * 0.3;
    const flick = Math.abs(velocity.current) > 0.48;
    const resolved = direction ?? (
      Math.abs(dragRef.current) >= threshold || flick
        ? (dragRef.current < 0 ? 1 : -1)
        : undefined
    );

    activePointer.current = null;
    velocity.current = 0;
    setPhase('settling');

    if (!resolved) {
      setDrag(0);
      settleTimer.current = window.setTimeout(finishReset, SETTLE_MS);
      return;
    }

    const travelSide: Direction = resolved > 0 ? -1 : 1;
    setMotionSide(travelSide);
    setDrag(travelSide * exitDistance());
    settleTimer.current = window.setTimeout(() => {
      const outgoing = active;
      setActive((current) => modulo(current + resolved, modules.length));
      finishReset(outgoing);
    }, SETTLE_MS);
  };

  useEffect(() => () => {
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (phaseRef.current === 'settling' || phaseRef.current === 'resetting') return;
    activePointer.current = event.pointerId;
    originX.current = event.clientX - dragRef.current;
    lastSample.current = { x: event.clientX, time: event.timeStamp };
    velocity.current = 0;
    setPhase('dragging');
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== event.pointerId || phaseRef.current !== 'dragging') return;

    const limit = exitDistance();
    const next = clamp(event.clientX - originX.current, -limit, limit);
    const elapsed = Math.max(1, event.timeStamp - lastSample.current.time);
    velocity.current = (event.clientX - lastSample.current.x) / elapsed;
    lastSample.current = { x: event.clientX, time: event.timeStamp };

    if (Math.abs(next) > 1) setMotionSide(next < 0 ? -1 : 1);
    setDrag(next);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== event.pointerId) return;
    complete();
  };

  const progress = clamp(Math.abs(dragX) / exitDistance(), 0, 1);
  const candidate = motionSide === 0
    ? null
    : modulo(active + (motionSide < 0 ? 1 : -1), modules.length);

  return (
    <section className={styles.deck} aria-label="Browse core Odoo modules">
      <div
        className={`${styles.stage} ${styles[phase]}`}
        ref={stageRef}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') complete(-1);
          if (event.key === 'ArrowRight') complete(1);
        }}
      >
        {modules.map(([name, description, icon], index) => {
          const forward = modulo(index - active, modules.length);
          const isCurrent = forward === 0;
          const isCandidate = candidate === index;
          const rank = Math.max(1, forward);

          let x = 10 + (rank - 1) * 8;
          let y = (rank - 1) * 1.5;
          let scale = Math.max(0.93, 0.982 - (rank - 1) * 0.009);
          let rotateY = -3 - (rank - 1) * 0.55;
          let rotateZ = 1.5 + (rank - 1) * 0.35;
          let zIndex = 40 - rank;
          let contentOpacity = 0;

          if (isCandidate && motionSide !== 0) {
            const startX = motionSide < 0 ? 10 : -10;
            x = startX * (1 - progress);
            y = 0;
            scale = 0.982 + 0.018 * progress;
            rotateY = (motionSide < 0 ? -4 : 4) * (1 - progress);
            rotateZ = (motionSide < 0 ? 1.6 : -1.6) * (1 - progress);
            zIndex = 49;
            contentOpacity = clamp((progress - 0.42) / 0.34, 0, 1);
          }

          if (isCurrent) {
            x = dragX;
            y = 0;
            scale = 1 - progress * 0.018;
            rotateY = progress * 52 * (dragX < 0 ? -1 : dragX > 0 ? 1 : 0);
            rotateZ = progress * 2.2 * (dragX < 0 ? -1 : dragX > 0 ? 1 : 0);
            zIndex = 50;
            contentOpacity = clamp(1 - progress * 1.15, 0, 1);
          }

          return (
            <article
              className={`${styles.card} ${isCurrent ? styles.current : ''}`}
              key={name}
              aria-current={isCurrent ? 'true' : undefined}
              aria-hidden={recycling === index || (!isCurrent && !isCandidate)}
              style={{
                transform: `translate3d(calc(-50% + ${x}px), ${y}px, 0) scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                zIndex,
                opacity: recycling === index ? 0 : 1,
              }}
            >
              <div className={styles.cardContent} style={{ opacity: contentOpacity }}>
                <div className={styles.cardHead}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <img src={icon} alt={`${name} icon`} width={92} height={92} draggable={false} />
                </div>
                <div>
                  <p className={styles.overline}>Odoo module</p>
                  <h3>{name}</h3>
                  <p className={styles.description}>{description}</p>
                </div>
                <span className={styles.signature}>SUTUR × ODOO</span>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.controls}>
        <button type="button" onClick={() => complete(-1)} aria-label="Previous module">←</button>
        <p>
          <b>{String(active + 1).padStart(2, '0')} / {String(modules.length).padStart(2, '0')}</b>
          <span>Drag the card in either direction.</span>
        </p>
        <button type="button" onClick={() => complete(1)} aria-label="Next module">→</button>
      </div>
    </section>
  );
}
