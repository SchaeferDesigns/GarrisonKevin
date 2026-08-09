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
        lead="Gearbeitet wird in Aalen und Umgebung, in einem Radius von rund 20 Kilometern. Die Anfahrt innerhalb des Einsatzgebiets ist im Preis enthalten."
        crumbs={[{ name: 'Einsatzgebiet', path: '/einsatzgebiet' }]}
      >
        <span className="badge badge--dark">
          <Icon name="map-pin" size={15} />
          Sitz in {business.postalCode} {business.city}
        </span>
        <span className="badge badge--dark">
          <Icon name="euro" size={15} />
          Anfahrt im Gebiet inklusive
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
              <h3>Anfahrt im Preis enthalten</h3>
              <p className="small muted">
                Innerhalb des Einsatzgebiets wird für die Anfahrt nichts zusätzlich berechnet. Es zählt allein die
                Arbeitsleistung nach den genannten Richtwerten.
              </p>
            </Reveal>

            <Reveal className="panel" delay={100}>
              <span className="card__icon">
                <Icon name="handshake" size={22} />
              </span>
              <h3>Erreichbarkeit</h3>
              <p className="small muted">
                Montag bis Samstag von 8 bis 18 Uhr, per Telefon, WhatsApp oder E-Mail. Auf Anfragen folgt in der Regel
                innerhalb von 24 Stunden eine Rückmeldung.
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
                Die 20 Kilometer sind ein Richtwert. Bei größeren Aufträgen sind auch weitere Wege möglich – sagen Sie
                einfach, wo das Objekt liegt und um welchen Umfang es geht.
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
                <span className="stat__value">0 €</span>
                <span className="stat__label">Anfahrt im Einsatzgebiet</span>
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
