import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CtaSection from '@/components/CtaSection';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { business } from '@/lib/business';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Ratgeber – Raum vorbereiten für den Verlegetermin',
  description:
    'Was vor dem Verlegetermin geklärt sein sollte: Raum und Zuwege leer und begehbar, Material vorhanden, Altbelag abgestimmt. Dazu allgemeine Hinweise zum Materialkauf.',
  alternates: { canonical: '/ratgeber' },
};

/* Vom Betrieb genannte Voraussetzungen für den Termin. */
const checklist = [
  {
    title: 'Raum leer räumen',
    text: 'Möbel, Teppiche und lose Gegenstände sollten zum Termin aus dem Raum sein.',
    icon: 'sparkle' as const,
  },
  {
    title: 'Zuwege frei halten',
    text: 'Auch der Weg zum Raum sollte begehbar sein – Eingang, Flur und Treppenhaus.',
    icon: 'ruler' as const,
  },
  {
    title: 'Material vorhanden',
    text: 'Boden und Leisten stellt der Kunde und sollten zum Termin vor Ort sein. Trittschalldämmung und Dampfsperre sind im Quadratmeterpreis enthalten.',
    icon: 'plank' as const,
  },
  {
    title: 'Altbelag abgestimmt',
    text: 'Ob der alte Boden herausgenommen und abtransportiert werden soll, wird bei der Besichtigung geklärt. Beides ist eine eigene Position im Angebot.',
    icon: 'info' as const,
  },
];

/* Allgemeine Hinweise zum Bodenkauf, unabhängig vom Betrieb. */
const materialTips = [
  {
    title: 'Nutzungsklasse passend wählen',
    text: 'Bodenbeläge tragen eine Nutzungsklasse nach DIN EN ISO 10874. Für normale Wohnräume ist NK 23/31 üblich, für Flure, Küchen und stark genutzte Bereiche NK 23/32 oder höher. Die Angabe steht auf der Verpackung.',
  },
  {
    title: 'Verschnitt einplanen',
    text: 'Auf die reine Raumfläche werden üblicherweise rund 10 Prozent Verschnitt aufgeschlagen, bei verwinkelten Räumen entsprechend mehr.',
  },
  {
    title: 'Alles aus einer Charge',
    text: 'Beläge derselben Dekorbezeichnung können sich je nach Produktionscharge im Farbton unterscheiden. Für zusammenhängende Flächen deshalb alles auf einmal kaufen.',
  },
];

export default function RatgeberPage() {
  return (
    <>
      <PageHero
        kicker="Ratgeber"
        title="So bereiten Sie den Raum vor"
        lead="Damit am Termin sofort begonnen werden kann, sollten Raum und Zuwege leer und begehbar sein. Diese vier Punkte gehören vorher geklärt."
        crumbs={[{ name: 'Ratgeber', path: '/ratgeber' }]}
        image="/media/wood-detail.jpg"
      />

      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="section-head">
            <span className="kicker">Checkliste</span>
            <h2>Vor dem Termin</h2>
            <p className="lead">
              Die ersten beiden Punkte sind die wichtigsten: Raum und Zuwege sollten zum Start leer und begehbar sein.
            </p>
          </div>

          <div className="grid grid--4">
            {checklist.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <article className="card" style={{ height: '100%' }}>
                  <span className="card__icon">
                    <Icon name={item.icon} size={21} />
                  </span>
                  <h3 style={{ fontSize: '1.08rem', fontFamily: 'var(--font-sans)' }}>{item.title}</h3>
                  <p className="small muted">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="split split--wide-left">
            <div className="prose">
              <span className="kicker">Materialkauf</span>
              <h2>Allgemeine Hinweise zum Bodenkauf</h2>
              <p className="lead">
                Da das Material vom Kunden gestellt wird, hier drei allgemeine Punkte, die beim Kauf eines Bodenbelags
                eine Rolle spielen. Sie gelten unabhängig davon, wo Sie kaufen.
              </p>

              <ul className="list mt-4">
                {materialTips.map((tip) => (
                  <li key={tip.title}>
                    <Icon name="check" size={18} />
                    <strong>{tip.title}:</strong> {tip.text}
                  </li>
                ))}
              </ul>
            </div>

            <Reveal className="panel">
              <span className="card__icon">
                <Icon name="handshake" size={22} />
              </span>
              <h3>Material gemeinsam aussuchen</h3>
              <p className="small">
                Auf Wunsch suchen wir das Material zusammen aus. Gegen Transportkosten liefere ich es auch an. Bezahlt
                wird es weiterhin vom Kunden – berechnet wird ausschließlich die Arbeitsleistung.
              </p>
              <Link href="/kontakt" className="btn btn--accent btn--block">
                Materialberatung anfragen
                <Icon name="arrow-right" size={17} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="ambient" aria-hidden="true" />
        <div className="container container--narrow">
          <div className="section-head">
            <span className="kicker">Gut zu wissen</span>
            <h2>Was im Preis enthalten ist</h2>
          </div>

          <ul className="list">
            <li>
              <Icon name="check" size={18} />
              Trittschalldämmung und Dampfsperre sind im Quadratmeterpreis enthalten.
            </li>
            <li>
              <Icon name="check" size={18} />
              Untergrund reinigen, grundieren und kleine Unebenheiten ausgleichen gehört zur Verlegung.
            </li>
            <li>
              <Icon name="check" size={18} />
              Die Anfahrt innerhalb des Einsatzgebiets ist im Preis enthalten.
            </li>
            <li>
              <Icon name="ban" size={18} />
              Alten Belag entfernen, Übergangsprofile und das Kürzen von Türblättern werden separat berechnet.
            </li>
          </ul>

          <div className="btn-row mt-8">
            <Link href="/preise" className="btn btn--ghost">
              Alle Preise
              <Icon name="arrow-right" size={17} />
            </Link>
            <Link href="/ablauf" className="btn btn--ghost">
              Ablauf
            </Link>
            <Link href="/faq" className="btn btn--ghost">
              Häufige Fragen
            </Link>
          </div>
        </div>
      </section>

      <CtaSection
        title={`Termin anfragen – aktuell ${business.leadTimeShort}`}
        text="Die Preise auf dieser Seite sind Richtwerte. Verbindlich wird der Preis mit dem schriftlichen Angebot nach der Besichtigung vor Ort."
      />

      <JsonLd data={breadcrumbSchema([{ name: 'Ratgeber', path: '/ratgeber' }])} />
    </>
  );
}
