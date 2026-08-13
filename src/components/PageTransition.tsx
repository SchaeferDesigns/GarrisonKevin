'use client';

import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import styles from './PageTransition.module.css';

/* Außerhalb der Komponente, weil der Router sie beim Seitenwechsel neu
   aufbaut – eine Variable im Inneren stünde dann wieder auf Anfang und jede
   Seite gälte als die erste. */
let ersteAnsichtStand = false;

/**
 * Kurzes Einblenden beim Seitenwechsel.
 *
 * Nur die neue Seite blendet auf, es gibt kein Ausblenden der alten. Ein
 * Ausblenden müsste abgewartet werden und macht jeden Wechsel spürbar
 * langsamer – gewonnen wäre nichts.
 *
 * Kopfleiste, Fußbereich und Kontaktleiste stehen außerhalb und bleiben
 * stehen. Genau das lässt den Wechsel nach Anwendung aussehen und nicht nach
 * neu geladener Seite.
 *
 * Beim allerersten Aufbau läuft nichts: Die Startansicht soll sofort stehen
 * und nicht erst hereinwandern.
 *
 * Bewegt wird nur transform und opacity. Beides bleibt nicht stehen, sobald
 * die Bewegung durch ist – ein dauerhaftes transform würde das mitlaufende
 * Ergebnisfeld im Preisrechner aus seiner Verankerung heben.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const istErsteAnsicht = !ersteAnsichtStand;

  useEffect(() => {
    ersteAnsichtStand = true;
  }, []);

  return (
    <div key={pathname} className={istErsteAnsicht ? undefined : styles.seite}>
      {children}
    </div>
  );
}
