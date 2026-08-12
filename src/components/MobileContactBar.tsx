import Link from 'next/link';
import Icon from './Icon';
import { telLink, whatsappLink } from '@/lib/business';
import styles from './MobileContactBar.module.css';

const waText =
  'Hallo Herr Garrison, ich habe Ihre Website gesehen und interessiere mich für ein Angebot. Es geht um folgende Arbeiten:';

/**
 * Feste Kontaktleiste am unteren Rand auf Mobilgeräten:
 * kürzester Weg vom Interesse zur Anfrage.
 */
export default function MobileContactBar() {
  return (
    <>
      <nav className={styles.bar} aria-label="Schnellkontakt">
        <a href={telLink} className={styles.item}>
          <Icon name="phone" size={19} />
          Anrufen
        </a>
        <a href={whatsappLink(waText)} className={styles.item} target="_blank" rel="noreferrer">
          <Icon name="whatsapp" size={19} />
          WhatsApp
        </a>
        <Link href="/kontakt" className={`${styles.item} ${styles.itemPrimary}`}>
          <Icon name="document" size={19} />
          Anfrage
        </Link>
      </nav>
    </>
  );
}
