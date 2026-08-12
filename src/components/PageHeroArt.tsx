import styles from './PageHeroArt.module.css';

type PageHeroArtProps = {
  /** Verschiebt Muster und Kante, damit nicht jede Seite gleich aussieht. */
  variant?: number;
};

/**
 * Motiv im Seitenkopf: eine Verlegekante.
 *
 * Links liegen fertig verlegte Dielen im Verband, rechts der vorbereitete
 * Untergrund, dazwischen die Kante, an der weitergearbeitet wird. Alles als
 * Inline-SVG und CSS – kein Foto, keine zusätzliche Datei, und es zeigt genau
 * das Handwerk, um das es geht.
 *
 * Beim Aufbau der Seite legt sich der Boden einmal von links nach rechts, und
 * die Arbeitskante zeichnet sich dabei. Die Bewegung läuft einmal und hört
 * dann auf – ein dauerhaft zappelnder Seitenkopf lenkt vom Text ab.
 */
export default function PageHeroArt({ variant = 0 }: PageHeroArtProps) {
  const id = `verlegemuster-${variant}`;
  const untergrundId = `untergrund-${variant}`;

  return (
    <div className={styles.art} data-variant={variant} aria-hidden="true">
      <svg className={styles.canvas} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 420">
        <defs>
          {/* Dielen im Verband: die Stöße jeder zweiten Reihe sind versetzt. */}
          <pattern id={id} width="320" height="128" patternUnits="userSpaceOnUse">
            <rect width="320" height="128" fill="none" />
            {/* Reihenfugen */}
            <path d="M0 0.5H320M0 64.5H320M0 127.5H320" className={styles.seam} />
            {/* Stöße, Reihe für Reihe versetzt */}
            <path d="M40 0.5V64M240 0.5V64" className={styles.joint} />
            <path d="M140 64.5V128" className={styles.joint} />
            {/* Andeutung der Maserung */}
            <path d="M0 22H320M0 42H320M0 86H320M0 106H320" className={styles.grain} />
          </pattern>

          {/* Untergrund: feine Schraffur wie Dämmunterlage. */}
          <pattern id={untergrundId} width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M-4 14L14 -4M4 22L22 4" className={styles.hatch} />
          </pattern>

          <linearGradient id={`kante-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(224,216,203,0)" />
            <stop offset="45%" stopColor="rgba(224,216,203,0.55)" />
            <stop offset="100%" stopColor="rgba(224,216,203,0)" />
          </linearGradient>

          {/* Die Kante teilt die Fläche: links verlegt, rechts vorbereitet. */}
          <clipPath id={`verlegt-${variant}`}>
            <polygon points="0,0 660,0 540,420 0,420" />
          </clipPath>
          <clipPath id={`offen-${variant}`}>
            <polygon points="660,0 1200,0 1200,420 540,420" />
          </clipPath>
        </defs>

        <g clipPath={`url(#verlegt-${variant})`}>
          <rect width="1200" height="420" fill={`url(#${id})`} className={styles.laid} />
        </g>
        <g clipPath={`url(#offen-${variant})`}>
          <rect width="1200" height="420" fill={`url(#${untergrundId})`} className={styles.underlay} />
        </g>

        <line
          className={styles.edge}
          x1="660"
          y1="0"
          x2="540"
          y2="420"
          stroke={`url(#kante-${variant})`}
          strokeWidth="2"
        />
      </svg>

      <div className={styles.glow} />
    </div>
  );
}
