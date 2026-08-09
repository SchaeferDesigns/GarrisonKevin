import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CtaSection from '@/components/CtaSection';
import FaqList from '@/components/FaqList';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import { faqs } from '@/lib/business';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Häufige Fragen zu Bodenverlegung, Preisen und Ablauf',
  description:
    'Antworten zu Preisen, Material, Einsatzgebiet, Terminen, kleinen Aufträgen und Zahlung – Bodenverlegung in Aalen und Umgebung.',
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        kicker="Häufige Fragen"
        title="Fragen und Antworten"
        lead="Antworten zu Preisen, Material, Terminen und Einsatzgebiet. Ist Ihre Frage nicht dabei, schreiben Sie mir einfach."
        crumbs={[{ name: 'FAQ', path: '/faq' }]}
      />

      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container container--narrow">
          <FaqList items={faqs} openFirst />

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
