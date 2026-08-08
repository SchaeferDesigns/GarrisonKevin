import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CtaSection from '@/components/CtaSection';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { business, serviceAreas } from '@/lib/business';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Einsatzgebiet – Aalen und Umgebung',
  description:
    'Bodenverlegung, Sockelleisten und Fugenarbeiten in Aalen, Hüttlingen, Wasseralfingen, Oberkochen, Essingen, Abtsgmünd und im Umkreis von rund 20 Kilometern.',
  alternates: { canonical: '/einsatzgebiet' },
};

export default function EinsatzgebietPage() {
  return (
    <>
      <PageHero
        kicker="Einsatzgebiet"
        title={`${business.serviceAreaLabel} – rund ${business.serviceRadiusKm} km`}
        lead="Ich arbeite bewusst regional. Kurze Wege bedeuten verlässliche Termine, schnelle Besichtigungen und die Möglichkeit, auch später noch einmal vorbeizuschauen."
        crumbs={[{ name: 'Einsatzgebiet', path: '/einsatzgebiet' }]}
      >
        <span className="badge badge--dark">
          <Icon name="map-pin" size={15} />
          Sitz in {business.postalCode} {business.city}
        </span>
        <span className="badge badge--dark">
          <Icon name="handshake" size={15} />
          Regionaler Betrieb
        </span>
      </PageHero>

      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="section-head">
            <span className="kicker">Orte</span>
            <h2>Orte im Umkreis von rund 20 km</h2>
            <p className="lead">
              Die Liste zeigt Orte, die im genannten Radius liegen, und ist nicht abschließend. Wenn Ihr Ort nicht
              dabei ist, fragen Sie einfach nach.
            </p>
          </div>

          <Reveal>
            <ul className="badge-row">
              {serviceAreas.map((place) => (
                <li key={place} className="badge badge--accent" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                  <Icon name="map-pin" size={14} />
                  {place}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="split mt-8">
            <Reveal className="panel">
              <span className="card__icon">
                <Icon name="clock" size={22} />
              </span>
              <h3>Kurze Wege, gehaltene Termine</h3>
              <p className="small muted">
                Kurze Wege im Einsatzgebiet machen die Terminplanung realistisch. Es hängt kein Arbeitstag an einer
                langen Autobahnfahrt.
              </p>
            </Reveal>

            <Reveal className="panel" delay={100}>
              <span className="card__icon">
                <Icon name="handshake" size={22} />
              </span>
              <h3>Auch nach dem Auftrag erreichbar</h3>
              <p className="small muted">
                Sollte an einer Leiste oder einer Fuge etwas nachzuarbeiten sein, bin ich schnell wieder da. Das ist der
                praktische Vorteil eines regionalen Betriebs gegenüber einer überregionalen Firma.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="split split--wide-left">
            <div>
              <span className="kicker">Außerhalb des Gebiets</span>
              <h2 className="mt-4">Weiter weg? Fragen Sie trotzdem</h2>
              <p className="lead mt-4">
                Bei größeren Aufträgen lohnt sich auch eine längere Anfahrt. Sagen Sie mir einfach, wo das Objekt liegt
                und um welchen Umfang es geht – dann sage ich Ihnen ehrlich, ob es sinnvoll ist oder ob Sie mit einem
                Betrieb vor Ort besser fahren.
              </p>

              <div className="btn-row mt-6">
                <Link href="/kontakt" className="btn btn--accent">
                  Anfrage stellen
                  <Icon name="arrow-right" size={17} />
                </Link>
              </div>
            </div>

            <div className="stats" style={{ gridTemplateColumns: '1fr' }}>
              <div className="stat">
                <span className="stat__value">{business.serviceRadiusKm} km</span>
                <span className="stat__label">Radius um Aalen</span>
              </div>
              <div className="stat">
                <span className="stat__value">ab 18 €</span>
                <span className="stat__label">pro m² Arbeitsleistung</span>
              </div>
              <div className="stat">
                <span className="stat__value">24 Std.</span>
                <span className="stat__label">Übliche Antwortzeit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaSection />

      <JsonLd data={breadcrumbSchema([{ name: 'Einsatzgebiet', path: '/einsatzgebiet' }])} />
    </>
  );
}
