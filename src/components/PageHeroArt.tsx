import styles from './PageHeroArt.module.css';

type PageHeroArtProps = {
  /** Verschiebt Muster und Licht, damit nicht jede Seite gleich aussieht. */
  variant?: number;
};

/**
 * Motiv im Seitenkopf: eine Bodenfläche in Bodenfarben.
 *
 * Die Fläche selbst ist ruhig – nur ein warmer Ton, keine Maserung, keine
 * abgesetzten Dielen. Gezeichnet sind allein die Fugen: dünne Linien im
 * Drittelverband, so wie ein Boden verlegt wird.
 *
 * Darüber wandert ein großes, weiches Licht. Es liegt im Modus color-dodge
 * auf der Fläche: Dunkles bleibt dunkel, Helles reißt auf. Weil nur die Fugen
 * hell sind, leuchten genau sie auf, wenn das Licht über sie hinwegzieht –
 * die Fläche daneben bleibt ruhig. Das ist der ganze Trick, und er kommt ohne
 * eine einzige zusätzliche Ebene aus.
 *
 * Bewegt wird ausschließlich transform, das läuft im Compositor.
 */
export default function PageHeroArt({ variant = 0 }: PageHeroArtProps) {
  const fugenId = `fugen-${variant}`;

  return (
    <div className={styles.art} data-variant={variant} aria-hidden="true">
      <div className={styles.ton} />

      <svg className={styles.canvas} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 420">
        <defs>
          <pattern id={fugenId} width="468" height="156" patternUnits="userSpaceOnUse">
            {/* Reihenfugen */}
            <path d="M0 0.5H468M0 52.5H468M0 104.5H468M0 155.5H468" className={styles.fuge} />
            {/* Stöße, je Reihe um ein Drittel der Diele versetzt */}
            <path d="M0.5 0V52M467.5 0V52" className={styles.fuge} />
            <path d="M156.5 52V104" className={styles.fuge} />
            <path d="M312.5 104V156" className={styles.fuge} />
          </pattern>
        </defs>

        <rect width="1200" height="420" fill={`url(#${fugenId})`} />
      </svg>

      <div className={styles.licht} />
      <div className={styles.schleier} />
    </div>
  );
}
