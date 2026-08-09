import Link from 'next/link';
import Icon from './Icon';
import { business, services, telLink, whatsappLink } from '@/lib/business';
import styles from './SiteFooter.module.css';

const pages = [
  { href: '/preise', label: 'Preise' },
  { href: '/ablauf', label: 'Ablauf' },
  { href: '/einsatzgebiet', label: 'Einsatzgebiet' },
  { href: '/ratgeber', label: 'Ratgeber' },
  { href: '/ueber-mich', label: 'Über mich' },
  { href: '/faq', label: 'Häufige Fragen' },
  { href: '/kontakt', label: 'Kontakt & Anfrage' },
];

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="ambient" aria-hidden="true" />
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <span className={styles.brandTop}>
              <span className={styles.mark} aria-hidden="true">
                KG
              </span>
              <span>
                <span className={styles.brandName}>{business.name}</span>
                <span className={styles.brandRole}>{business.tagline}</span>
              </span>
            </span>
            <p className="small">
              Bodenverlegung für Laminat, Vinyl und Klickböden, Sockelleisten sowie Acryl- und Silikonfugen in{' '}
              {business.serviceAreaLabel}. Sauber, termingerecht und fair kalkuliert.
            </p>
          </div>

          <nav aria-labelledby="footer-leistungen">
            <h2 className={styles.colTitle} id="footer-leistungen">
              Leistungen
            </h2>
            <ul className={styles.links}>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/leistungen/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
              <li>
                <Link href="/leistungen">Alle Leistungen</Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-seiten">
            <h2 className={styles.colTitle} id="footer-seiten">
              Seiten
            </h2>
            <ul className={styles.links}>
              {pages.map((p) => (
                <li key={p.href}>
                  <Link href={p.href}>{p.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={styles.colTitle}>Kontakt</h2>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <Icon name="phone" size={18} />
                <a href={telLink}>{business.phone}</a>
              </li>
              <li className={styles.contactItem}>
                <Icon name="whatsapp" size={18} />
                <a href={whatsappLink()} target="_blank" rel="noreferrer">
                  WhatsApp schreiben
                </a>
              </li>
              <li className={styles.contactItem}>
                <Icon name="mail" size={18} />
                <a href={`mailto:${business.email}`}>{business.email}</a>
              </li>
              <li className={styles.contactItem}>
                <Icon name="map-pin" size={18} />
                <span>
                  {business.street}
                  <br />
                  {business.postalCode} {business.city}
                </span>
              </li>
            </ul>

            <div className={`${styles.ctaBox} mt-6`}>
              <span className={styles.ctaTitle}>Angebot in 24 Stunden</span>
              <p className="small">Kurz beschreiben, was ansteht – Sie erhalten eine ehrliche Einschätzung.</p>
              <Link href="/kontakt" className="btn btn--accent btn--block">
                Anfrage starten
                <Icon name="arrow-right" size={17} />
              </Link>
            </div>
          </div>
        </div>

        <p className={styles.note}>{business.vatNote} Alle genannten Preise sind Richtwerte für die Arbeitsleistung.</p>

        <div className={styles.bottom}>
          <span>
            © {new Date().getFullYear()} {business.name} · {business.tagline}
          </span>
          <ul className={styles.legal}>
            <li>
              <Link href="/impressum">Impressum</Link>
            </li>
            <li>
              <Link href="/datenschutz">Datenschutz</Link>
            </li>
            <li>
              <Link href="/kontakt">Kontakt</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
