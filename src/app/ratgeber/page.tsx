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
  title: 'Ratgeber – Raum vorbereiten für den Bodenleger',
  description:
    'Was Sie vor dem Verlegetermin vorbereiten sollten: Raum und Zuwege frei räumen, Material rechtzeitig liefern lassen, Untergrund trocknen lassen. Praxistipps vom Bodenleger aus Aalen.',
  alternates: { canonical: '/ratgeber' },
};

const checklist = [
  {
    title: 'Raum leer räumen',
    text: 'Möbel, Teppiche, Vorhänge und lose Gegenstände raus. Was stehen bleibt, muss ich beim Verlegen umstellen – das kostet Zeit, die auf der Rechnung landet.',
    icon: 'sparkle' as const,
  },
  {
    title: 'Zuwege frei halten',
    text: 'Eingang, Flur und Treppenhaus sollten begehbar sein. Dielen sind lang und sperrig; wenn der Weg zugestellt ist, geht der halbe Vormittag fürs Tragen drauf.',
    icon: 'ruler' as const,
  },
  {
    title: 'Material rechtzeitig da',
    text: 'Boden und Leisten sollten spätestens am Vortag geliefert sein. Laminat und Vinyl brauchen mindestens 48 Stunden im Raum, bevor sie verlegt werden – sonst arbeitet der Belag später nach.',
    icon: 'plank' as const,
  },
  {
    title: 'Untergrund trocken',
    text: 'Frischer Estrich muss vollständig durchgetrocknet sein. Wenn Sie unsicher sind, schauen wir uns das bei der Besichtigung gemeinsam an.',
    icon: 'shield' as const,
  },
  {
    title: 'Strom und Zugang',
    text: 'Eine erreichbare Steckdose genügt, dazu jemand, der aufschließt. Bei Mietwohnungen vorher die Erlaubnis für den Belagswechsel einholen.',
    icon: 'handshake' as const,
  },
  {
    title: 'Altbelag klären',
    text: 'Soll der alte Boden raus? Sagen Sie das vor dem Termin, nicht am Tag selbst – Entfernung und Abtransport brauchen Zeit und werden als eigene Position kalkuliert.',
    icon: 'info' as const,
  },
];

const materialTips = [
  {
    title: 'Nutzungsklasse passend wählen',
    text: 'Für normale Wohnräume genügt in der Regel NK 23/31. Für Flure, Küchen und stark genutzte Bereiche sollte es NK 23/32 oder höher sein. An der falschen Stelle gespart, ärgert man sich nach zwei Jahren über abgelaufene Kanten.',
  },
  {
    title: 'Verschnitt einplanen',
    text: 'Rechnen Sie rund 10 Prozent auf die reine Fläche auf, bei verwinkelten Räumen eher 15 Prozent. Nachkaufen bedeutet fast immer eine andere Charge – und die sieht man im Licht.',
  },
  {
    title: 'Alles aus einer Lieferung',
    text: 'Kaufen Sie den Belag für zusammenhängende Flächen in einem Rutsch. Zwei Restposten mit gleichem Dekornamen können sich im Farbton deutlich unterscheiden.',
  },
];

export default function RatgeberPage() {
  return (
    <>
      <PageHero
        kicker="Ratgeber"
        title="So bereiten Sie den Raum vor"
        lead="Ein Verlegetermin läuft dann rund, wenn ich sofort anfangen kann. Diese sechs Punkte entscheiden darüber, ob das klappt – und sie kosten Sie nichts außer etwas Vorbereitung."
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
              Am wichtigsten sind die ersten beiden Punkte: Raum und Zuwege sollten zum Start leer und begehbar sein.
              Alles andere ergibt sich daraus.
            </p>
          </div>

          <div className="grid grid--3">
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
              <h2>Worauf Sie beim Einkauf achten sollten</h2>
              <p className="lead">
                Weil Sie das Material selbst besorgen, hier die drei Punkte, bei denen im Baumarkt am häufigsten etwas
                schiefgeht. Wenn Sie unsicher sind: Foto vom Produktdatenblatt schicken, dann schaue ich drüber.
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
              <h3>Lieber gemeinsam aussuchen?</h3>
              <p className="small">
                Auf Wunsch gehen wir das Material zusammen durch – dann passen Nutzungsklasse und Menge zum Raum. Wenn
                Sie keinen Transporter haben, liefere ich es gegen Transportkosten an.
              </p>
              <p className="small">
                Bezahlt wird es weiterhin von Ihnen zum Ladenpreis. Ich schlage nichts darauf – ich verdiene an meiner
                Arbeit, nicht an Ihrem Einkauf.
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
            <span className="kicker">Am Tag selbst</span>
            <h2>Was Sie nicht vorbereiten müssen</h2>
          </div>

          <div className="prose">
            <p>
              Werkzeug, Maschinen, Verbrauchsmaterial und Abdeckmaterial bringe ich mit. Sie müssen weder Strom noch
              Wasser bereitstellen, außer der Steckdose. Anwesend sein müssen Sie nur zu Beginn und zur Übergabe –
              dazwischen können Sie ruhig arbeiten gehen.
            </p>
            <p>
              Nach der Arbeit wird abgesaugt und aufgeräumt, Verschnitt und Verpackung nehme ich mit. Der Raum wird
              besenrein übergeben, sodass Sie die Möbel direkt zurückstellen können.
            </p>
          </div>

          <div className="btn-row mt-8">
            <Link href="/ablauf" className="btn btn--ghost">
              Kompletter Ablauf
              <Icon name="arrow-right" size={17} />
            </Link>
            <Link href="/faq" className="btn btn--ghost">
              Häufige Fragen
            </Link>
          </div>
        </div>
      </section>

      <CtaSection
        title={`Termin sichern – aktuell ${business.leadTimeShort}`}
        text="Besichtigung und schriftliches Angebot sind kostenlos und unverbindlich. Je früher der Termin steht, desto besser lässt er sich in Ihre Planung einpassen."
      />

      <JsonLd data={breadcrumbSchema([{ name: 'Ratgeber', path: '/ratgeber' }])} />
    </>
  );
}
