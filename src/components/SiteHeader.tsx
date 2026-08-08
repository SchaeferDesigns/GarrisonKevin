'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Icon from './Icon';
import { business, telLink, whatsappLink } from '@/lib/business';
import styles from './SiteHeader.module.css';

const navItems = [
  { href: '/leistungen', label: 'Leistungen' },
  { href: '/preise', label: 'Preise' },
  { href: '/ablauf', label: 'Ablauf' },
  { href: '/einsatzgebiet', label: 'Einsatzgebiet' },
  { href: '/ueber-mich', label: 'Über mich' },
  { href: '/faq', label: 'FAQ' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menü bei Seitenwechsel schließen
  useEffect(() => setOpen(false), [pathname]);

  // Scrollen sperren und Escape abfangen, solange das Menü offen ist
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className={styles.wrap}>
        <div className={styles.inner} data-scrolled={scrolled}>
          <Link href="/" className={styles.brand} aria-label={`${business.name} – zur Startseite`}>
            <span className={styles.mark} aria-hidden="true">
              KG
            </span>
            <span className={styles.brandText}>
              <span className={styles.brandName}>{business.name}</span>
              <span className={styles.brandRole}>{business.tagline}</span>
            </span>
          </Link>

          <nav className={styles.nav} aria-label="Hauptnavigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.navLink}
                data-active={isActive(item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link href="/kontakt" className={`btn btn--accent ${styles.cta}`}>
              Angebot anfragen
              <Icon name="arrow-right" size={17} />
            </Link>
            <button
              type="button"
              className={styles.burger}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            >
              <Icon name={open ? 'close' : 'menu'} size={21} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={styles.panel}
        data-open={open}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        inert={!open}
      >
        <div className={styles.panelInner}>
          <Link href="/" className={styles.panelLink} data-active={pathname === '/'}>
            Start
            <Icon name="arrow-right" size={18} />
          </Link>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.panelLink} data-active={isActive(item.href)}>
              {item.label}
              <Icon name="arrow-right" size={18} />
            </Link>
          ))}
          <div className={styles.panelDivider} />
          <div className={styles.panelActions}>
            <Link href="/kontakt" className="btn btn--accent btn--block">
              <Icon name="document" size={18} />
              Angebot anfragen
            </Link>
            <a href={whatsappLink()} className="btn btn--glass btn--block" target="_blank" rel="noreferrer">
              <Icon name="whatsapp" size={18} />
              WhatsApp schreiben
            </a>
            <a href={telLink} className="btn btn--glass btn--block">
              <Icon name="phone" size={18} />
              {business.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
