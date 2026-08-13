import type { CSSProperties } from 'react';
import styles from './PageHeroArt.module.css';

type PageHeroArtProps = {
  /** Verschiebt Muster und Lichtpunkte, damit nicht jede Seite gleich aussieht. */
  variant?: number;
};

/**
 * Auf welcher Reihenfuge ein Lichtpunkt entlangläuft, wie lange er dafür
 * braucht und in welche Richtung. Die y-Werte sind Fugen des Musters (alle 52
 * Einheiten) und liegen auf jedem Format im sichtbaren Ausschnitt.
 */
const funken = [
  { y: 156.5, dauer: 15, rueckwaerts: false },
  { y: 208.5, dauer: 22, rueckwaerts: true },
  { y: 260.5, dauer: 17.5, rueckwaerts: false },
  { y: 312.5, dauer: 26, rueckwaerts: true },
];

/**
 * Motiv im Seitenkopf: ein Laminatboden von oben.
 *
 * Die Dielen liegen im Drittelverband, so wie sie auch verlegt werden – jede
 * Reihe ist um ein Drittel der Dielenlänge versetzt, erst die vierte Reihe
 * wiederholt das Muster. In den Fugen wandern vier Lichtpunkte entlang,
 * unterschiedlich schnell und in beide Richtungen, damit kein Takt entsteht.
 * Alles Inline-SVG und CSS: kein Foto, keine zusätzliche Datei.
 *
 * Beim Aufbau der Seite legt sich der Boden einmal von links nach rechts.
 * Diese Bewegung läuft genau einmal, das Fugenlicht danach dauerhaft, aber
 * langsam genug, dass es vom Text nicht ablenkt.
 *
 * Boden und Lichter liegen in zwei getrennten SVGs mit identischer Geometrie.
 * So muss beim Animieren nur die kleine obere Ebene neu gezeichnet werden und
 * nicht die gemusterte Fläche darunter.
 */
export default function PageHeroArt({ variant = 0 }: PageHeroArtProps) {
  const dielenId = `dielen-${variant}`;
  const scheinId = `schein-${variant}`;

  return (
    <div className={styles.art} data-variant={variant} aria-hidden="true">
      <svg className={styles.canvas} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 420">
        <defs>
          <pattern id={dielenId} width="468" height="156" patternUnits="userSpaceOnUse">
            {/* Leichte Tonunterschiede – kein Boden ist durchgehend gleich. */}
            <rect x="0" y="0" width="468" height="52" className={styles.plankLight} />
            <rect x="156" y="52" width="312" height="52" className={styles.plankDark} />
            <rect x="0" y="104" width="312" height="52" className={styles.plankLight} />
            <rect x="312" y="104" width="156" height="52" className={styles.plankDark} />

            {/* Reihenfugen */}
            <path d="M0 0.5H468M0 52.5H468M0 104.5H468M0 155.5H468" className={styles.seam} />
            {/* Stöße, je Reihe um ein Drittel der Diele versetzt */}
            <path d="M0.5 0V52M467.5 0V52" className={styles.joint} />
            <path d="M156.5 52V104" className={styles.joint} />
            <path d="M312.5 104V156" className={styles.joint} />

            {/* Maserung, in jeder Reihe anders gesetzt */}
            <path d="M0 12H468M0 26H468M0 41H468" className={styles.grain} />
            <path d="M0 66H468M0 81H468M0 95H468" className={styles.grain} />
            <path d="M0 116H468M0 132H468M0 147H468" className={styles.grain} />
          </pattern>
        </defs>

        <rect width="1200" height="420" fill={`url(#${dielenId})`} className={styles.floor} />
      </svg>

      {/* Lichtpunkte in den Fugen. Gleicher viewBox-Ausschnitt wie der Boden,
          dadurch sitzen sie exakt auf den Fugen. */}
      <svg className={styles.sparks} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 420">
        <defs>
          <radialGradient id={scheinId}>
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.62" />
            <stop offset="32%" stopColor="#ffffff" stopOpacity="0.17" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {funken.map((funke, index) => (
          <g
            key={funke.y}
            className={styles.spark}
            data-rueckwaerts={funke.rueckwaerts || undefined}
            style={
              {
                '--dauer': `${funke.dauer}s`,
                /* Negativer Start: die Punkte sind beim Laden schon unterwegs
                   und stehen nicht alle gleichzeitig am Rand. */
                '--start': `${-(3.1 * index + 1.9 * variant + 1)}s`,
              } as CSSProperties
            }
          >
            <ellipse cx="0" cy={funke.y} rx="52" ry="15" fill={`url(#${scheinId})`} />
            <ellipse cx="0" cy={funke.y} rx="15" ry="1.1" className={styles.sparkCore} />
          </g>
        ))}
      </svg>

      {/* Ganz oben: dämpft Fugen und Licht dort, wo der Text steht. Ein heller
          Strich in Zeilenhöhe sähe sonst aus wie durchgestrichen. */}
      <div className={styles.glow} />
    </div>
  );
}
