import { Suspense } from 'react';
import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import AnfrageForm from '@/components/AnfrageForm';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { availability, business, mailtoLink, telLink, whatsappLink } from '@/lib/business';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Kontakt & Anfrage',
  description:
    'Anfrage für Bodenverlegung, Sockelleisten oder Fugenarbeiten in Aalen und Umgebung. Per WhatsApp, E-Mail oder Telefon, Montag bis Samstag von 8 bis 18 Uhr.',
  alternates: { canonical: '/kontakt' },
};

const waText =
  'Hallo Herr Garrison, ich möchte ein Angebot anfragen. Es geht um folgende Arbeiten:';

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
            {/* Formular */}
            <div>
              <div className="section-head" style={{ marginBottom: '1.75rem' }}>
                <span className="kicker">Anfrageformular</span>
                <h2 style={{ fontSize: '1.85rem' }}>In drei Schritten zur Anfrage</h2>
                <p className="muted small">
                  Das Formular erstellt aus Ihren Angaben eine fertige Nachricht. Absenden können Sie sie anschließend
                  selbst per E-Mail oder WhatsApp – so bleiben Ihre Daten bei Ihnen.
                </p>
              </div>

              <Suspense fallback={<p className="muted">Formular wird geladen …</p>}>
                <AnfrageForm />
              </Suspense>
            </div>

            {/* Direktkontakt */}
            <div className="stack" style={{ gap: '1.25rem' }}>
              <Reveal className="panel">
                <span className="kicker">Direkt</span>
                <h2 style={{ fontSize: '1.4rem' }}>Lieber sofort sprechen?</h2>
                <p className="small muted">
                  Erreichbar Montag bis Samstag von 8 bis 18 Uhr. Ein Foto des Raums hilft bei der ersten Einschätzung.
                </p>

                <a href={whatsappLink(waText)} className="btn btn--accent btn--block" target="_blank" rel="noreferrer">
                  <Icon name="whatsapp" size={18} />
                  WhatsApp schreiben
                </a>
                <a href={telLink} className="btn btn--ghost btn--block">
                  <Icon name="phone" size={18} />
                  {business.phone}
                </a>
                <a
                  href={mailtoLink('Anfrage über die Website')}
                  className="btn btn--ghost btn--block"
                >
                  <Icon name="mail" size={18} />
                  E-Mail schreiben
                </a>
              </Reveal>

              <Reveal className="panel" delay={90}>
                <span className="kicker">Rückmeldung</span>
                <h3 style={{ fontSize: '1.2rem' }}>Antwort in der Regel binnen 24 Stunden</h3>
                <p className="small muted">
                  Während der Arbeit auf der Baustelle ist ein Anruf nicht immer möglich. Eine schriftliche Nachricht
                  über WhatsApp oder E-Mail erreicht mich sicher und wird in der Regel innerhalb von 24 Stunden
                  beantwortet.
                </p>
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
                    Am schnellsten: WhatsApp mit einem Foto des Raums
                  </li>
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

              <Reveal className="panel panel--muted" delay={160}>
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
                </ul>
                <p className="tiny">{business.vatNote}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema([{ name: 'Kontakt', path: '/kontakt' }])} />
    </>
  );
}
