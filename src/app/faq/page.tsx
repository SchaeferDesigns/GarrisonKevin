import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CtaSection from '@/components/CtaSection';
import FaqList from '@/components/FaqList';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import { faqGroups, faqs } from '@/lib/business';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Häufige Fragen zu Bodenverlegung, Preisen und Ablauf',
  description:
    'Antworten zu Preisen, Material, Nutzungsklasse und Verschnitt, Vorbereitung des Raums, Terminen und Einsatzgebiet – Bodenverlegung in Aalen und Umgebung.',
  alternates: { canonical: '/faq' },
};

/** Rubrikname zu Sprungmarke: „Preis & Leistung“ wird zu „preis-leistung“. */
const slug = (group: string) =>
  group
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export default function FaqPage() {
  return (
    <>
      <PageHero
        kicker="Häufige Fragen"
        title="Fragen und Antworten"
        lead="Antworten zu Preisen, Material, Vorbereitung und Terminen. Ist Ihre Frage nicht dabei, schreiben Sie mir einfach."
        crumbs={[{ name: 'FAQ', path: '/faq' }]}
      />

      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container container--narrow">
          <nav className="chip-row" aria-label="Rubriken">
            {faqGroups.map((group) => (
              <a key={group} href={`#${slug(group)}`} className="chip">
                {group}
              </a>
            ))}
          </nav>

          {faqGroups.map((group, index) => {
            const items = faqs.filter((faq) => faq.group === group);
            if (!items.length) return null;
            return (
              <section key={group} id={slug(group)} className="faq-section mt-8">
                <h2 className="faq-group">{group}</h2>
                <FaqList items={items} openFirst={index === 0} />
              </section>
            );
          })}

          <div className="panel panel--muted mt-8">
            <h2 style={{ fontSize: '1.3rem' }}>Ihre Frage war nicht dabei?</h2>
            <p className="small muted">
              Schreiben Sie mir kurz, worum es geht – per WhatsApp, E-Mail oder Telefon, Montag bis Samstag von 8 bis
              18 Uhr.
            </p>
            <div className="btn-row">
              <Link href="/kontakt" className="btn btn--accent">
                Frage stellen
                <Icon name="arrow-right" size={17} />
              </Link>
              <Link href="/preise" className="btn btn--ghost">
                Preise ansehen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaSection />

      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema([{ name: 'FAQ', path: '/faq' }])} />
    </>
  );
}
