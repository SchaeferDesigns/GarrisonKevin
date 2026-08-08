import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CtaSection from '@/components/CtaSection';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { business, notOffered, prices, services } from '@/lib/business';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Leistungen – Bodenverlegung, Sockelleisten & Fugen',
  description:
    'Alle Leistungen im Überblick: Laminat, Vinyl und Klickböden verlegen, Sockelleisten montieren, Acryl- und Silikonfugen erneuern – in Aalen und Umgebung.',
  alternates: { canonical: '/leistungen' },
};

export default function LeistungenPage() {
  return (
    <>
      <PageHero
        kicker="Leistungen"
        title="Boden, Leisten und Fugen aus einer Hand"
        lead="Drei Arbeiten, die zusammengehören und die ich deshalb auch zusammen anbiete. Sie brauchen keine zweite Firma für den letzten Meter."
        crumbs={[{ name: 'Leistungen', path: '/leistungen' }]}
      />

      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="grid grid--3">
            {services.map((service, i) => {
              const price = prices.find((p) => p.id === service.priceId);
              return (
                <Reveal key={service.slug} delay={i * 90}>
                  <article className="card card--link" style={{ height: '100%' }}>
                    <span className="card__icon">
                      <Icon name={service.icon} size={23} />
                    </span>
                    <h2 style={{ fontSize: '1.35rem' }}>{service.title}</h2>
                    <p className="muted">{service.short}</p>

                    <ul className="list list--dense small mt-2">
                      {service.bullets.slice(0, 4).map((bullet) => (
                        <li key={bullet}>
                          <Icon name="check" size={16} />
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        marginTop: 'auto',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--line)',
                      }}
                    >
                      {price && (
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                          ab {price.from} €
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                            {' '}
                            {price.unit}
                          </span>
                        </span>
                      )}
                      <Link href={`/leistungen/${service.slug}`} className="link">
                        Mehr erfahren
                        <Icon name="arrow-right" size={16} />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="split split--wide-left">
            <div>
              <span className="kicker">Zusatzarbeiten</span>
              <h2 className="mt-4">Was sich sinnvoll mitmachen lässt</h2>
              <p className="lead mt-4">
                Manches fällt beim Verlegen ohnehin an. Wenn es zusammen erledigt wird, sparen Sie sich einen zweiten
                Termin und die doppelte Anfahrt.
              </p>

              <ul className="list mt-6">
                {[
                  'Alten Belag aufnehmen und entsorgen',
                  'Untergrund reinigen, ausgleichen und grundieren',
                  'Übergangsprofile an Türen und Raumwechseln setzen',
                  'Türblätter am unteren Rand kürzen lassen (nach Absprache)',
                  'Dehnungsfugen und Anschlüsse sauber abdichten',
                  'Nacharbeiten an einzelnen Dielen oder Teilflächen',
                ].map((item) => (
                  <li key={item}>
                    <Icon name="check" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Reveal className="panel panel--muted">
              <h3>Diese Beläge verlege ich nicht</h3>
              <p className="small muted">
                Der Schwerpunkt liegt bewusst auf Laminat, Vinyl und Klickböden. Für die folgenden Beläge braucht es
                anderes Werkzeug und andere Routine – da wären Sie bei einem spezialisierten Betrieb besser aufgehoben.
              </p>
              <ul className="badge-row">
                {notOffered.map((item) => (
                  <li key={item} className="badge badge--accent">
                    <Icon name="ban" size={14} />
                    {item}
                  </li>
                ))}
              </ul>
              <hr className="rule" style={{ marginBlock: '0.5rem' }} />
              <p className="small muted">
                Gut zu wissen: Material stellt und bezahlt der Kunde. {business.vatNote}
              </p>
              <Link href="/preise" className="btn btn--ghost">
                Preise ansehen
                <Icon name="arrow-right" size={17} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection />

      <JsonLd data={breadcrumbSchema([{ name: 'Leistungen', path: '/leistungen' }])} />
    </>
  );
}
