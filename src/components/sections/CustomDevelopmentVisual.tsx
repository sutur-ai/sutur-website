'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import layoutStyles from './CompanyCapabilities.module.css';
import styles from './CustomDevelopmentVisual.module.css';

export type CustomPhase =
  | 'idle'
  | 'typing-purchase'
  | 'selecting-inventory'
  | 'opening-inventory'
  | 'typing-inventory'
  | 'verifying'
  | 'complete'
  | 'restoring'
  | 'restored';

type FileName = 'purchase_order.py' | 'inventory_sync.py';

type CodeLine = {
  number: number;
  text: string;
  added?: boolean;
};

const purchaseSeed: CodeLine[] = [
  { number: 41, text: 'def create_purchase_order(request):' },
];

const purchaseAdditions = [
  '    supplier = resolve_supplier(',
  '        request.supplier_id)',
  '    quantity = validate_quantity(',
  '        request.quantity)',
  '    return odoo.purchase.create(',
  '        supplier, quantity)',
];

const inventorySeed: CodeLine[] = [
  { number: 18, text: 'def sync_inventory(order):' },
];

const inventoryAdditions = [
  '    for line in order.lines:',
  '        stock = warehouse.find(line.sku)',
  '        stock.reserve(line.quantity)',
  '    events.publish("inventory.synced", order.id)',
];

const finalInventoryLines = buildLines(inventorySeed, inventoryAdditions);

