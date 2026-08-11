import Link from 'next/link';
import Icon from '@/components/Icon';
import PageHero from '@/components/PageHero';
import { services } from '@/lib/business';

export default function NotFound() {
  return (
    <>
      <PageHero
        kicker="Fehler 404"
        title="Diese Seite gibt es nicht"
        lead="Der Link ist vermutlich veraltet oder enthält einen Tippfehler. Hier geht es zurück zu den wichtigsten Seiten."
      />

      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="grid grid--3">
            <Link href="/" className="card card--link">
              <span className="card__icon">
                <Icon name="arrow-right" size={22} />
              </span>
              <h2 style={{ fontSize: '1.2rem' }}>Startseite</h2>
              <p className="small muted">Überblick über Leistungen, Preise und Ablauf.</p>
            </Link>

            {services.map((service) => (
              <Link key={service.slug} href={`/leistungen/${service.slug}`} className="card card--link">
                <span className="card__icon">
                  <Icon name={service.icon} size={22} />
                </span>
                <h2 style={{ fontSize: '1.2rem' }}>{service.title}</h2>
                <p className="small muted">{service.short}</p>
              </Link>
            ))}
          </div>

          <div className="btn-row mt-8">
            <Link href="/kontakt" className="btn btn--accent">
              Zur Anfrage
              <Icon name="arrow-right" size={17} />
            </Link>
            <Link href="/leistungen" className="btn btn--ghost">
              Preise ansehen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
