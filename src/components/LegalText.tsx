import styles from './LegalPage.module.css';

/**
 * Gibt einen Rechtstext aus.
 *
 * Der Inhalt ist HTML aus src/content und wird beim Bauen eingelesen – er
 * stammt also aus dem Projekt selbst und nicht aus einer Eingabe. Deshalb wird
 * er unverändert eingesetzt; die Auszeichnung der Generatoren bleibt erhalten.
 * Das Aussehen bestimmt die Seite über .prose.
 */
export default function LegalText({ html }: { html: string }) {
  if (!html) return null;
  return <div className={styles.prose} dangerouslySetInnerHTML={{ __html: html }} />;
}
