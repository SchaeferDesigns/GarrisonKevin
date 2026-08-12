'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Regelt, wo eine Seite nach einem Wechsel beginnt.
 *
 *   Normaler Wechsel   → ganz oben.
 *   Zurück oder Vor    → wieder dort, wo man war. Das gilt auch für die
 *                        Wischgeste am Rand des Bildschirms, sie löst
 *                        dasselbe popstate aus wie die Zurück-Taste.
 *   Link mit #Marke    → unangetastet, das macht der Browser.
 *
 * Nötig ist das, weil `html { scroll-behavior: smooth }` das Zurückspringen
 * des Routers in eine Animation verwandelt, die bei kurzen Seiten unterwegs
 * stehen bleibt. Und weil der Inhalt der neuen Seite erst nach dem Wechsel
 * steht: Auf eine gemerkte Position lässt sich erst scrollen, wenn die Seite
 * hoch genug ist – deshalb der kurze Versuchslauf über einige Bilder.
 */

/** Zuletzt gesehene Scrollposition je Seite, überlebt den Seitenwechsel. */
const positionen = new Map<string, number>();

function stelleWiederHer(ziel: number) {
  let versuche = 0;

  const schritt = () => {
    const grenze = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: Math.min(ziel, Math.max(0, grenze)), left: 0, behavior: 'instant' });

    /* Solange die Seite noch wächst, weiter versuchen – aber nicht ewig. */
    versuche += 1;
    if (Math.abs(window.scrollY - ziel) > 2 && grenze < ziel && versuche < 20) {
      requestAnimationFrame(schritt);
    }
  };

  requestAnimationFrame(schritt);
}

export default function ScrollReset() {
  const pathname = usePathname();
  const kamVonZurueck = useRef(false);

  /* Zurück und Vor melden sich über popstate, bevor React neu rendert. */
  useEffect(() => {
    const onPop = () => {
      kamVonZurueck.current = true;
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  /* Position der aktuellen Seite laufend mitschreiben. */
  useEffect(() => {
    const seite = pathname;
    let frame = 0;

    const merken = () => {
      frame = 0;
      positionen.set(seite, window.scrollY);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(merken);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      positionen.set(seite, window.scrollY);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (kamVonZurueck.current) {
      kamVonZurueck.current = false;
      const ziel = positionen.get(pathname) ?? 0;
      if (ziel > 0) stelleWiederHer(ziel);
      return;
    }

    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
