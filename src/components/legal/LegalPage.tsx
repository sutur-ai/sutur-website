import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './Legal.module.css';

export const COMPANY = 'Sutur Inc.';
export const ADDRESS = '1755 Highway 24 East, Vittoria, ON N0E 1W0, Canada';
export const SUPPORT_EMAIL = 'g.cronkwright@sutur.ai';
export const SUPPORT_PHONE = '+1 519 410 0617';

export function Mail() {
  return <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;
}

export function Phone() {
  return <a href={`tel:${SUPPORT_PHONE.replace(/ /g, '')}`}>{SUPPORT_PHONE}</a>;
}

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return <div className="sx"><main className={`wrap ${styles.page}`}>
    <Link className={styles.home} href="/">← Sutur home</Link>
    <article className={styles.text}>
      <h1>{title}</h1>
      {children}
    </article>
  </main></div>;
}

export function Table({ head, rows }: { head: [string, string]; rows: [ReactNode, ReactNode][] }) {
  return <table className={styles.table}>
    <thead><tr><th scope="col">{head[0]}</th><th scope="col">{head[1]}</th></tr></thead>
    <tbody>{rows.map((row, index) => <tr key={index}><td>{row[0]}</td><td>{row[1]}</td></tr>)}</tbody>
  </table>;
}
