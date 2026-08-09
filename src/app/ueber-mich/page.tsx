import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CtaSection from '@/components/CtaSection';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { business, telLink, whatsappLink } from '@/lib/business';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Über mich – Kevin Garrison, Bodenleger',
  description:
    'Kevin Garrison, Bodenleger und Fugenarbeiten aus Hüttlingen. Maurergeselle und Vorarbeiter im Hochbau mit über 10 Jahren Erfahrung, heute spezialisiert auf Bodenbeläge und Fugen.',
  alternates: { canonical: '/ueber-mich' },
};

const principles = [
  {
    title: 'Ein Ansprechpartner',
    text: 'Wer die Besichtigung macht, macht auch die Arbeit. Es gibt keine Übergabe an eine Kolonne und keine Information, die dabei verloren geht.',
    icon: 'user' as const,
  },
  {
    title: 'Preis vor Beginn',
    text: 'Das Angebot steht schriftlich fest, bevor der erste Handgriff passiert. Nachträgliche Positionen gibt es nur, wenn Sie sie ausdrücklich beauftragen.',
    icon: 'document' as const,
  },
  {
    title: 'Kein Materialaufschlag',
    text: 'Sie kaufen Boden, Leisten und Dämmung selbst. Ich verdiene an meiner Arbeit, nicht an Ihrem Baumarkteinkauf.',
    icon: 'euro' as const,
  },
  {
    title: 'Sauber hinterlassen',
    text: 'Abdecken, absaugen, Reste mitnehmen. Ein fertiger Raum ist erst fertig, wenn man ihn ohne Aufräumen benutzen kann.',
    icon: 'sparkle' as const,
  },
];

const materialTips = [
  {
    title: 'Nutzungsklasse beachten',
    text: 'Für Wohnräume genügt in der Regel NK 23/31, für Flure und stark genutzte Bereiche besser NK 23/32 oder höher. Ein zu dünner Boden spart beim Kauf und ärgert nach zwei Jahren.',
    icon: 'shield' as const,
  },
  {
    title: 'Verschnitt einplanen',
    text: 'Rechnen Sie rund 10 Prozent auf die reine Fläche auf, bei diagonaler Verlegung oder verwinkelten Räumen eher 15 Prozent. Nachkaufen bedeutet oft eine andere Charge und einen sichtbaren Farbunterschied.',
    icon: 'ruler' as const,
  },
  {
    title: 'Unterlage nicht vergessen',
    text: 'Trittschalldämmung und Dampfsperre bringe ich mit und verlege sie im Quadratmeterpreis. Beim Belag selbst zählt vor allem, dass Dekor und Charge zusammenpassen – Restposten aus zwei Lieferungen sieht man später.',
    icon: 'plank' as const,
  },
];

