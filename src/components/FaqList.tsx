'use client';

import { useRef, useState } from 'react';
import Icon from './Icon';
import type { Faq } from '@/lib/business';
import styles from './FaqList.module.css';

type FaqListProps = {
  items: Faq[];
  tone?: 'light' | 'dark';
  /** Erste Frage standardmäßig geöffnet – senkt die Einstiegshürde. */
  openFirst?: boolean;
};

const AUF = 340;
const ZU = 260;

/**
 * Eine Frage mit ihrer Antwort.
 *
 * Grundlage bleibt <details>: ohne JavaScript klappt es weiterhin auf, und die
 * Bedienung über Tastatur und Vorlesesoftware bringt der Browser mit.
 *
 * Das Auf- und Zuschieben muss aber von Hand kommen. <details> blendet den
 * Inhalt im geschlossenen Zustand komplett aus, deshalb lässt sich daran mit
 * reinem CSS nichts überblenden. Beim Schließen bleibt das Element also so
 * lange offen, bis die Bewegung durch ist.
 */
function Frage({ faq, offen }: { faq: Faq; offen: boolean }) {
  const details = useRef<HTMLDetailsElement>(null);
  const huelle = useRef<HTMLDivElement>(null);
  const laeuft = useRef<Animation | null>(null);
  const [auf, setAuf] = useState(offen);

  const umschalten = (event: React.MouseEvent) => {
    const element = details.current;
    const inhalt = huelle.current;
    if (!element || !inhalt) return;

    event.preventDefault();
    laeuft.current?.cancel();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.open = !auf;
      setAuf(!auf);
      return;
    }

    if (!element.open) {
      element.open = true;
      setAuf(true);
      laeuft.current = inhalt.animate(
        [
          { height: '0px', opacity: 0 },
          { height: `${inhalt.scrollHeight}px`, opacity: 1 },
        ],
        { duration: AUF, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
    } else {
      setAuf(false);
      laeuft.current = inhalt.animate(
        [
          { height: `${inhalt.scrollHeight}px`, opacity: 1 },
          { height: '0px', opacity: 0 },
        ],
        { duration: ZU, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      );
      /* Erst schließen, wenn die Bewegung durch ist – sonst verschwindet der
         Inhalt sofort und es gäbe nichts zu sehen. */
      laeuft.current.onfinish = () => {
        element.open = false;
      };
    }
  };

  return (
    <details ref={details} className={styles.item} open={offen} data-auf={auf || undefined}>
      <summary className={styles.summary} onClick={umschalten}>
        {faq.question}
        <Icon name="chevron-down" size={19} />
      </summary>
      <div ref={huelle} className={styles.huelle}>
        <p className={styles.answer}>{faq.answer}</p>
      </div>
    </details>
  );
}

/** Aufklappbare Fragenliste. */
export default function FaqList({ items, tone = 'light', openFirst = false }: FaqListProps) {
  return (
    <div className={styles.list} data-tone={tone}>
      {items.map((faq, i) => (
        <Frage key={faq.question} faq={faq} offen={openFirst && i === 0} />
      ))}
    </div>
  );
}
