'use client';

import { useEffect, useRef, useState } from 'react';
import { sectionLinks } from '@/components/sections/navigation';
import { ArrowIcon, MenuIcon } from '@/components/ui/icons';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateHeader = () => {
      const footer = document.querySelector('.site-footer');
      const footerIsVisible = footer
        ? footer.getBoundingClientRect().top < window.innerHeight
        : false;

      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 96);
      setShowFloatingCta(!footerIsVisible);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('resize', updateHeader);
    return () => {
      window.removeEventListener('scroll', updateHeader);
      window.removeEventListener('resize', updateHeader);
    };
  }, []);

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
        <a className="wordmark" href="#top" aria-label="Sutur home">
          <img
            src="/brand/design-system/sutur-wordmark-soft.png"
            alt="sutur"
            width={124}
            height={45}
          />
        </a>

        <nav aria-label="Primary navigation">
          {sectionLinks.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href="#book">Book</a>

        <button
          ref={menuButtonRef}
          className="menu"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          <span>{open ? 'Close' : 'Menu'}</span>
          <MenuIcon open={open} />
        </button>

        {open && (
          <div className="mobile-menu" id="mobile-navigation">
            {sectionLinks.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label} <ArrowIcon />
              </a>
            ))}
            <a href="#book" onClick={() => setOpen(false)}>
              Book <ArrowIcon />
            </a>
          </div>
        )}
      </header>

      <a
        className={`floating-cta${showFloatingCta ? ' is-visible' : ''}`}
        href="#book"
      >
        <img
          src="/brand/design-system/sutur-icon-soft.png"
          alt=""
          width={24}
          height={29}
        />
        <span>Book a call</span>
        <b><ArrowIcon /></b>
      </a>
    </>
  );
}
