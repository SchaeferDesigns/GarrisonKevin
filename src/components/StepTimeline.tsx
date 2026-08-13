'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import type { Step } from '@/lib/business';
import styles from './StepTimeline.module.css';

/**
 * Die Arbeitsschritte an einer senkrechten Linie, deren Füllung mit dem
 * Scrollen mitwächst.
 *
 * Der Fortschritt hängt nicht daran, wie weit die Seite insgesamt gescrollt
 * ist, sondern daran, wie weit dieser Abschnitt an einer festen Höhe im Bild
 * vorbeigezogen ist – bei 45 Prozent der Fensterhöhe, also knapp über der
 * Mitte, wo man beim Lesen hinschaut. Dadurch bleibt der Punkt beim Scrollen
 * immer an derselben Stelle im Verhältnis zum Abschnitt: weiter runter
 * gescrollt heißt weiter unten in der Linie.
 *
 * Der Wert steht als --fortschritt (0 bis 1) am Listenelement. Die Füllung
 * und die Zustände der Schritte lesen ihn in CSS – gerechnet wird also einmal
 * je Bild, gezeichnet ohne weiteres Zutun von JavaScript.
 *
 * Wann ein Schritt als erreicht gilt, wird gemessen statt gerechnet: Die
 * Schritte sind unterschiedlich hoch, weil ihre Texte verschieden lang sind.
 * Eine gleichmäßige Verteilung ließe die Nummern aufleuchten, bevor die
 * Füllung bei ihnen ist.
 */
export default function StepTimeline({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;

    /* Schwelle je Schritt: wo seine Nummer auf der Schiene sitzt, gemessen an
       der Schiene selbst – die läuft von Nummernmitte zu Nummernmitte. */
    const mitteVon = (eintrag: HTMLLIElement) => {
      const nummer = eintrag.firstElementChild?.getBoundingClientRect();
      return nummer ? nummer.top + nummer.height / 2 : null;
    };

    const messeSchwellen = () => {
      const schiene = element.querySelector('[data-schiene]');
      if (!(schiene instanceof HTMLElement)) return;

      const eintraege = [...element.querySelectorAll<HTMLLIElement>('li')];
      const erste = eintraege.length ? mitteVon(eintraege[0]) : null;
      const letzte = eintraege.length ? mitteVon(eintraege[eintraege.length - 1]) : null;
      if (erste === null || letzte === null) return;

      /* Die Schiene läuft von der Mitte der ersten bis zur Mitte der letzten
         Nummer. Ein fester Abstand zum Listenrand ließe unter dem letzten
         Schritt einen Stummel stehen – der letzte Eintrag ist höher als seine
         Nummer, weil sein Text darunter weiterläuft. */
      const lk = element.getBoundingClientRect();
      element.style.setProperty('--schiene-oben', `${(erste - lk.top).toFixed(1)}px`);
      element.style.setProperty('--schiene-unten', `${(lk.bottom - letzte).toFixed(1)}px`);

      /* Erst danach die Schwellen: sie hängen an der neuen Höhe der Schiene. */
      const sk = schiene.getBoundingClientRect();
      if (sk.height < 1) return;

      eintraege.forEach((eintrag) => {
        const mitte = mitteVon(eintrag);
        if (mitte === null) return;
        /* Ein kleiner Vorlauf, damit die Nummer aufleuchtet, sobald die
           Füllung sie berührt – und damit der letzte Schritt am Ende
           überhaupt umschlägt, denn dort steht der Fortschritt genau auf 1. */
        const roh = (mitte - sk.top) / sk.height;
        eintrag.style.setProperty('--stufe', Math.max(0, roh - 0.04).toFixed(4));
      });
    };

    const rechne = () => {
      frame = 0;
      const schiene = element.querySelector('[data-schiene]');
      if (!schiene) return;
      /* Gegen die Schiene rechnen, nicht gegen die Liste: Die Schwellen der
         Schritte hängen ebenfalls an ihr. Nur so endet die Füllung genau dort,
         wo die Nummer umschlägt. */
      const sk = schiene.getBoundingClientRect();
      const marke = window.innerHeight * 0.45;
      const roh = (marke - sk.top) / Math.max(1, sk.height);
      element.style.setProperty('--fortschritt', Math.min(1, Math.max(0, roh)).toFixed(4));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(rechne);
    };

    messeSchwellen();
    rechne();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Die Höhen ändern sich beim Drehen des Geräts und wenn die Schrift
       nachlädt – dann müssen die Schwellen neu gemessen werden. */
    const beobachter = new ResizeObserver(() => {
      messeSchwellen();
      rechne();
    });
    beobachter.observe(element);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      beobachter.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <ol className={styles.liste} ref={ref}>
      {/* Die Linie und ihre Füllung liegen hinter den Schritten. */}
      <div className={styles.schiene} data-schiene aria-hidden="true">
        <div className={styles.fuellung} />
      </div>

      {steps.map((step, i) => (
        <li
          key={step.title}
          className={styles.schritt}
          /* Vorbelegung für den ersten Aufbau, gleich darauf ersetzt durch den
             gemessenen Wert. */
          style={{ '--stufe': (i + 0.5) / steps.length } as CSSProperties}
        >
          <span className={styles.nummer} aria-hidden="true">
            {i + 1}
          </span>
          <div className={styles.text}>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
