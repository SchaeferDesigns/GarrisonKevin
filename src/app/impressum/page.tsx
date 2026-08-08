import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import LegalText from '@/components/LegalText';
import Icon from '@/components/Icon';
import { readLegalText } from '@/lib/legal';
import styles from '@/components/LegalPage.module.css';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und Anbieterkennzeichnung gemäß § 5 DDG.',
  alternates: { canonical: '/impressum' },
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  const text = readLegalText('impressum');

  return (
    <>
      <PageHero
        kicker="Rechtliches"
        title="Impressum"
        lead="Anbieterkennzeichnung gemäß § 5 Digitale-Dienste-Gesetz (DDG)."
        crumbs={[{ name: 'Impressum', path: '/impressum' }]}
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
                <h2>Impressum wird noch eingepflegt</h2>
                <p>
                  Der Impressumstext wird in der Datei <code>src/content/impressum.txt</code> hinterlegt. Sobald dort
                  Text steht, erscheint er automatisch an dieser Stelle. Überschriften lassen sich mit fünf Rauten
                  auszeichnen: <code>#####Überschrift#####</code>. Links und E-Mail-Adressen werden automatisch verlinkt.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
