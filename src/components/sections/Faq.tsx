'use client';
import { useState } from 'react';
import { SectionShell } from '../layout/SectionShell';
import { SX_FAQ } from '../../content/faq';
import styles from './Faq.module.css';

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return <SectionShell id="faq" className="sec" style={{ paddingTop: 0 }}><div className={`wrap ${styles['faq-grid']}`}>
    <div className={`sec-head rv ${styles.head}`}><div className="label"><b>05</b> FAQ</div>
      <h2 className="h-section">The practical <span className="nowrap">questions<span className="dot">.</span></span></h2><p className="lead">Anything else, ask us on the call.</p></div>
    <div className={styles.faq}>
      {SX_FAQ.map((faq, index) => <div key={faq.q} className={styles['faq-item']}>
        <button type="button" id={`faq-question-${index}`} className={styles['faq-q']}
          aria-expanded={open === index} aria-controls={`faq-answer-${index}`}
          onClick={() => setOpen(current => current === index ? null : index)}>
          {faq.q}<span className={styles['faq-sign']} aria-hidden="true">{open === index ? '−' : '+'}</span>
        </button>
        <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden={open !== index}>
          {open === index && <p className={styles['faq-a']}>{faq.a}</p>}
        </div>
      </div>)}
    </div>
  </div></SectionShell>;
}
