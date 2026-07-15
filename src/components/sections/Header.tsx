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
      <div className="container inner">
        <a href="#top" aria-label="Sutur home">
          <SuturMark />
        </a>
        <nav className="desktop-nav" aria-label="Primary">
          {links.map(([t, h]) => (
            <a key={h} href={h}>{t}</a>
          ))}
          <a href="#book" className="btn-nav">Book a call</a>
        </nav>
        <button className="menu-toggle" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
          Menu
        </button>
      </div>
      {open && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="top">
            <SuturMark />
            <button className="close" aria-label="Close menu" onClick={() => setOpen(false)}>Close</button>
          </div>
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