import Icon from './Icon';
import type { Faq } from '@/lib/business';
import styles from './FaqList.module.css';

type FaqListProps = {
  items: Faq[];
  tone?: 'light' | 'dark';
  /** Erste Frage standardmäßig geöffnet – senkt die Einstiegshürde. */
  openFirst?: boolean;
};

/**
 * Aufklappbare Fragenliste auf Basis von <details>.
 * Funktioniert auch ohne JavaScript und ist von Haus aus barrierefrei.
 */
export default function FaqList({ items, tone = 'light', openFirst = false }: FaqListProps) {
  return (
    <div className={styles.list} data-tone={tone}>
      {items.map((faq, i) => (
        <details key={faq.question} className={styles.item} open={openFirst && i === 0}>
          <summary className={styles.summary}>
            {faq.question}
            <Icon name="chevron-down" size={19} />
          </summary>
          <p className={styles.answer}>{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
