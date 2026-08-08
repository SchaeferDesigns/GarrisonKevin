import Link from 'next/link';
import Icon from './Icon';
import Reveal from './Reveal';
import { business, telLink, whatsappLink } from '@/lib/business';
import styles from './CtaSection.module.css';

type CtaSectionProps = {
  title?: string;
  text?: string;
};

const waText =
  'Hallo Herr Garrison, ich möchte ein Angebot für Bodenverlegung / Sockelleisten / Fugen anfragen. Es geht um:';

/** Abschließender Handlungsaufruf – auf jeder Seite am Ende. */
export default function CtaSection({
  title = 'Besichtigung vereinbaren – danach entscheiden Sie',
  text = 'Die Besichtigung vor Ort und das schriftliche Angebot sind für Sie kostenlos und unverbindlich. Sie wissen vorher, was es kostet, und gehen kein Risiko ein.',
}: CtaSectionProps) {
  return (
    <section className={styles.wrap}>
      <div className="container">
        <Reveal>
          <div className={styles.panel}>
            <div className={styles.texture} aria-hidden="true" />
            <div className={styles.glow} aria-hidden="true" />
            <div>
              <span className="kicker">Nächster Schritt</span>
              <h2 className={`${styles.title} mt-4`}>{title}</h2>
              <p className={styles.text}>{text}</p>
            </div>

            <div className={styles.side}>
              <Link href="/kontakt" className="btn btn--accent btn--block btn--lg">
                <Icon name="document" size={18} />
                Angebot anfragen
              </Link>
              <a href={whatsappLink(waText)} className="btn btn--glass btn--block" target="_blank" rel="noreferrer">
                <Icon name="whatsapp" size={18} />
                Per WhatsApp schreiben
              </a>
              <a href={telLink} className="btn btn--glass btn--block">
                <Icon name="phone" size={18} />
                {business.phone}
              </a>
              <p className={styles.sideNote}>
                <Icon name="clock" size={16} />
                Antwort in der Regel innerhalb von 24 Stunden – auch abends und am Wochenende.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
