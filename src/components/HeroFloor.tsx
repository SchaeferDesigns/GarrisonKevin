'use client';

import { useEffect, useRef } from 'react';
import styles from './HeroFloor.module.css';

/**
 * Kulisse der Startseite: ein Dielenboden in Perspektive, der beim Scrollen
 * unter dem Betrachter wegläuft, dazu zwei versetzte Lichtebenen.
 *
 * Bewusst kein Foto und kein Video: Alles entsteht aus CSS-Verläufen, kostet
 * also keine Ladezeit und behauptet nichts, was nicht belegt ist. Gezeigt wird
 * die Sache selbst – Reihe für Reihe verlegte Dielen.
 *
 * Der Scrollwert wird einmal je Bild gesetzt und als CSS-Variable übergeben,
 * damit die Ebenen im Compositor laufen und nichts neu berechnet wird.
 */
export default function HeroFloor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      /* Über die Höhe des Heros normieren: 0 am Anfang, 1 beim Verlassen. */
      const fortschritt = Math.min(1, window.scrollY / Math.max(1, element.offsetHeight));
      element.style.setProperty('--scroll', fortschritt.toFixed(4));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className={styles.stage} ref={ref} aria-hidden="true">
      <div className={styles.sky} />
      <div className={styles.glow} />
      <div className={styles.room}>
        <div className={styles.floor}>
          <div className={styles.planks} />
          <div className={styles.seams} />
        </div>
      </div>
      <div className={styles.haze} />
    </div>
  );
}
