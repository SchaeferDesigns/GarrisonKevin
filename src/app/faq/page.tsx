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
    'Antworten auf die häufigsten Fragen: Kosten pro Quadratmeter, Material, Einsatzgebiet, Terminvergabe, kleine Aufträge und Umsatzsteuer.',
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        kicker="Häufige Fragen"
        title="Antworten, bevor Sie fragen müssen"
        lead="Die Fragen, die vor einer Beauftragung am häufigsten kommen – ehrlich beantwortet. Ist Ihre Frage nicht dabei, schreiben Sie mir einfach."
        crumbs={[{ name: 'FAQ', path: '/faq' }]}
      />

      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container container--narrow">
          <FaqList items={faqs} openFirst />

          <div className="panel panel--muted mt-8">
            <h2 style={{ fontSize: '1.3rem' }}>Ihre Frage war nicht dabei?</h2>
            <p className="small muted">
              Schreiben Sie mir kurz, worum es geht. Eine ehrliche Einschätzung bekommen Sie auch dann, wenn am Ende
              kein Auftrag daraus wird.
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
