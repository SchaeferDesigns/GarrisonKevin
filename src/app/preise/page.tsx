import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CtaSection from '@/components/CtaSection';
import PriceCalculator from '@/components/PriceCalculator';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import FaqList from '@/components/FaqList';
import { business, extras, faqs, hourlyRate, importantNotes, notOffered, notOfferedExtra, prices } from '@/lib/business';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Preise – Bodenverlegung, Sockelleisten & Fugen',
  description:
    'Transparente Richtwerte: Bodenverlegung ab 18 €/m² inklusive Trittschalldämmung und Anfahrt, Sockelleisten ab 7 €/lfm, Fugen ab 6 €/lfm. Mit Preisrechner.',
  alternates: { canonical: '/preise' },
};

export default function PreisePage() {
  return (
    <>
      <PageHero
        kicker="Preise"
        title="Was es kostet – vorher, nicht hinterher"
        lead="Alle Preise gelten für die Arbeitsleistung. Das Material stellt und bezahlt der Kunde. Verbindlich wird der Preis im schriftlichen Angebot nach der Besichtigung vor Ort."
        crumbs={[{ name: 'Preise', path: '/preise' }]}
      >
        <span className="badge badge--dark">
          <Icon name="euro" size={15} />
          Ohne versteckte Positionen
        </span>
        <span className="badge badge--dark">
          <Icon name="document" size={15} />
          Festpreis nach Besichtigung
        </span>
        <span className="badge badge--dark">
          <Icon name="map-pin" size={15} />
          Anfahrt inklusive
        </span>
      </PageHero>

      {/* Preisübersicht */}
      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="grid grid--3">
            {prices.map((price, i) => (
              <Reveal key={price.id} delay={i * 90}>
                <article className="card" style={{ height: '100%' }}>
                  <span className="kicker">{price.label}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2.6rem',
                      lineHeight: 1,
                      color: 'var(--forest-800)',
                    }}
                  >
                    ab {price.from} €
                  </span>
                  <span className="small muted">{price.unitLong}</span>
                  <p className="small muted">{price.note}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="panel panel--muted mt-8">
            <div className="split">
              <div>
                <h2 style={{ fontSize: '1.4rem' }}>Kleine Aufträge</h2>
                <p className="small muted mt-2">
                  Unter {hourlyRate.thresholdOrderValue} € Auftragswert wird nach Stunden abgerechnet: ab{' '}
                  {hourlyRate.amount} € pro Stunde bei mindestens {hourlyRate.minHours.toLocaleString('de-DE')} Stunden.
                </p>
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem' }}>Anfahrt inklusive</h2>
                <p className="small muted mt-2">
                  Innerhalb des Einsatzgebiets – {business.serviceAreaLabel}, rund {business.serviceRadiusKm} km – ist
                  die Anfahrt im Preis enthalten. Bezahlt wird per {business.paymentMethods}.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Rechner */}
      <section className="section section--sand" id="rechner">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="section-head">
            <span className="kicker">Richtwert-Rechner</span>
            <h2>Grobe Einschätzung in 30 Sekunden</h2>
            <p className="lead">
              Tragen Sie Ihre Maße ein und Sie sehen den Richtwert für die Arbeitsleistung.
            </p>
          </div>

          <PriceCalculator />
        </div>
      </section>

      {/* Was enthalten ist */}
      <section className="section section--dark">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="split">
            <div>
              <span className="kicker">Enthalten</span>
              <h2 className="mt-4">Das steckt im Preis</h2>
              <ul className="list mt-6">
                {[
                  'Verlegen von Laminat, Vinyl und Klickböden',
                  'Trittschalldämmung und Dampfsperre',
                  'Untergrund reinigen, grundieren, kleine Unebenheiten ausgleichen',
                  'Zuschnitt und Montage der Sockelleisten',
                  'Alte Fugen entfernen und neu ziehen',
                  'Anfahrt innerhalb des Einsatzgebiets',
                  'Besichtigung vor Ort und schriftliches Angebot',
                ].map((item) => (
                  <li key={item}>
                    <Icon name="check" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="kicker">Nicht enthalten</span>
              <h2 className="mt-4">Das kommt separat</h2>
              <ul className="list mt-6">
                <li>
                  <Icon name="ban" size={18} />
                  Material: Boden, Leisten, Profile und Silikon
                </li>
                <li>
                  <Icon name="ban" size={18} />
                  Alten Belag entfernen und abtransportieren – nach Aufwand als eigene Position
                </li>
                <li>
                  <Icon name="ban" size={18} />
                  Übergangsprofile und Türblätter kürzen – auf Wunsch, separat berechnet
                </li>
                <li>
                  <Icon name="ban" size={18} />
                  Estricharbeiten und großflächiges Ausgleichen des Untergrunds
                </li>
                <li>
                  <Icon name="ban" size={18} />
                  Beläge außerhalb des Angebots: {notOffered.join(', ')}
                </li>
                <li>
                  <Icon name="ban" size={18} />
                  {notOfferedExtra.join(', ')}
                </li>
              </ul>

              <div className="panel mt-8">
                <h3 style={{ fontSize: '1.1rem' }}>Material stellt der Kunde</h3>
                <p className="small">
                  Sie kaufen den Boden zum Preis Ihres Händlers, berechnet wird ausschließlich die Arbeitsleistung.
                </p>
                <p className="small">
                  Aussuchen müssen Sie es nicht allein: Auf Wunsch suchen wir das Material gemeinsam aus. Gegen
                  Transportkosten liefere ich es auch an.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zusatzleistungen */}
      <section className="section section--sand">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="section-head">
            <span className="kicker">Auf Wunsch</span>
            <h2>Was sich dazubuchen lässt</h2>
            <p className="lead">
              Diese Arbeiten gehören nicht automatisch dazu. Wenn Sie sie brauchen, stehen sie als eigene Position im
              Angebot – Sie sehen also genau, was sie kosten.
            </p>
          </div>

          <div className="grid grid--4">
            {extras.map((extra, i) => (
              <Reveal key={extra.title} delay={i * 80}>
                <article className="card" style={{ height: '100%' }}>
                  <span className="card__icon">
                    <Icon name={(['handshake', 'plank', 'skirting', 'ruler'] as const)[i] ?? 'check'} size={21} />
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-sans)' }}>{extra.title}</h3>
                  <p className="small muted">{extra.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Antwort auf den häufigsten Einwand */}
      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container container--narrow">
          <div className="section-head">
            <span className="kicker">Ehrlich gerechnet</span>
            <h2>„Das ist mir zu teuer“ – der häufigste Satz</h2>
            <p className="lead">
              Den Satz höre ich regelmäßig. Meistens liegt es daran, dass sich Angebote schlecht vergleichen lassen.
              Drei Punkte, auf die es beim Vergleich ankommt.
            </p>
          </div>

          <ul className="list">
            <li>
              <Icon name="check" size={18} />
              <strong>Es ist reine Arbeitsleistung.</strong> Das Material kaufen Sie selbst zum Preis Ihres Händlers.
              Vergleichbar sind deshalb nicht Quadratmeterpreise, sondern Endsummen.
            </li>
            <li>
              <Icon name="check" size={18} />
              <strong>Trittschalldämmung, Dampfsperre und Anfahrt sind enthalten.</strong> Diese drei Positionen kommen
              nicht zusätzlich auf die Rechnung.
            </li>
            <li>
              <Icon name="check" size={18} />
              <strong>Der Preis steht vor Beginn.</strong> Die Werte auf dieser Seite sind Richtwerte. Verbindlich wird
              der Preis mit dem schriftlichen Angebot nach der Besichtigung.
            </li>
          </ul>
        </div>
      </section>

      {/* Hinweise */}
      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container container--narrow">
          <div className="section-head">
            <span className="kicker">Gut zu wissen</span>
            <h2>Das Kleingedruckte in ganz normal</h2>
          </div>
          <ul className="list">
            {importantNotes.map((note) => (
              <li key={note}>
                <Icon name="info" size={18} />
                {note}
              </li>
            ))}
          </ul>

          <hr className="rule" />

          <h2 style={{ fontSize: '1.6rem' }}>Fragen zum Preis</h2>
          <div className="mt-6">
            <FaqList items={faqs.slice(0, 3)} openFirst />
          </div>

          <div className="btn-row mt-8">
            <Link href="/kontakt" className="btn btn--accent">
              Verbindliches Angebot anfragen
              <Icon name="arrow-right" size={17} />
            </Link>
            <Link href="/ablauf" className="btn btn--ghost">
              Ablauf ansehen
            </Link>
          </div>
        </div>
      </section>

      <CtaSection
        title="Verbindlicher Preis nach der Besichtigung"
        text="Die Werte auf dieser Seite sind Richtwerte für die Arbeitsleistung. Was Ihr Auftrag genau kostet, steht im schriftlichen Angebot nach der Besichtigung vor Ort."
      />

      <JsonLd data={breadcrumbSchema([{ name: 'Preise', path: '/preise' }])} />
    </>
  );
}