function buildLines(seed: CodeLine[], additions: string[]) {
  return [
    ...seed,
    ...additions.map((text, index) => ({
      number: seed[seed.length - 1].number + index + 1,
      text,
      added: true,
    })),
  ];
}

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export function CustomDevelopmentVisual({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<CustomPhase>('idle');
  const [activeFile, setActiveFile] = useState<FileName>('purchase_order.py');
  const [typedLines, setTypedLines] = useState<CodeLine[]>(purchaseSeed);
  const [cursorPoint, setCursorPoint] = useState<{ x: number; y: number } | null>(null);
  const runRef = useRef(0);
  const hasRunRef = useRef(false);
  const editorShellRef = useRef<HTMLDivElement>(null);
  const inventoryFileRef = useRef<HTMLElement>(null);
  const isTyping = phase === 'typing-purchase' || phase === 'typing-inventory';
  const showTerminal = ['verifying', 'complete', 'restoring'].includes(phase);
  const checksPassed = phase === 'complete' || phase === 'restoring';
  const showCompletion = phase === 'complete' || phase === 'restoring';
  const cursorTarget = phase === 'selecting-inventory' || phase === 'opening-inventory'
    ? 'inventory'
    : 'code';

  useLayoutEffect(() => {
    const shell = editorShellRef.current;
    const target = inventoryFileRef.current;
    if (!shell || !target) return;

    const alignCursor = () => {
      const shellBox = shell.getBoundingClientRect();
      const targetBox = target.getBoundingClientRect();
      setCursorPoint({
        x: targetBox.left - shellBox.left + targetBox.width / 2,
        y: targetBox.top - shellBox.top + targetBox.height / 2,
      });
    };

    alignCursor();
    const observer = new ResizeObserver(alignCursor);
    observer.observe(shell);
    observer.observe(target);
    return () => observer.disconnect();
  }, [cursorTarget, activeFile]);

  useEffect(() => {
    if (!active) {
      runRef.current += 1;
      hasRunRef.current = false;
      setPhase('idle');
      setActiveFile('purchase_order.py');
      setTypedLines(purchaseSeed);
      return;
    }

    if (hasRunRef.current) return;
    hasRunRef.current = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveFile('inventory_sync.py');
      setTypedLines(finalInventoryLines);
      setPhase('complete');
      return;
    }

    const run = ++runRef.current;
    const currentRun = () => runRef.current === run;

    const typeAdditions = async (seed: CodeLine[], additions: string[]) => {
      let lines = [...seed];
      setTypedLines(lines);

      for (const [lineIndex, target] of additions.entries()) {
        const lineNumber = seed[seed.length - 1].number + lineIndex + 1;
        for (let characterIndex = 1; characterIndex <= target.length; characterIndex += 1) {
          if (!currentRun()) return false;
          setTypedLines([
            ...lines,
            {
              number: lineNumber,
              text: target.slice(0, characterIndex),
              added: true,
            },
          ]);
          await wait(characterIndex % 4 === 0 ? 20 : 12);
        }
        lines = [...lines, { number: lineNumber, text: target, added: true }];
        setTypedLines(lines);
        await wait(90);
      }
      return currentRun();
    };

    const runSequence = async () => {
      setPhase('typing-purchase');
      if (!await typeAdditions(purchaseSeed, purchaseAdditions)) return;
      await wait(360);
      if (!currentRun()) return;

      setPhase('selecting-inventory');
      await wait(760);
      if (!currentRun()) return;

      setPhase('opening-inventory');
      setActiveFile('inventory_sync.py');
      setTypedLines(inventorySeed);
      await wait(420);
      if (!currentRun()) return;

      setPhase('typing-inventory');
      if (!await typeAdditions(inventorySeed, inventoryAdditions)) return;
      await wait(300);
      if (!currentRun()) return;

      setPhase('verifying');
      await wait(1_250);
      if (!currentRun()) return;

      setPhase('complete');
      await wait(1_850);
      if (!currentRun()) return;

      setPhase('restoring');
      await wait(900);
      if (!currentRun()) return;

      setActiveFile('purchase_order.py');
      setTypedLines(purchaseSeed);
      setPhase('restored');
    };

    void runSequence();
    return () => {
      runRef.current += 1;
    };
  }, [active]);

  return (
    <div
      className={`${layoutStyles.visual} ${styles.customVisual}`}
      data-custom-phase={phase}
      aria-hidden="true"
    >
      <div className={styles.productWindow}>
        <header className={styles.windowChrome}>
          <div className={styles.windowControls}><i /><i /><i /></div>
          <span>sutur-workflows · VS Code</span>
          <div className={styles.editorPresence} data-presence={isTyping ? 'typing' : phase}>
            <b>S</b>
            <em>{isTyping ? 'Developer typing' : phase === 'complete' ? 'Done' : 'Developer'}</em>
          </div>
        </header>

        <div className={styles.editorShell} ref={editorShellRef}>
          <aside className={styles.fileTree}>
            <strong>EXPLORER</strong>
            <span>⌄ sutur-odoo</span>
            <span className={styles.folder}>⌄ src</span>
            <i
              className={activeFile === 'purchase_order.py' ? styles.activeFile : ''}
              data-file="purchase_order.py"
              data-file-active={activeFile === 'purchase_order.py'}
            >purchase_order.py</i>
            <i
              ref={inventoryFileRef}
              className={activeFile === 'inventory_sync.py' ? styles.activeFile : ''}
              data-file="inventory_sync.py"
              data-file-active={activeFile === 'inventory_sync.py'}
              data-cursor-target-row
            >inventory_sync.py</i>
            <i>supplier_rules.py</i>
            <span className={styles.quietFile}>› tests</span>
            <i className={styles.quietFile}>README.md</i>
          </aside>

          <section className={styles.editorPane}>
            <div className={styles.breadcrumbs}>src <b>›</b> {activeFile}</div>
            <div className={styles.editorTab} data-active-tab={activeFile}>
              <span><i>Py</i>{activeFile}</span>
              <b>●</b>
            </div>
            <code className={styles.codeEditor} data-code-file={activeFile}>
              {typedLines.map((line, index) => (
                <span
                  className={`${styles.codeLine} ${line.added ? styles.addedLine : ''}`}
                  data-code-line
                  key={`${activeFile}-${line.number}`}
                >
                  <b>{line.number}</b>
                  <em>{line.added ? '+' : ' '}</em>
                  <i>
                    {line.text}
                    {isTyping && index === typedLines.length - 1 ? <u className={styles.caret} /> : null}
                  </i>
                </span>
              ))}
            </code>

            <div
              className={`${styles.terminalPanel} ${showTerminal ? styles.terminalVisible : ''}`}
              data-terminal
            >
              <header><span>TERMINAL</span><i>×</i></header>
              <code><b>$</b> pytest tests/workflows -q</code>
              <p data-test-result={checksPassed ? 'passed' : 'running'}>
                {checksPassed ? '8 passed in 0.42s' : 'Running workflow checks…'}
              </p>
            </div>
          </section>

          <svg
            className={styles.mouseCursor}
            data-cursor-target={cursorTarget}
            data-cursor-click={phase === 'opening-inventory'}
            style={cursorPoint ? {
              '--cursor-target-x': `${cursorPoint.x}px`,
              '--cursor-target-y': `${cursorPoint.y}px`,
            } as CSSProperties : undefined}
            viewBox="0 0 24 28"
          >
            <path d="M3 2.5 20.2 15l-7.2 1.5 4.3 7.4-4.1 2.1-4-7.4-5 5.1L3 2.5Z" />
          </svg>

          <footer className={styles.statusBar}>
            <span>main*</span>
            <span>Python 3.12</span>
            <span>Ln {typedLines.at(-1)?.number ?? 1}, Col {typedLines.at(-1)?.text.length ?? 1}</span>
          </footer>
        </div>

        <div className={styles.completionToast} data-completion-toast={showCompletion}>
          <i>✓</i>
          <p><strong>Development complete</strong><span>2 files changed · 8 checks passed</span></p>
        </div>
      </div>
    </div>
  );
}
