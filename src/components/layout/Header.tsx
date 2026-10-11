'use client';
import { useEffect, useState } from 'react';

const links = [
  ['what', 'What Rafic does'], ['teams', 'Use cases'], ['control', 'Control'],
  ['start', 'How you start'], ['faq', 'FAQ'],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const desktop = window.matchMedia('(width > 1100px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    closeOnDesktop();
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  return <header className="nav" onKeyDown={event => { if (event.key === 'Escape') { close(); event.currentTarget.querySelector<HTMLButtonElement>('.nav-menu')?.focus(); } }}>
    <div className="wrap nav-in">
      <a href="#top" aria-label="Sutur home" onClick={close}><img className="nav-brand" src="/brand/sutur-wordmark-deep.png" width={1551} height={562} alt="Sutur" /></a>
      <nav className="nav-links" aria-label="Main">{links.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <div className="nav-actions">
        <a className="btn nav-cta" href="#book" onClick={close}>Book a demo</a>
        <button className="nav-menu" type="button" aria-label="Menu" aria-controls="phone-menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
    </div>
    {open && <nav id="phone-menu" className="nav-drop" aria-label="Menu">
      {links.map(([id, label]) => <a key={id} href={`#${id}`} onClick={close}>{label}</a>)}
      <a className="btn" href="#book" onClick={close}>Book a demo</a>
    </nav>}
  </header>;
}
