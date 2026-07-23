'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const links = [
  ['Product', '/product'],
  ['Solutions', '/solutions'],
  ['Pricing', '/pricing'],
  ['About', '/about'],
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateHeader = () => {
      const hero = document.querySelector('.hero, .page-hero');
      const capabilities = document.querySelector('#capabilities');
      const footer = document.querySelector('.site-footer');
      const afterPrimaryContent = capabilities
        ? capabilities.getBoundingClientRect().bottom <= window.innerHeight * 0.35
        : hero
          ? hero.getBoundingClientRect().bottom <= window.innerHeight * 0.35
        : window.scrollY > 480;
      const footerIsVisible = footer
        ? footer.getBoundingClientRect().top < window.innerHeight
        : false;

      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 96);
      setShowFloatingCta(afterPrimaryContent && !footerIsVisible && pathname !== '/contact');
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('resize', updateHeader);
    return () => {
      window.removeEventListener('scroll', updateHeader);
      window.removeEventListener('resize', updateHeader);
    };
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    };
    window.addEventListener('keydown', closeMenu);
    return () => window.removeEventListener('keydown', closeMenu);
  }, [open]);

  return (
    <>
      <header className={`site-header${scrolled ? ' is-floating' : ''}`}>
        <Link className="wordmark" href="/" aria-label="Sutur home">
          <img
            src="/brand/design-system/sutur-wordmark-soft.png"
            alt="sutur"
            width={124}
            height={45}
          />
          <span className="wordmark-divider" aria-hidden="true" />
          <img
            src="/brand/design-system/sutur-wordmark-arabic-soft.png"
            alt="سطور"
            width={106}
            height={50}
          />
        </Link>

        <nav aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link className="header-cta" href="/contact">
          Book a call
        </Link>

        <button
          ref={menuButtonRef}
          className="menu"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        {open && (
          <div className="mobile-menu" id="mobile-navigation">
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label} <span aria-hidden="true">→</span>
              </Link>
            ))}
            <Link href="/insights">
              Insights <span aria-hidden="true">→</span>
            </Link>
            <Link href="/contact">
              Book a call <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </header>

      <Link
        className={`floating-cta${showFloatingCta ? ' is-visible' : ''}`}
        href="/contact"
      >
        <span aria-hidden="true" />
        Book a discovery call
        <b aria-hidden="true">→</b>
      </Link>
    </>
  );
}