export default function UeberMichPage() {
  return (
    <>
      <PageHero
        kicker="Über mich"
        title="Kevin Garrison"
        lead="Maurergeselle und Vorarbeiter im Hochbau, über zehn Jahre Altbau und Neubau – heute spezialisiert auf Bodenbeläge und Fugen. Ein Betrieb, eine Person, ein Wort."
        crumbs={[{ name: 'Über mich', path: '/ueber-mich' }]}
        image="/media/wood-detail.jpg"
      >
        <span className="badge badge--dark">
          <Icon name="map-pin" size={15} />
          {business.postalCode} {business.city}
        </span>
        <span className="badge badge--dark">
          <Icon name="handshake" size={15} />
          Einzelbetrieb
        </span>
        <span className="badge badge--dark">
          <Icon name="shield" size={15} />
          {business.experienceYears} Erfahrung am Bau
        </span>
      </PageHero>

      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="split split--wide-left">
            <div className="prose">
              <span className="kicker">Mein Weg</span>
              <h2>Vom Hochbau zum Boden</h2>
              <p className="lead">
                Gelernt habe ich Maurer. Über zehn Jahre war ich im Hochbau unterwegs, zuletzt als Vorarbeiter, in
                Altbau und Neubau gleichermaßen. Zum Bodenlegen kam ich über die Ausbildung und über eine Firma für
                Altbausanierung – dort gehören Böden und Fugen zum Alltag, und dort habe ich gemerkt, dass mir genau
                diese Arbeit am meisten liegt.
              </p>
              <p>
                Böden verlege ich seit 2009 immer wieder, seit 2026 hauptberuflich im eigenen Betrieb. Was aus der Zeit
                am Bau geblieben ist: ein Blick für den Untergrund. Ein Boden ist nur so gut wie das, worauf er liegt –
                und schiefe Wände im Altbau sind für mich nichts Ungewöhnliches, sondern der Normalfall.
              </p>

              <h3>Wie ich arbeite</h3>
              <p>
                Sauber arbeiten, Termine halten, ehrlich kalkulieren. Mehr Grundsätze braucht es aus meiner Sicht nicht.
                Sie sprechen mit der Person, die anschließend auf den Knien liegt und die Diele zuschneidet – ich schaue
                mir jeden Auftrag selbst an und verlege auch selbst.
              </p>
              <p>
                Der Ablauf ist deshalb einfach gehalten. Sie beschreiben, was ansteht. Ich schaue es mir an. Sie
                bekommen ein schriftliches Angebot mit einem Preis, der hält. Und dann wird gearbeitet – an dem Tag, der
                vereinbart wurde.
              </p>

              <h3>Warum nur Laminat, Vinyl und Klickböden</h3>
              <p>
                Weil man das, was man täglich macht, besser macht als das, was man zweimal im Jahr macht. Fliesen,
                Parkett, Estrich, PVC, Linoleum und Teppich biete ich bewusst nicht an. Diese Klarheit spart Ihnen und
                mir Zeit – und Sie bekommen für Ihren Boden die Routine, die er braucht.
              </p>

              <h3>Warum das Material von Ihnen kommt</h3>
              <p>
                Materialbeschaffung ist Handel, nicht Handwerk. Wenn Sie den Boden selbst kaufen, sehen Sie den echten
                Preis, wählen Dekor und Qualität frei und zahlen keinen Aufschlag über mich. Auf der Rechnung steht dann
                genau das, was ich auch geleistet habe: die Arbeitszeit.
              </p>
              <p>
                Alleine lassen muss ich Sie damit trotzdem nicht: Auf Wunsch suchen wir das Material gemeinsam aus, damit
                Nutzungsklasse und Menge zum Raum passen. Und wenn Sie keinen Transporter haben, liefere ich es gegen
                Transportkosten an.
              </p>
            </div>

            <Reveal className="panel">
              <span className="kicker">Direkter Draht</span>
              <h3>So erreichen Sie mich</h3>
              <ul className="datalist">
                <li>
                  <Icon name="phone" size={19} />
                  <span>
                    <span className="datalist__label">Telefon</span>
                    <a href={telLink}>{business.phone}</a>
                  </span>
                </li>
                <li>
                  <Icon name="whatsapp" size={19} />
                  <span>
                    <span className="datalist__label">WhatsApp</span>
                    <a href={whatsappLink()} target="_blank" rel="noreferrer">
                      Nachricht schreiben
                    </a>
                  </span>
                </li>
                <li>
                  <Icon name="mail" size={19} />
                  <span>
                    <span className="datalist__label">E-Mail</span>
                    <a href={`mailto:${business.email}`}>{business.email}</a>
                  </span>
                </li>
                <li>
                  <Icon name="map-pin" size={19} />
                  <span>
                    <span className="datalist__label">Anschrift</span>
                    {business.street}
                    <br />
                    {business.postalCode} {business.city}
                  </span>
                </li>
              </ul>

              <hr className="rule" style={{ marginBlock: '0.4rem' }} />

              <p className="small muted">
                Am schnellsten geht es per WhatsApp mit einem Foto des Raums. Damit kann ich meist schon einschätzen, ob
                und wann es passt.
              </p>

              <Link href="/kontakt" className="btn btn--accent btn--block">
                Anfrage stellen
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
            <span className="kicker">Grundsätze</span>
            <h2>Vier Dinge, auf die Sie sich verlassen können</h2>
          </div>

          <div className="grid grid--4">
            {principles.map((item, i) => (
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

          <hr className="rule" />

          <div className="section-head">
            <span className="kicker">Materialeinkauf</span>
            <h2>Worauf Sie beim Kauf achten sollten</h2>
            <p className="lead">
              Weil Sie das Material selbst besorgen, hier die drei Punkte, bei denen im Baumarkt am häufigsten etwas
              schiefgeht. Wenn Sie unsicher sind: schicken Sie mir vor dem Kauf ein Foto des Produktdatenblatts.
            </p>
          </div>

          <div className="grid grid--3">
            {materialTips.map((tip, i) => (
              <Reveal key={tip.title} delay={i * 80}>
                <article className="panel" style={{ height: '100%' }}>
                  <span className="card__icon">
                    <Icon name={tip.icon} size={21} />
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-sans)' }}>{tip.title}</h3>
                  <p className="small">{tip.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title="Lernen wir uns bei der Besichtigung kennen"
        text="Der einfachste Weg, einen Handwerker einzuschätzen, ist ein Termin vor Ort. Der kostet Sie nichts und verpflichtet Sie zu nichts."
      />

      <JsonLd data={breadcrumbSchema([{ name: 'Über mich', path: '/ueber-mich' }])} />
    </>
  );
}
