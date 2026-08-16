import Icon from './Icon';
import LegalText from './LegalText';
import PageHero from './PageHero';
import { readLegalText, type LegalSlug } from '@/lib/legal';
import styles from './LegalPage.module.css';

type LegalPageProps = {
  slug: LegalSlug;
  title: string;
  lead: string;
  /** Verschiebt das Motiv im Seitenkopf, damit die vier sich unterscheiden. */
  variant?: number;
};

/**
 * Gerüst für alle Rechtsseiten. Es unterscheidet sie nur durch Titel, Vorspann
 * und die Datei, aus der der Text kommt – so bleibt das Aussehen zwangsläufig
 * gleich, egal wie viele davon noch dazukommen.
 *
 * Solange die Datei leer ist, steht hier ein Hinweis statt einer leeren Seite.
 */
export default function LegalPage({ slug, title, lead, variant = 0 }: LegalPageProps) {
  const html = readLegalText(slug);

  return (
    <>
      <PageHero
        variant={variant}
        kicker="Rechtliches"
        title={title}
        lead={lead}
        crumbs={[{ name: title, path: `/${slug}` }]}
      />

      <section className="section">
        <div className="ambient" aria-hidden="true" />
        <div className="container">
          {html ? (
            <LegalText html={html} />
          ) : (
            <div className={styles.placeholder}>
              <Icon name="info" size={21} />
              <div>
                <h2>{title} wird noch eingepflegt</h2>
                <p>Der Text folgt in Kürze.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
