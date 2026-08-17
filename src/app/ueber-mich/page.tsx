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
    title: 'Sauber arbeiten',
    text: 'Einer der drei Grundsätze, nach denen ich arbeite.',
    icon: 'sparkle' as const,
  },
  {
    title: 'Termine halten',
    text: 'Ein zugesagter Termin wird gehalten. Der Vorlauf beträgt derzeit zwei bis drei Wochen.',
    icon: 'calendar' as const,
  },
  {
    title: 'Ehrlich kalkulieren',
    text: 'Berechnet wird die Arbeitsleistung, ohne versteckte Positionen. Das Material stellt der Kunde.',
    icon: 'euro' as const,
  },
];

export default function UeberMichPage() {
  return (
    <>
      <PageHero
        kicker="Über mich"
        title="Kevin Garrison"
        lead="Maurergeselle und Vorarbeiter im Hochbau, über zehn Jahre Altbau und Neubau."
        crumbs={[{ name: 'Über mich', path: '/ueber-mich' }]}
        variant={3}
      >
        <span className="badge badge--dark">
          <Icon name="map-pin" size={15} />
          {business.postalCode} {business.city}
        </span>
        <span className="badge badge--dark">
          <Icon name="handshake" size={15} />
          Böden &amp; Fugen seit 2009
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
                Als gelernter Maurer und ehemaliger Vorarbeiter bringe ich über zehn Jahre wertvolle Erfahrung aus
                dem Hochbau mit. Mein Fokus liegt heute ganz auf der Altbausanierung sowie dem präzisen Verlegen von
                Böden und Fugen. Nach langjähriger Praxis führe ich seit 2026 meinen eigenen Fachbetrieb.
              </p>

              <h3>Wie ich arbeite</h3>
              <p>
                Sauber arbeiten, Termine halten, ehrlich kalkulieren – das sind meine drei Grundsätze. Ich arbeite
                allein: Ich sehe mir jeden Auftrag selbst vor Ort an und verlege auch selbst.
              </p>
              <p>
                Der Ablauf ist einfach gehalten. Sie beschreiben, was ansteht. Ich sehe es mir an. Sie bekommen ein
                schriftliches Angebot für die Arbeitsleistung. Erst danach entscheiden Sie.
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
                Am schnellsten geht es per WhatsApp. Ein Foto des Raums hilft bei der ersten Einschätzung.
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
            <h2>Sauber arbeiten, Termine halten, ehrlich kalkulieren</h2>
          </div>

          <div className="grid grid--3">
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

          {/* Kennzahlen stehen jetzt allein, der Block daneben ist entfallen –
              deshalb über die volle Breite statt in einer halben Spalte. */}
          <div className="stats">
              <div className="stat">
                <span className="stat__value">{business.experienceYears}</span>
                <span className="stat__label">Erfahrung am Bau</span>
              </div>
              <div className="stat">
                <span className="stat__value">seit 2009</span>
                <span className="stat__label">Böden verlegt</span>
              </div>
              <div className="stat">
                <span className="stat__value">{business.serviceRadiusKm} km</span>
                <span className="stat__label">rund um Aalen</span>
              </div>
          </div>
        </div>
      </section>

      <CtaSection />

      <JsonLd data={breadcrumbSchema([{ name: 'Über mich', path: '/ueber-mich' }])} />
    </>
  );
}
