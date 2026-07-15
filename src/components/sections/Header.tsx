'use client';

import { useState } from 'react';
import SuturMark from '@/components/brand/SuturMark';

const links: [string, string][] = [
  ['Solutions', '#solutions'],
  ['Agents', '#agents'],
  ['Process', '#process'],
  ['Team', '#team'],
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a className="brand" href="#top" aria-label="Sutur home">
          <SuturMark />
        </a>
        <nav className="desktop-nav" aria-label="Primary">
          {links.map(([t, h]) => (
            <a key={h} href={h}>{t}</a>
          ))}
          <a className="btn-primary btn-sm" href="#book" style={{ color: '#2a1030' }}>Book a call</a>
        </nav>
        <button className="menu" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
          Menu
        </button>
      </div>
      {open && (
        <div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <header>
            <SuturMark className="text-white" />
            <button className="close-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
              Close
            </button>
          </header>
          <nav>
            {links.map(([t, h]) => (
              <a key={h} href={h} onClick={() => setOpen(false)}>{t}</a>
            ))}
            <a href="#book" onClick={() => setOpen(false)}>Book a call</a>
          </nav>
        </div>
      )}
    </header>
  );
}