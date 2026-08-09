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
    'So läuft ein Auftrag ab: Anfrage, Besichtigung, schriftliches Angebot, fester Termin, Ausführung und gemeinsame Übergabe. Keine Rechnung ohne vorher vereinbarten Preis.',
  alternates: { canonical: '/ablauf' },
};

const preparation = [
  {
    title: 'Raum und Zuwege frei',
    text: 'Zum Termin sollten der Raum und der Weg dorthin leer und begehbar sein – Flur, Treppenhaus, Eingang. Dann kann ich sofort anfangen, statt erst zu räumen.',
    icon: 'sparkle' as const,
  },
  {
    title: 'Material bereitstellen',
    text: 'Boden, Leisten und Dämmung sollten am Tag vorher geliefert sein. Laminat und Vinyl brauchen mindestens 48 Stunden Akklimatisierung im Raum.',
    icon: 'plank' as const,
  },
  {
    title: 'Strom und Zugang',
    text: 'Eine Steckdose in Reichweite und ein Zugang zum Objekt genügen. Bei Mietwohnungen bitte vorher die Erlaubnis zum Belagswechsel klären.',
    icon: 'shield' as const,
  },
  {
    title: 'Untergrund trocken',
    text: 'Frischer Estrich muss vollständig durchgetrocknet sein. Wenn Sie sich unsicher sind, schauen wir uns den Untergrund bei der Besichtigung gemeinsam an.',
    icon: 'ruler' as const,
  },
];

export default function AblaufPage() {
  return (
    <>
      <PageHero
        kicker="Ablauf"
        title="Sie wissen vorher, was passiert"
        lead="Kein Angebot ohne Besichtigung, keine Rechnung ohne vorher vereinbarten Preis. Fünf Schritte, die für jeden Auftrag gleich sind."
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
                  <strong>Besichtigungstermin:</strong> wird direkt bei der Rückmeldung abgestimmt.
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
                  <strong>Ausführungsdauer:</strong> hängt von Fläche und Zuschnitt ab und steht im Angebot.
                </li>
              </ul>

              <hr className="rule" style={{ marginBlock: '0.5rem' }} />

              <p className="small muted">
                Verzögert sich etwas – Krankheit, Materiallieferung, ein Auftrag davor – erfahren Sie das sofort und
                nicht erst am vereinbarten Tag.
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
              Vier Dinge von Ihrer Seite, damit der Termin sitzt. Werkzeug, Maschinen und Verbrauchsmaterial für die
              Ausführung bringe ich mit.
            </p>
          </div>

          <div className="grid grid--4">
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
              Zum Abschluss gehen wir den Raum gemeinsam durch. Wir schauen uns Kanten, Übergänge, Leistenanschlüsse und
              Fugen an. Was nicht passt, wird nachgearbeitet – nicht beim nächsten Termin, sondern direkt.
            </p>
            <p>
              Danach erhalten Sie die Rechnung über den Betrag, der im Angebot stand. Es gelten die gesetzlichen
              Gewährleistungsfristen. Sollte später etwas auffallen, melden Sie sich – der Weg innerhalb des
              Einsatzgebiets ist kurz.
            </p>
          </div>

          <div className="btn-row mt-8">
            <Link href="/preise" className="btn btn--ghost">
              Preise ansehen
              <Icon name="arrow-right" size={17} />
            </Link>
            <Link href="/ratgeber" className="btn btn--ghost">
              Raum vorbereiten
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
