'use client';

import { useEffect, useState } from 'react';

const links = [
  ['Solutions', 'solutions'],
  ['AI agents', 'agents'],
  ['Process', 'process'],
  ['Team', 'team'],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 96);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className={`site-header${scrolled ? ' is-floating' : ''}`}>
        <a className="wordmark" href="#top" aria-label="Sutur home">
          <img src="/brand/sutur-logo-en.png" alt="Sutur" width={116} height={38} />
          <span className="wordmark-divider" aria-hidden="true" />
          <img src="/brand/sutur-logo-ar.png" alt="سطور" width={116} height={38} />
        </a>
        <nav aria-label="Primary navigation">
          {links.map(([label, id]) => (
            <button key={id} onClick={() => go(id)}>{label}</button>
          ))}
        </nav>
        <button className="header-cta" onClick={() => go('book')}>Book a call</button>
        <button className="menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>
        {open && (
          <div className="mobile-menu" id="mobile-navigation">
            {links.map(([label, id]) => (
              <button key={id} onClick={() => go(id)}>{label}</button>
            ))}
            <button onClick={() => go('book')}>Book a call <span>→</span></button>
          </div>
        )}
      </header>
      <button
        className="floating-cta is-visible"
        type="button"
        onClick={() => go('book')}
      >
        <span aria-hidden="true" />
        Book a discovery call
        <b aria-hidden="true">→</b>
      </button>
    </>
  );
}
