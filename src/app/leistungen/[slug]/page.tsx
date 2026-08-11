import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CtaSection from '@/components/CtaSection';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import FaqList from '@/components/FaqList';
import { business, faqs, hourlyRate, prices, processSteps, services } from '@/lib/business';
import { breadcrumbSchema, serviceSchema } from '@/lib/schema';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/leistungen/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `/leistungen/${service.slug}`,
    },
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const price = prices.find((p) => p.id === service.priceId);
  const others = services.filter((s) => s.slug !== service.slug);
  const schema = serviceSchema(service.slug);

  return (
    <>
      <PageHero
        kicker="Leistung"
        title={service.title}
        lead={service.short}
        crumbs={[
          { name: 'Leistungen', path: '/leistungen' },
          { name: service.title, path: `/leistungen/${service.slug}` },
        ]}
        variant={2}
      >
        {price && (
          <span className="badge badge--dark">
            <Icon name="euro" size={15} />
            ab {price.from} € {price.unit}
          </span>
        )}
        <span className="badge badge--dark">
          <Icon name="map-pin" size={15} />
          {business.serviceAreaLabel}
        </span>
        <span className="badge badge--dark">
          <Icon name="document" size={15} />
          Festpreis nach Besichtigung
        </span>
      </PageHero>

      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="split split--wide-left">
            <div className="prose">
              <span className="kicker">Was Sie bekommen</span>
              <h2>{service.title} – sauber ausgeführt</h2>
              <p className="lead">{service.intro}</p>

              <h3>Im Detail</h3>
              <ul className="list">
                {service.bullets.map((bullet) => (
                  <li key={bullet}>
                    <Icon name="check" size={18} />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            <Reveal className="panel">
              <span className="kicker">Preis</span>
              {price && (
                <>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2.4rem',
                      lineHeight: 1.05,
                      color: 'var(--forest-800)',
                    }}
                  >
                    ab {price.from} €
                  </span>
                  <span className="small muted" style={{ marginTop: '-0.6rem' }}>
                    {price.unitLong} · nur Arbeitsleistung
                  </span>
                  <p className="small muted">{price.note}</p>
                </>
              )}

              <hr className="rule" style={{ marginBlock: '0.4rem' }} />

              <ul className="list list--dense small">
                <li>
                  <Icon name="info" size={16} />
                  Material stellt und bezahlt der Kunde.
                </li>
                <li>
                  <Icon name="info" size={16} />
                  Kleine Aufträge unter {hourlyRate.thresholdOrderValue} €: ab {hourlyRate.amount} €/Std.
                </li>
                <li>
                  <Icon name="info" size={16} />
                  {business.vatNote}
                </li>
              </ul>

              <Link href="/kontakt" className="btn btn--accent btn--block">
                Angebot für {service.title} anfragen
                <Icon name="arrow-right" size={17} />
              </Link>
              <Link href="/leistungen#preise" className="btn btn--ghost btn--block btn--sm">
                <Icon name="calculator" size={16} />
                Richtwert berechnen
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="section-head">
            <span className="kicker">Ablauf</span>
            <h2>So läuft der Auftrag ab</h2>
          </div>
          <ol className="timeline">
            {processSteps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container container--narrow">
          <div className="section-head section-head--center">
            <span className="kicker kicker--plain">Fragen</span>
            <h2>Häufige Fragen zu Preis und Ablauf</h2>
          </div>
          <FaqList items={faqs.slice(0, 4)} openFirst />
          <div className="btn-row btn-row--center mt-8">
            <Link href="/faq" className="btn btn--ghost">
              Alle Fragen ansehen
              <Icon name="arrow-right" size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          <div className="section-head">
            <span className="kicker">Weitere Leistungen</span>
            <h2>Passt oft dazu</h2>
          </div>
          <div className="grid grid--2">
            {others.map((other) => (
              <Link key={other.slug} href={`/leistungen/${other.slug}`} className="card card--link">
                <span className="card__icon">
                  <Icon name={other.icon} size={22} />
                </span>
                <h3>{other.title}</h3>
                <p className="muted small">{other.short}</p>
                <span className="link" style={{ alignSelf: 'flex-start' }}>
                  Ansehen
                  <Icon name="arrow-right" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />

      {schema && <JsonLd data={schema} />}
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Leistungen', path: '/leistungen' },
          { name: service.title, path: `/leistungen/${service.slug}` },
        ])}
      />
    </>
  );
}
