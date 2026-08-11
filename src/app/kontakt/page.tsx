import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CtaSection from '@/components/CtaSection';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { availability, business, mailtoLink, telLink, whatsappLink } from '@/lib/business';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Kontakt & Anfrage',
  description:
    'Kontakt für Bodenverlegung, Sockelleisten oder Fugenarbeiten in Aalen und Umgebung. Per WhatsApp, E-Mail oder Telefon, Montag bis Samstag von 8 bis 18 Uhr.',
  alternates: { canonical: '/kontakt' },
};

const waText =
  'Hallo Herr Garrison, ich möchte ein Angebot anfragen. Es geht um folgende Arbeiten:';

/* Was eine Anfrage schnell einschätzbar macht. */
const hilfreich = [
  {
    title: 'Worum es geht',
    text: 'Boden verlegen, Sockelleisten, Fugen erneuern – oder eine Ausbesserung.',
    icon: 'ruler' as const,
  },
  {
    title: 'Ungefähre Größe',
    text: 'Quadratmeter beim Boden, laufende Meter bei Leisten und Fugen. Geschätzt genügt.',
    icon: 'calculator' as const,
  },
  {
    title: 'Ort der Baustelle',
    text: 'Ort oder Postleitzahl – damit klar ist, ob es im Einsatzgebiet liegt.',
    icon: 'map-pin' as const,
  },
  {
    title: 'Ein Foto des Raums',
    text: 'Am schnellsten per WhatsApp. Ein Bild sagt mehr als eine lange Beschreibung.',
    icon: 'image' as const,
  },
];

export default function KontaktPage() {
  return (
    <>
      <PageHero
        kicker="Kontakt"
        title="Anfrage stellen"
        lead="Beschreiben Sie kurz, was ansteht. Eine Rückmeldung kommt in der Regel innerhalb von 24 Stunden."
        crumbs={[{ name: 'Kontakt', path: '/kontakt' }]}
      >
        <span className="badge badge--dark">
          <Icon name="clock" size={15} />
          Antwort in der Regel binnen 24 Stunden
        </span>
        <span className="badge badge--dark">
          <Icon name="document" size={15} />
          Angebot nach Besichtigung
        </span>
      </PageHero>

      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="split split--wide-left">
            {/* Kontaktwege */}
            <div>
              <div className="section-head" style={{ marginBottom: '1.75rem' }}>
                <span className="kicker">Direkter Draht</span>
                <h2 style={{ fontSize: '1.85rem' }}>So erreichen Sie mich</h2>
                <p className="muted small">
                  Am schnellsten geht es per WhatsApp – gerne mit einem Foto des Raums. Während der Arbeit auf der
                  Baustelle ist ein Anruf nicht immer möglich; eine schriftliche Nachricht erreicht mich sicher.
                </p>
              </div>

              <div className="grid grid--3">
                <Reveal>
                  <a
                    href={whatsappLink(waText)}
                    className="card card--link"
                    target="_blank"
                    rel="noreferrer"
                    style={{ height: '100%' }}
                  >
                    <span className="card__icon">
                      <Icon name="whatsapp" size={22} />
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-sans)' }}>WhatsApp</h3>
                    <p className="small muted">{business.phone}</p>
                    <span className="card__more">
                      Nachricht schreiben
                      <Icon name="arrow-right" size={16} />
                    </span>
                  </a>
                </Reveal>

                <Reveal delay={80}>
                  <a href={telLink} className="card card--link" style={{ height: '100%' }}>
                    <span className="card__icon">
                      <Icon name="phone" size={22} />
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-sans)' }}>Telefon</h3>
                    <p className="small muted">{business.phone}</p>
                    <span className="card__more">
                      Jetzt anrufen
                      <Icon name="arrow-right" size={16} />
                    </span>
                  </a>
                </Reveal>

                <Reveal delay={160}>
                  <a
                    href={mailtoLink('Anfrage über die Website')}
                    className="card card--link"
                    style={{ height: '100%' }}
                  >
                    <span className="card__icon">
                      <Icon name="mail" size={22} />
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-sans)' }}>E-Mail</h3>
                    <p className="small muted">{business.email}</p>
                    <span className="card__more">
                      E-Mail schreiben
                      <Icon name="arrow-right" size={16} />
                    </span>
                  </a>
                </Reveal>
              </div>

              <hr className="rule" />

              <div className="section-head" style={{ marginBottom: '1.5rem' }}>
                <span className="kicker">Hilfreich</span>
                <h2 style={{ fontSize: '1.5rem' }}>Was in die Nachricht gehört</h2>
                <p className="muted small">
                  Je mehr davon in der ersten Nachricht steht, desto genauer fällt die erste Einschätzung aus. Fehlt
                  etwas, frage ich nach.
                </p>
              </div>

              <div className="grid grid--2">
                {hilfreich.map((item, i) => (
                  <Reveal key={item.title} delay={i * 70}>
                    <article className="card" style={{ height: '100%' }}>
                      <span className="card__icon">
                        <Icon name={item.icon} size={21} />
                      </span>
                      <h3 style={{ fontSize: '1.02rem', fontFamily: 'var(--font-sans)' }}>{item.title}</h3>
                      <p className="small muted">{item.text}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Eckdaten */}
            <div className="stack" style={{ gap: '1.25rem' }}>
              <Reveal className="panel">
                <span className="kicker">Erreichbarkeit</span>
                <h3 style={{ fontSize: '1.2rem' }}>Antwort in der Regel binnen 24 Stunden</h3>
                <ul className="datalist" style={{ marginBottom: '0.4rem' }}>
                  {availability.map((slot) => (
                    <li key={slot.days}>
                      <Icon name="clock" size={18} />
                      <span>
                        <span className="datalist__label">{slot.days}</span>
                        {slot.hours}
                      </span>
                    </li>
                  ))}
                </ul>
                <ul className="list list--dense small">
                  <li>
                    <Icon name="check" size={16} />
                    Verbindlicher Preis erst mit dem schriftlichen Angebot
                  </li>
                  <li>
                    <Icon name="check" size={16} />
                    Termine aktuell mit {business.leadTimeShort}
                  </li>
                </ul>
              </Reveal>

              <Reveal className="panel panel--muted" delay={90}>
                <span className="kicker">Betrieb</span>
                <ul className="datalist">
                  <li>
                    <Icon name="user" size={18} />
                    <span>
                      <span className="datalist__label">Inhaber</span>
                      {business.name}
                      <br />
                      <span className="small muted">{business.tagline}</span>
                    </span>
                  </li>
                  <li>
                    <Icon name="map-pin" size={18} />
                    <span>
                      <span className="datalist__label">Anschrift</span>
                      {business.street}
                      <br />
                      {business.postalCode} {business.city}
                    </span>
                  </li>
                  <li>
                    <Icon name="map-pin" size={18} />
                    <span>
                      <span className="datalist__label">Einsatzgebiet</span>
                      {business.serviceAreaLabel}, ca. {business.serviceRadiusKm} km Radius
                    </span>
                  </li>
                  <li>
                    <Icon name="euro" size={18} />
                    <span>
                      <span className="datalist__label">Zahlung</span>
                      {business.paymentMethods}
                    </span>
                  </li>
                </ul>
                <p className="tiny">{business.vatNote}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CtaSection />

      <JsonLd data={breadcrumbSchema([{ name: 'Kontakt', path: '/kontakt' }])} />
    </>
  );
}
