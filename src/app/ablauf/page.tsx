import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CtaSection from '@/components/CtaSection';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { business, processSteps } from '@/lib/business';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Ablauf – von der Anfrage bis zur Übergabe',
  description:
    'So läuft ein Auftrag ab: Anfrage, Besichtigung vor Ort, schriftliches Angebot, Termin und Ausführung. Der Vorlauf beträgt derzeit zwei bis drei Wochen.',
  alternates: { canonical: '/ablauf' },
};

const preparation = [
  {
    title: 'Raum und Zuwege frei',
    text: 'Zum Termin sollten der Raum und der Weg dorthin leer und begehbar sein – Flur, Treppenhaus, Eingang.',
    icon: 'sparkle' as const,
  },
  {
    title: 'Material vorhanden',
    text: 'Boden und Leisten stellt der Kunde und sollten zum Termin vor Ort sein. Trittschalldämmung und Dampfsperre sind im Preis enthalten.',
    icon: 'plank' as const,
  },
  {
    title: 'Altbelag geklärt',
    text: 'Ob der alte Boden noch liegt und wer ihn entfernt, wird bei der Besichtigung besprochen. Entfernung und Abtransport sind eine eigene Position.',
    icon: 'ruler' as const,
  },
];

export default function AblaufPage() {
  return (
    <>
      <PageHero
        kicker="Ablauf"
        title="Sie wissen vorher, was passiert"
        lead="Fünf Schritte von der Anfrage bis zur Übergabe. Die Preise auf dieser Seite sind Richtwerte – verbindlich wird der Preis erst nach der Besichtigung vor Ort."
        crumbs={[{ name: 'Ablauf', path: '/ablauf' }]}
      />

      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="split split--wide-left">
            <ol className="timeline">
              {processSteps.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>

            <Reveal className="panel">
              <span className="kicker">Zeitrahmen</span>
              <h2 style={{ fontSize: '1.5rem' }}>Wie lange dauert das?</h2>
              <ul className="list list--dense small">
                <li>
                  <Icon name="clock" size={17} />
                  <strong>Rückmeldung auf Ihre Anfrage:</strong> in der Regel innerhalb von 24 Stunden.
                </li>
                <li>
                  <Icon name="clock" size={17} />
                  <strong>Erreichbarkeit:</strong> Montag bis Samstag, 8 bis 18 Uhr.
                </li>
                <li>
                  <Icon name="clock" size={17} />
                  <strong>Angebot:</strong> schriftlich nach der Besichtigung, mit Festpreis für die Arbeitsleistung.
                </li>
                <li>
                  <Icon name="clock" size={17} />
                  <strong>Vorlauf bis zum Termin:</strong> aktuell {business.leadTime}.
                </li>
                <li>
                  <Icon name="clock" size={17} />
                  <strong>Zahlung:</strong> per Barzahlung oder Überweisung.
                </li>
              </ul>

              <hr className="rule" style={{ marginBlock: '0.5rem' }} />

              <p className="small muted">
                Alle Preise sind Richtwerte für die Arbeitsleistung. {business.vatNote}
              </p>

              <Link href="/kontakt" className="btn btn--accent btn--block">
                Termin anfragen
                <Icon name="arrow-right" size={17} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="section-head">
            <span className="kicker">Vorbereitung</span>
            <h2>Was Sie vorbereiten – und was ich mitbringe</h2>
            <p className="lead">
              Drei Punkte, die vor dem Termin geklärt sein sollten. Trittschalldämmung und Dampfsperre sind im
              Quadratmeterpreis enthalten und werden mitgebracht.
            </p>
          </div>

          <div className="grid grid--3">
            {preparation.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <article className="card" style={{ height: '100%' }}>
                  <span className="card__icon">
                    <Icon name={item.icon} size={21} />
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-sans)' }}>{item.title}</h3>
                  <p className="small">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="btn-row mt-8">
            <Link href="/ratgeber" className="btn btn--glass">
              Vollständige Checkliste im Ratgeber
              <Icon name="arrow-right" size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="ambient" aria-hidden="true" />
        <div className="container container--narrow">
          <div className="section-head">
            <span className="kicker">Nach der Arbeit</span>
            <h2>Übergabe und Gewährleistung</h2>
          </div>

          <div className="prose">
            <p>
              Zum Abschluss übergebe ich Ihnen den fertigen Raum. Abgerechnet wird die Arbeitsleistung wie im Angebot
              ausgewiesen, zahlbar per Barzahlung oder Überweisung.
            </p>
            <p>
              Es gelten die gesetzlichen Gewährleistungsfristen. Die Preise verstehen sich ohne Umsatzsteuer, da die
              Kleinunternehmerregelung nach § 19 UStG gilt.
            </p>
          </div>

          <div className="btn-row mt-8">
            <Link href="/preise" className="btn btn--ghost">
              Preise ansehen
              <Icon name="arrow-right" size={17} />
            </Link>
            <Link href="/faq" className="btn btn--ghost">
              Häufige Fragen
            </Link>
          </div>
        </div>
      </section>

      <CtaSection />

      <JsonLd data={breadcrumbSchema([{ name: 'Ablauf', path: '/ablauf' }])} />
    </>
  );
}
