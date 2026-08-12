'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Bei jedem Seitenwechsel oben beginnen.
 *
 * Nötig, weil `html { scroll-behavior: smooth }` das automatische
 * Zurückspringen des Routers in eine Animation verwandelt – bei kurzen Seiten
 * bleibt sie dann auf halber Strecke stehen. Hier wird hart gesetzt.
 *
 * Sprungmarken bleiben unangetastet: Führt der Link auf `#rechner` oder
 * `#material`, macht der Browser seine Arbeit und wir halten uns raus.
 */
export default function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
