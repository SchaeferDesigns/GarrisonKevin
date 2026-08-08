import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CtaSection from '@/components/CtaSection';
import PriceCalculator from '@/components/PriceCalculator';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import FaqList from '@/components/FaqList';
import { business, faqs, hourlyRate, importantNotes, notOffered, prices } from '@/lib/business';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Preise – Bodenverlegung, Sockelleisten & Fugen',
  description:
    'Transparente Richtwerte: Bodenverlegung ab 18 €/m², Sockelleisten ab 7 €/lfm, Fugen ab 6 €/lfm. Nur Arbeitsleistung, Material stellt der Kunde. Mit Preisrechner.',
  alternates: { canonical: '/preise' },
};

export default function PreisePage() {
  return (
    <>
      <PageHero
        kicker="Preise"
        title="Was es kostet – vorher, nicht hinterher"
        lead="Alle Preise gelten für die Arbeitsleistung. Sie kaufen das Material selbst und zahlen keinen Aufschlag darauf. Verbindlich wird der Preis im schriftlichen Angebot nach der Besichtigung."
        crumbs={[{ name: 'Preise', path: '/preise' }]}
      >
        <span className="badge badge--dark">
          <Icon name="euro" size={15} />
          Ohne versteckte Positionen
        </span>
        <span className="badge badge--dark">
          <Icon name="shield" size={15} />
          Kostenlose Besichtigung
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
                  Nicht jeder Auftrag lohnt eine Quadratmeterkalkulation. Unter {hourlyRate.thresholdOrderValue} €
                  Auftragswert rechne ich deshalb nach Stunden ab – ab {hourlyRate.amount} € pro Stunde bei mindestens{' '}
                  {hourlyRate.minHours.toLocaleString('de-DE')} Stunden. Damit sind auch einzelne Ausbesserungen oder
                  eine Fuge im Bad machbar.
                </p>
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem' }}>Einsatzgebiet</h2>
                <p className="small muted mt-2">
                  Gearbeitet wird in {business.serviceAreaLabel}, in einem Radius von rund{' '}
                  {business.serviceRadiusKm} km. Was das für Ihr Objekt bedeutet, klären wir bei der Anfrage – alle
                  Positionen stehen anschließend im schriftlichen Angebot.
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
              Tragen Sie Ihre Maße ein und Sie sehen sofort, in welchem Bereich sich die Arbeitsleistung bewegt. Der
              Rechner läuft vollständig in Ihrem Browser – es wird nichts übertragen und nichts gespeichert.
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
                  'Aufmaß und Zuschnitt',
                  'Verlegen des Belags nach Herstellervorgabe',
                  'Einbau von Dämmung und Dampfsperre',
                  'Montage der Sockelleisten inklusive Gehrung',
                  'Ziehen der Acryl- und Silikonfugen',
                  'Abdecken der Baustelle und besenreine Übergabe',
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
                  Material: Boden, Leisten, Dämmung, Profile und Silikon
                </li>
                <li>
                  <Icon name="ban" size={18} />
                  Entsorgung des Altbelags
                </li>
                <li>
                  <Icon name="ban" size={18} />
                  Estricharbeiten und großflächiges Ausgleichen des Untergrunds
                </li>
                <li>
                  <Icon name="ban" size={18} />
                  Beläge außerhalb des Angebots: {notOffered.join(', ')}
                </li>
              </ul>

              <div className="panel mt-8">
                <h3 style={{ fontSize: '1.1rem' }}>Warum das Material vom Kunden kommt</h3>
                <p className="small">
                  So zahlen Sie genau den Preis, den Ihr Baumarkt oder Händler aufruft – ohne Aufschlag über mich. Sie
                  entscheiden frei über Dekor, Qualität und Budget, und die Rechnung bleibt für beide Seiten
                  nachvollziehbar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hinweise */}
      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container container--narrow">
          <div className="section-head">
            <span className="kicker">Gut zu wissen</span>
            <h2>Die Kleingedruckten in ganz normal</h2>
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
        title="Ein Angebot kostet Sie nichts"
        text="Besichtigung, Aufmaß und schriftliches Angebot sind kostenlos und unverbindlich. Sie sehen den Festpreis, bevor Sie sich entscheiden."
      />

      <JsonLd data={breadcrumbSchema([{ name: 'Preise', path: '/preise' }])} />
    </>
  );
}
