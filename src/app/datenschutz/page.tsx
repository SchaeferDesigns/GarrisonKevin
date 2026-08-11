import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import LegalText from '@/components/LegalText';
import Icon from '@/components/Icon';
import { readLegalText } from '@/lib/legal';
import styles from '@/components/LegalPage.module.css';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Informationen zur Verarbeitung personenbezogener Daten auf dieser Website.',
  alternates: { canonical: '/datenschutz' },
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  const text = readLegalText('datenschutz');

  return (
    <>
      <PageHero
        kicker="Rechtliches"
        title="Datenschutzerklärung"
        lead="Informationen zur Verarbeitung personenbezogener Daten nach Art. 13 und 14 DSGVO."
        crumbs={[{ name: 'Datenschutz', path: '/datenschutz' }]}
      />

      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          {text ? (
            <div className={styles.prose}>
              <LegalText text={text} />
            </div>
          ) : (
            <div className={styles.placeholder}>
              <Icon name="info" size={21} />
              <div>
                <h2>Datenschutzerklärung wird noch eingepflegt</h2>
                <p>Der Text folgt in Kürze.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
