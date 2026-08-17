import styles from './PageHeroArt.module.css';

type PageHeroArtProps = {
  /** Verschiebt den Lichtverlauf, damit nicht jede Seite gleich aussieht. */
  variant?: number;
};

/**
 * Hintergrund im Seitenkopf: eine ruhige grüne Fläche.
 *
 * Vorher lag hier ein Fugenbild. Es sah für sich gut aus, aber die Linien
 * schnitten beim Lesen durch die Schrift – auf einer Seite, deren Aufgabe das
 * Lesen ist, wiegt das schwerer als das Motiv. Der bewegte Boden bleibt der
 * Startseite vorbehalten, dort steht er für sich.
 *
 * Was bleibt, ist ein weicher Verlauf: warmes Licht oben links, Grün nach
 * unten rechts. Er gibt Tiefe, ohne dass irgendwo eine Kante entsteht.
 */
export default function PageHeroArt({ variant = 0 }: PageHeroArtProps) {
  return (
    <div className={styles.art} data-variant={variant} aria-hidden="true">
      <div className={styles.ton} />
      <div className={styles.schleier} />
    </div>
  );
}
