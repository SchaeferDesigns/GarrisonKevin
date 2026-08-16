import styles from './PageHeroArt.module.css';

type PageHeroArtProps = {
  /** Verschiebt das Fugenbild, damit nicht jede Seite gleich aussieht. */
  variant?: number;
};

/**
 * Motiv im Seitenkopf: eine Bodenfläche in Bodenfarben.
 *
 * Die Fläche selbst ist ruhig – nur ein warmer Ton. Gezeichnet sind allein die
 * Fugen: dünne Linien im Drittelverband, so wie ein Boden verlegt wird.
 *
 * Darunter wandert ein großes, weiches Licht. Man sieht es nie direkt: Seine
 * Ebene ist mit genau demselben Fugenbild maskiert, es scheint also nur dort
 * durch, wo eine Fuge ist. Zieht es vorbei, leuchten die Fugen der Reihe nach
 * auf und gehen wieder aus – die Fläche daneben bleibt ruhig.
 *
 * Fugenbild und Maske sind dieselbe Datei, deshalb sitzen sie zwangsläufig
 * aufeinander. Bewegt wird ausschließlich transform, das läuft im Compositor.
 */
export default function PageHeroArt({ variant = 0 }: PageHeroArtProps) {
  return (
    <div className={styles.art} data-variant={variant} aria-hidden="true">
      <div className={styles.ton} />
      <div className={styles.rillen} />

      {/* Die Maske sitzt auf der ruhenden Hülle, bewegt wird das Licht darin.
          Andersherum würden die Fugen mitwandern. */}
      <div className={styles.fugenlicht}>
        <div className={styles.licht} />
      </div>

      <div className={styles.schleier} />
    </div>
  );
}
